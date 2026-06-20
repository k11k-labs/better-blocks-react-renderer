---
"@k11k/better-blocks-react-renderer": minor
---

Add support for the `button` block (WordPress-style CTA + Media Library file download). Link mode renders an `<a>` with `href`/`target`/`rel`/`aria-label`; file mode renders a download link with an optional file-type icon (`showFileIcon`) and human-readable size (`showFileSize`). The `style` object is applied as inline CSS, `alignment` controls a block-level wrapper, hover colors are exposed as CSS custom properties, and the block is overridable through the `blocks.button` prop.
