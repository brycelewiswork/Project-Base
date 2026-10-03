// Animated Voronoi cells. Imports a pure WGSL module from @vgpu/wgsl-std —
// the Vite plugin resolves that import graph at build time, which is the whole
// reason the loader is wired up (effect() also takes a plain string).
//
// Validate with `pnpm check:shaders` — Vite never validates WGSL.
import { voronoi3d } from "@vgpu/wgsl-std/noise";

struct Params {
  // vec2f first: it has the largest alignment, so no padding surprises.
  texel: vec2f,
  time: f32,
  scale: f32,
  edge: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Correct for the canvas aspect so cells stay square.
  let aspect = params.texel.y / params.texel.x;
  let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5) * params.scale;

  // Third axis is time: the feature points drift instead of sliding.
  let sample = voronoi3d(vec3f(p, params.time * 0.15));

  // f2 - f1 is near zero on a cell boundary: an edge mask for free.
  let border = smoothstep(0.0, params.edge, sample.f2 - sample.f1);

  // Stable per-cell hue from the integer cell id.
  let id = f32(sample.cell.x * 37 + sample.cell.y * 101 + sample.cell.z * 7);
  let hue = fract(id * 0.061);
  let cell = 0.5 + 0.5 * cos(6.2831853 * (hue + vec3f(0.0, 0.33, 0.67)));

  // Darken toward the cell centre, then lay the edges over the top.
  let body = cell * (0.35 + 0.65 * sample.f1);
  let rgb = mix(vec3f(1.0), body, border);

  return vec4f(rgb, 1.0);
}
