---
'@k11k/better-blocks-react-renderer': minor
---

Add support for KaTeX/LaTeX math nodes from the Better Blocks plugin. Inline math renders as `<span class="katex-inline">` and block math as `<div class="katex-block">`, using `katex.renderToString` for SSR-safe output. Math falls back to the raw LaTeX source if KaTeX fails to parse, and can be overridden with a custom `math` block renderer (e.g. to use MathJax). Consumers should import `katex/dist/katex.min.css` once in their app.
