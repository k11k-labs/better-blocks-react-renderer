---
'@k11k/better-blocks-react-renderer': minor
---

Add support for block-level Mermaid `diagram` nodes from the Better Blocks plugin (`{ type: 'diagram', format: 'mermaid', value }`). Diagrams render to inline SVG on the client using a lazy-loaded `mermaid` instance. SSR and the first client render emit the raw Mermaid source in a `<pre>` (so hydration matches), then swap in the rendered SVG after mount; if Mermaid fails to parse the source, the raw text remains as a graceful fallback. The block can be overridden with a custom `diagram` renderer that receives `code` and `format` props.
