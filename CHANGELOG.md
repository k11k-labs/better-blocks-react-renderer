# @k11k/better-blocks-react-renderer

## 0.5.1

### Patch Changes

- [#15](https://github.com/k11k-labs/better-blocks-react-renderer/pull/15) [`bd6f61b`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/bd6f61b4dd6642ce0578ce11f70ea3155cc11eb3) Thanks [@kkukielka](https://github.com/kkukielka)! - Document Astro integration in the README. Adds an "Astro" usage section covering `@astrojs/react`, when a client directive is (and isn't) needed, the `katex/dist/katex.min.css` import, and the island prop serialization caveat for custom renderers.

## 0.5.0

### Minor Changes

- [#13](https://github.com/k11k-labs/better-blocks-react-renderer/pull/13) [`4d8f91b`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/4d8f91b7da484acf0629539d10b77d63b35ab7a1) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for KaTeX/LaTeX math nodes from the Better Blocks plugin. Inline math renders as `<span class="katex-inline">` and block math as `<div class="katex-block">`, using `katex.renderToString` for SSR-safe output. Math falls back to the raw LaTeX source if KaTeX fails to parse, and can be overridden with a custom `math` block renderer (e.g. to use MathJax). Consumers should import `katex/dist/katex.min.css` once in their app.

## 0.4.0

### Minor Changes

- [#9](https://github.com/k11k-labs/better-blocks-react-renderer/pull/9) [`c8de109`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/c8de1095dd051d18d18501ca3f0825228a5be5b3) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for Better Blocks plugin v0.5.0-v0.6.0 features: uppercase, superscript, subscript modifiers, font family and size marks, line height and block indent properties

## 0.3.0

### Minor Changes

- [#7](https://github.com/k11k-labs/better-blocks-react-renderer/pull/7) [`53d7fba`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/53d7fba63ecb6cd7656ad092029568da46ac4def) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for Better Blocks plugin v0.4.0 features: horizontal line, link target/rel, text alignment, to-do lists, tables, media embeds, image captions and alignment

## 0.2.0

### Minor Changes

- [#5](https://github.com/k11k-labs/better-blocks-react-renderer/pull/5) [`c19439c`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/c19439c1877c25a37a4f5701dff3011e4d55325b) Thanks [@kkukielka](https://github.com/kkukielka)! - Add indentLevel support for nested lists with per-level style cycling

## 0.1.1

### Patch Changes

- [#3](https://github.com/k11k-labs/better-blocks-react-renderer/pull/3) [`535c744`](https://github.com/k11k-labs/better-blocks-react-renderer/commit/535c7444297fde84e47eca86036407d616880840) Thanks [@kkukielka](https://github.com/kkukielka)! - Test changeset workflow
