#!/usr/bin/env node
/**
 * check-shaders — validate every `.wgsl` file against a real WebGPU device.
 *
 * Why this exists: neither Vite's `wgslVitePlugin()` nor `vite build` validates
 * WGSL. The loader resolves the import graph (parse, purity, DCE, mangling) with
 * `validate: false`, and a leaf `.wgsl` with no imports never reaches the
 * resolver at all — so a broken shader builds clean and fails at runtime in the
 * browser. `vgpu check --require-validation` is the actual gate: it resolves the
 * same graph the loader does and compiles it on a device.
 *
 * `vgpu check` takes one file and does not glob, hence this wrapper. It walks
 * `src/`, checks each shader, and prints the reflected bindings so a uniform
 * rename shows up here rather than as a silent black canvas.
 *
 * Passes trivially when a sketch has no shaders, so it is safe in a chain.
 *
 * Run: `pnpm check:shaders`
 */
import { execFileSync } from "node:child_process"
import { readdirSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const src = join(root, "src")

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith(".wgsl")) out.push(p)
  }
  return out
}

const shaders = walk(src).sort()

if (shaders.length === 0) {
  console.log("✅ no .wgsl files — nothing to validate")
  process.exit(0)
}

const failed = []

for (const file of shaders) {
  const rel = relative(root, file)
  let report
  try {
    report = JSON.parse(
      execFileSync("vgpu", ["check", file, "--require-validation"], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    )
  } catch (err) {
    // An invalid shader makes `vgpu check` exit non-zero, but it still prints a
    // full JSON report on stdout — the useful part is validation.error. Fall
    // back to the raw text only when that shape isn't there.
    const raw = (err.stdout?.toString() ?? "").trim()
    console.error(`❌ ${rel}`)
    let printed = false
    try {
      const parsed = JSON.parse(raw)
      for (const d of [parsed.validation?.error, ...(parsed.diagnostics ?? [])].filter(Boolean)) {
        const where = d.line != null ? ` ${d.line}:${d.column}` : ""
        console.error(`   ${d.code ?? "error"}${where} ${d.message}`)
        printed = true
      }
    } catch {
      /* not JSON — handled below */
    }
    if (!printed) console.error(`   ${raw || err.message}`)
    failed.push(rel)
    continue
  }

  const diagnostics = report.diagnostics ?? []
  const validated = report.validation?.ok === true
  if (!validated || diagnostics.length > 0) {
    console.error(`❌ ${rel}`)
    for (const d of diagnostics) {
      console.error(`   ${d.code ?? "error"} ${d.line}:${d.column} ${d.message}`)
    }
    if (!validated) console.error(`   device validation did not pass`)
    failed.push(rel)
    continue
  }

  const bindings = (report.reflection?.bindings ?? [])
    .map((b) => `@group(${b.group}) @binding(${b.binding}) ${b.name}`)
    .join(", ")
  const deps = (report.deps ?? []).length - 1 // the entry itself is in deps
  console.log(
    `✅ ${rel}${deps > 0 ? ` (+${deps} module${deps === 1 ? "" : "s"})` : ""}` +
      (bindings ? `\n   ${bindings}` : ""),
  )
}

console.log(
  `\n${failed.length === 0 ? "✅" : "❌"} ${shaders.length} shader${shaders.length === 1 ? "" : "s"} checked, ${failed.length} failed`,
)

if (failed.length > 0) {
  console.error(
    "\nFix the WGSL above. `vgpu check <file> --require-validation` reproduces one file;\n" +
      "`npx vgpu docs find \"<VGPU-error-code>\"` explains a code.",
  )
  process.exit(1)
}
