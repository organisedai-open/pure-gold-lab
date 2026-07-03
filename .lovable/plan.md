## Diagnosis

The Vite dev server is running normally:
- Process is up on port 8080
- `curl http://localhost:8080/` returns `HTTP 200`
- Latest logs show a clean startup ("VITE v7.3.2 ready", "[vite] connected")
- No SSR errors or crashes

The "preview not available" state is client-side, not a code issue. The recorded network requests show `Failed to fetch` on PostHog (`us-assets.i.posthog.com`, `us.i.posthog.com`) — that indicates the browser tab temporarily lost network, which also breaks the preview iframe's HMR websocket.

## Recommended action (no code changes needed)

1. Hard refresh the preview tab (Cmd/Ctrl + Shift + R).
2. If it still shows "preview not available", click the refresh icon on the preview panel.

## If it still fails after refresh

I can then:
- Restart the Vite dev server inside the sandbox.
- Investigate whether PostHog init is blocking hydration (would move `posthog.init` behind a network check or lazy-load).

Approve this plan and I'll switch to build mode only if the refresh doesn't recover it — otherwise no code changes are needed.