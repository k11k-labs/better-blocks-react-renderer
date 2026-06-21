---
'@k11k/better-blocks-react-renderer': minor
---

feat: fix cross-origin file downloads and add `filePreview` toggle for file buttons

File-mode buttons now force a real download via a blob fetch, so cross-origin
assets (Strapi/CDN) download instead of opening inline in the browser — the
native `download` attribute is ignored cross-origin, which made PDFs, videos and
images preview rather than save. CORS-blocked fetches fall back to native
navigation.

Adds the `filePreview` option (mirrors the editor field): when `true`, the file
opens in a new tab (`target="_blank" rel="noopener noreferrer"`) for preview
instead of downloading. `filePreview` is also passed through to custom `button`
renderers.
