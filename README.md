<h1 align="center">Better Blocks React Renderer</h1>

<p align="center">React renderer for Strapi v5 Blocks content — supports all standard blocks plus Better Blocks features: color, highlight, text alignment, nested lists, to-do lists, tables, media embeds, image captions, and more.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@k11k/better-blocks-react-renderer">
    <img alt="npm version" src="https://img.shields.io/npm/v/@k11k/better-blocks-react-renderer.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@k11k/better-blocks-react-renderer">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/@k11k/better-blocks-react-renderer.svg" />
  </a>
  <a href="https://github.com/k11k-labs/better-blocks-react-renderer/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/@k11k/better-blocks-react-renderer.svg" />
  </a>
</p>

<p align="center">
  <img src="./docs/playground-showcase.png" alt="Strapi editor (left) and rendered output (right)" width="800" />
</p>

---

## Table of Contents

1. [Why?](#why)
2. [Compatibility](#compatibility)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Supported Blocks](#supported-blocks)
6. [Supported Modifiers](#supported-modifiers)
7. [Custom Renderers](#custom-renderers)
8. [TypeScript](#typescript)
9. [Contributing](#contributing)
10. [License](#license)

---

## Why?

The official [`@strapi/blocks-react-renderer`](https://github.com/strapi/blocks-react-renderer) doesn't support the features that the [Better Blocks](https://github.com/k11k-labs/strapi-plugin-better-blocks) plugin adds to the Strapi editor &mdash; color marks, text alignment, to-do lists, tables, media embeds, and more.

This package is a **drop-in replacement** that renders all Better Blocks features out of the box &mdash; no configuration needed.

## Compatibility

| Strapi Version | Renderer Version | React Version |
| -------------- | ---------------- | ------------- |
| v5.x           | v0.x             | &ge; 17       |

## Installation

```bash
# Using yarn
yarn add @k11k/better-blocks-react-renderer

# Using npm
npm install @k11k/better-blocks-react-renderer
```

**Peer dependencies:** `react >= 17`

## Usage

```tsx
import { BlocksRenderer } from '@k11k/better-blocks-react-renderer';

// Basic — renders all blocks including color/highlight
<BlocksRenderer content={blocks} />;
```

That's it. All Better Blocks features &mdash; colors, tables, to-do lists, media embeds, alignment, and more &mdash; work automatically.

## Supported Blocks

| Block                           | Default element     | Source                      |
| ------------------------------- | ------------------- | --------------------------- |
| `paragraph`                     | `<p>`               | Strapi core                 |
| `heading` (1&ndash;6)           | `<h1>`&ndash;`<h6>` | Strapi core                 |
| `list` (ordered/unordered/todo) | `<ol>` / `<ul>`     | Strapi core + Better Blocks |
| `list-item`                     | `<li>`              | Strapi core                 |
| `link`                          | `<a>`               | Strapi core                 |
| `quote`                         | `<blockquote>`      | Strapi core                 |
| `code`                          | `<pre><code>`       | Strapi core                 |
| `image`                         | `<figure><img>`     | Strapi core                 |
| `horizontal-line`               | `<hr>`              | Better Blocks               |
| `table`                         | `<table>`           | Better Blocks               |
| `media-embed`                   | `<iframe>` (16:9)   | Better Blocks               |

### Block properties

| Property      | Applies to                | Description                                           |
| ------------- | ------------------------- | ----------------------------------------------------- |
| `textAlign`   | paragraph, heading, quote | Text alignment (`left`, `center`, `right`, `justify`) |
| `lineHeight`  | paragraph, heading, quote | CSS line-height value (e.g. `1.5`, `2.0`)             |
| `indent`      | paragraph, heading, quote | Block indentation level (`marginLeft: N * 2rem`)      |
| `indentLevel` | list                      | Cycling list-style-type per nesting depth             |
| `format`      | list                      | `ordered`, `unordered`, or `todo`                     |
| `checked`     | list-item (in todo lists) | Checkbox state (`true`/`false`)                       |
| `target`      | link                      | `_blank` for new-tab links                            |
| `rel`         | link                      | `noopener noreferrer` for new-tab links               |
| `caption`     | image                     | Text displayed below the image                        |
| `imageAlign`  | image                     | Image alignment (`left`, `center`, `right`)           |
| `url`         | media-embed               | Embed URL (YouTube/Vimeo iframe src)                  |
| `originalUrl` | media-embed               | Original user-provided URL                            |

## Supported Modifiers

| Modifier          | Default element                    | Source        |
| ----------------- | ---------------------------------- | ------------- |
| `bold`            | `<strong>`                         | Strapi core   |
| `italic`          | `<em>`                             | Strapi core   |
| `underline`       | `<span>`                           | Strapi core   |
| `strikethrough`   | `<del>`                            | Strapi core   |
| `code`            | `<code>`                           | Strapi core   |
| `uppercase`       | `<span style={{textTransform}}>`   | Better Blocks |
| `superscript`     | `<sup>`                            | Better Blocks |
| `subscript`       | `<sub>`                            | Better Blocks |
| `color`           | `<span style={{color}}>`           | Better Blocks |
| `backgroundColor` | `<span style={{backgroundColor}}>` | Better Blocks |
| `fontFamily`      | `<span style={{fontFamily}}>`      | Better Blocks |
| `fontSize`        | `<span style={{fontSize}}>`        | Better Blocks |

## Custom Renderers

### Custom block renderers

Override any block type with your own component:

```tsx
<BlocksRenderer
  content={blocks}
  blocks={{
    paragraph: ({ children, style }) => (
      <p className="my-paragraph" style={style}>
        {children}
      </p>
    ),
    heading: ({ children, level, style }) => {
      const Tag = `h${level}`;
      return <Tag style={style}>{children}</Tag>;
    },
    link: ({ children, url, target, rel }) => (
      <a href={url} target={target} rel={rel}>
        {children}
      </a>
    ),
    image: ({ image, caption, imageAlign }) => (
      <figure style={{ textAlign: imageAlign }}>
        <img src={image.url} alt={image.alternativeText || ''} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    ),
    'list-item': ({ children, checked }) =>
      checked !== undefined ? (
        <li style={{ listStyle: 'none' }}>
          <input type="checkbox" checked={checked} readOnly /> {children}
        </li>
      ) : (
        <li>{children}</li>
      ),
    'horizontal-line': () => <hr className="my-divider" />,
    table: ({ children }) => <table className="my-table">{children}</table>,
    'table-header-cell': ({ children }) => <th className="my-th">{children}</th>,
    'table-cell': ({ children }) => <td className="my-td">{children}</td>,
    'media-embed': ({ url }) => (
      <div className="video-wrapper">
        <iframe src={url} allowFullScreen title="Embedded media" />
      </div>
    ),
  }}
/>
```

### Custom modifier renderers

Override any text modifier with your own component:

```tsx
<BlocksRenderer
  content={blocks}
  modifiers={{
    bold: ({ children }) => <strong className="font-bold">{children}</strong>,
    color: ({ children, color }) => <span style={{ color }}>{children}</span>,
    backgroundColor: ({ children, backgroundColor }) => (
      <mark style={{ backgroundColor }}>{children}</mark>
    ),
  }}
/>
```

## TypeScript

All types are exported:

```ts
import type {
  BlocksContent,
  BlocksRendererProps,
  BlockNode,
  TextNode,
  LinkNode,
  ListNode,
  ListItemNode,
  ParagraphNode,
  HeadingNode,
  QuoteNode,
  CodeNode,
  ImageNode,
  HorizontalLineNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TableHeaderCellNode,
  MediaEmbedNode,
  TextAlign,
  CustomBlocksConfig,
  CustomModifiersConfig,
} from '@k11k/better-blocks-react-renderer';
```

## Contributing

Contributions are welcome! The easiest way to get started is with Docker:

```bash
# Clone the repository
git clone https://github.com/k11k-labs/better-blocks-react-renderer.git
cd better-blocks-react-renderer

# Start the playground with Docker
cd playground
docker compose up
```

This will start a Strapi v5 instance with the Better Blocks plugin and a React app that renders the content &mdash; all pre-configured with a showcase article.

- **Strapi admin:** http://localhost:1337/admin (login: `admin@example.com` / `admin12#`)
- **React app:** http://localhost:5173

### Development workflow

1. Make changes to the renderer source in `src/`
2. Rebuild: `yarn build` (from repo root)
3. The React app picks up the new build automatically

### Without Docker

```bash
# Build the renderer
yarn install && yarn build

# Start Strapi
cd playground/strapi && cp .env.example .env && npm install && npm run dev

# Start the React app (in another terminal)
cd playground/react-app && npm install && npm run dev
```

### Running tests

```bash
yarn test        # Run tests
yarn test:ts     # Type check
yarn lint        # Check formatting
```

## Community & Support

- [GitHub Issues](https://github.com/k11k-labs/better-blocks-react-renderer/issues) &mdash; Bug reports and feature requests

## Related

- [@k11k/strapi-plugin-better-blocks](https://github.com/k11k-labs/strapi-plugin-better-blocks) &mdash; Strapi plugin that extends the Blocks editor with colors, tables, to-do lists, media embeds, and more
- [@strapi/blocks-react-renderer](https://github.com/strapi/blocks-react-renderer) &mdash; Official Strapi renderer (standard blocks only)

## License

[MIT License](LICENSE) &copy; [k11k-labs](https://github.com/k11k-labs)
