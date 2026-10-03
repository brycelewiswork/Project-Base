import Anthropic from "@anthropic-ai/sdk"

/**
 * Anthropic client for sketches.
 *
 * Requests go to the same-origin Vite dev proxy at `/api/anthropic` (configured
 * in vite.config.ts), which attaches the real API key server-side from
 * `.env.local`. The key is NEVER in the client bundle — the `apiKey` below is a
 * throwaway placeholder the proxy overwrites. `dangerouslyAllowBrowser` is safe
 * here *because* no real key lives in the browser.
 *
 * `window.location.origin` keeps the base URL correct whether the page is opened
 * on localhost or over LAN on a phone.
 */
export const anthropic = new Anthropic({
  baseURL: `${window.location.origin}/api/anthropic`,
  apiKey: "proxied-by-vite-dev-server", // placeholder; the dev proxy injects the real key
  dangerouslyAllowBrowser: true,
})

/**
 * Default model — Sonnet 5.5, chosen for cost: sketches make a lot of throwaway
 * calls and it is a fraction of Opus. Pass a more capable tier per call
 * (`model: "claude-opus-5-5"`) when a sketch actually needs the reasoning.
 */
export const CLAUDE_MODEL = "claude-sonnet-5-5"

/**
 * Stream a single-prompt completion, yielding text as it arrives — handy for
 * typing-in UIs. For tool use, thinking, images, or multi-turn, use `anthropic`
 * directly (it's the full SDK).
 *
 * ```ts
 * for await (const chunk of streamText("Write a haiku about squircles")) {
 *   setText((t) => t + chunk)
 * }
 * ```
 */
export async function* streamText(
  prompt: string,
  opts: { model?: string; maxTokens?: number; system?: string } = {},
): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: opts.model ?? CLAUDE_MODEL,
    max_tokens: opts.maxTokens ?? 4096,
    system: opts.system,
    messages: [{ role: "user", content: prompt }],
  })
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text
    }
  }
}
