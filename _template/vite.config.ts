import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Vite cache lives outside Dropbox to avoid file-locking conflicts during
  // dep optimization.
  cacheDir: path.resolve(process.env.LOCALAPPDATA ?? __dirname, "vite-cache/_template"),
})
