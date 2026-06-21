---
'@k11k/better-blocks-react-renderer': patch
---

fix: button hover/focus styles now work out of the box

Button hover colors (`hoverBackgroundColor` / `hoverTextColor`) previously did
nothing on the frontend unless the consumer manually added a `.bb-button:hover`
CSS rule — only the `--bb-button-hover-*` custom properties were set. The
renderer now ships a small default `<style>` (emitted once, only when a default
button is present) wiring hover and `:focus-visible` to those properties, with a
fallback to the base colors so buttons without hover colors keep their colors on
hover. This matches the Astro renderer's zero-setup behavior.
