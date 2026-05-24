"""
Fetch all motion-primitives components directly from the GitHub registry and
write them into _template/src/components/ui/. Bypasses the rate-limited
motion-primitives.com/c/* endpoints.

Skips:
  - progressive-blur: would overwrite our hand-rolled LinearBlur/RadialBlur
  - registry: meta-file, not a component

Run: python _scripts/fetch-motion-primitives.py
"""
import base64
import json
import subprocess
import sys
from pathlib import Path

REPO = "ibelick/motion-primitives"
SKIP = {"progressive-blur", "registry"}
TEMPLATE = Path(__file__).parent.parent / "_template"
UI_DIR = TEMPLATE / "src" / "components" / "ui"


def gh(path: str) -> dict:
    out = subprocess.run(
        ["gh", "api", f"repos/{REPO}/contents/{path}"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return json.loads(out.stdout)


def fetch_text(path: str) -> str:
    payload = gh(path)
    return base64.b64decode(payload["content"]).decode("utf-8")


def list_components() -> list[str]:
    entries = gh("public/c")
    names = []
    for e in entries:
        if e["type"] == "file" and e["name"].endswith(".json"):
            name = e["name"][:-5]
            if name not in SKIP:
                names.append(name)
    return sorted(names)


def install_component(name: str, deps: set[str], reg_deps: set[str]):
    body = fetch_text(f"public/c/{name}.json")
    payload = json.loads(body)
    deps.update(payload.get("dependencies", []) or [])
    for f in payload.get("files", []) or []:
        target = UI_DIR / Path(f["path"]).name
        target.parent.mkdir(parents=True, exist_ok=True)
        # Strip 'use client' directive (irrelevant in Vite SPA, just noise)
        content = f["content"]
        if content.startswith("'use client';\n"):
            content = content[len("'use client';\n") :].lstrip()
        elif content.startswith('"use client";\n'):
            content = content[len('"use client";\n') :].lstrip()
        target.write_text(content, encoding="utf-8")
        print(f"  wrote {target.relative_to(TEMPLATE)}")
    for rd in payload.get("registryDependencies", []) or []:
        reg_deps.add(rd)


def main():
    UI_DIR.mkdir(parents=True, exist_ok=True)
    names = list_components()
    print(f"Found {len(names)} components (skipping {sorted(SKIP)})")
    deps: set[str] = set()
    reg_deps: set[str] = set()
    for n in names:
        print(f"--- {n}")
        install_component(n, deps, reg_deps)
    print()
    print("npm dependencies surfaced:", sorted(deps))
    print("registry dependencies (NOT auto-installed):", sorted(reg_deps))


if __name__ == "__main__":
    main()
