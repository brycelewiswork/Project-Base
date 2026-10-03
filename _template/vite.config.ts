import path from "node:path"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { colorTokensPlugin } from "./vite-plugins/color-tokens"
// Resolves the `.wgsl` import graph at build time (import/export between shader
// modules, incl. `@vgpu/wgsl-std/*`) and hands effect()/draw() one finished
// shader. It does NOT validate WGSL — that gate is `pnpm check:shaders`.
import { wgslVitePlugin } from "@vgpu/wgsl/loader-vite"

export default defineConfig(({ mode }) => {
  // Load .env / .env.local (no VITE_ filter) for SERVER-side use only. The
  // ANTHROPIC_API_KEY stays in this Node process and is injected into proxied
  // requests below — it never reaches the client bundle.
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss(), colorTokensPlugin(), wgslVitePlugin()],
    server: {
      host: true,
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      // Same-origin proxy to the Anthropic API. Sketch code calls
      // `/api/anthropic/...` (see src/lib/anthropic.ts) and the dev server
      // forwards to api.anthropic.com with the secret key attached here. This
      // keeps the key off the client, sidesteps the browser-CORS block, and
      // works over LAN (the phone hits the PC's proxy, which has the key).
      proxy: {
        "/api/anthropic": {
          target: "https://api.anthropic.com",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/anthropic/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.ANTHROPIC_API_KEY) {
                proxyReq.setHeader("x-api-key", env.ANTHROPIC_API_KEY)
              }
              proxyReq.setHeader("anthropic-version", "2023-06-01")
            })
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
