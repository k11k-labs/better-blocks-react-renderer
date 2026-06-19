---
'@k11k/better-blocks-react-renderer': minor
---

Add support for `callout` (admonition) nodes from the Better Blocks plugin (`{ type: 'callout', variant, title?, children }`). Callouts render GitHub-style in five variants — note, tip, important, warning, caution — as an `<aside role="note">` with a colored left border, a title row (icon + label, or the node's custom `title`), and the nested block children rendered recursively. Colors are inlined so no stylesheet is required. The block can be overridden with a custom `callout` renderer that receives `variant`, `title`, and `children`.
