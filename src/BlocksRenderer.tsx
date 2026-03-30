import { Fragment, type CSSProperties, type ReactNode } from 'react';

import type {
  BlockNode,
  BlocksRendererProps,
  CodeNode,
  CustomBlocksConfig,
  CustomModifiersConfig,
  HeadingNode,
  HorizontalLineNode,
  ImageNode,
  InlineNode,
  ListItemNode,
  ListNode,
  MediaEmbedNode,
  ParagraphNode,
  QuoteNode,
  TableNode,
  TextNode,
} from './types';

// ── Text / Modifier Rendering ────────────────────────────────────────

function renderTextNode(node: TextNode, key: number, modifiers?: CustomModifiersConfig): ReactNode {
  const {
    text,
    bold,
    italic,
    underline,
    strikethrough,
    code,
    uppercase,
    superscript,
    subscript,
    color,
    backgroundColor,
    fontFamily,
    fontSize,
  } = node;

  let content: ReactNode = text;

  // Apply modifiers inside-out
  if (code) {
    const Comp = modifiers?.code;
    content = Comp ? <Comp>{content}</Comp> : <code>{content}</code>;
  }

  if (subscript) {
    const Comp = modifiers?.subscript;
    content = Comp ? <Comp>{content}</Comp> : <sub>{content}</sub>;
  }

  if (superscript) {
    const Comp = modifiers?.superscript;
    content = Comp ? <Comp>{content}</Comp> : <sup>{content}</sup>;
  }

  if (strikethrough) {
    const Comp = modifiers?.strikethrough;
    content = Comp ? <Comp>{content}</Comp> : <del>{content}</del>;
  }

  if (underline) {
    const Comp = modifiers?.underline;
    content = Comp ? (
      <Comp>{content}</Comp>
    ) : (
      <span style={{ textDecoration: 'underline' }}>{content}</span>
    );
  }

  if (uppercase) {
    const Comp = modifiers?.uppercase;
    content = Comp ? (
      <Comp>{content}</Comp>
    ) : (
      <span style={{ textTransform: 'uppercase' }}>{content}</span>
    );
  }

  if (italic) {
    const Comp = modifiers?.italic;
    content = Comp ? <Comp>{content}</Comp> : <em>{content}</em>;
  }

  if (bold) {
    const Comp = modifiers?.bold;
    content = Comp ? <Comp>{content}</Comp> : <strong>{content}</strong>;
  }

  if (color) {
    const Comp = modifiers?.color;
    content = Comp ? (
      <Comp color={color}>{content}</Comp>
    ) : (
      <span style={{ color }}>{content}</span>
    );
  }

  if (backgroundColor) {
    const Comp = modifiers?.backgroundColor;
    content = Comp ? (
      <Comp backgroundColor={backgroundColor}>{content}</Comp>
    ) : (
      <span style={{ backgroundColor }}>{content}</span>
    );
  }

  if (fontFamily) {
    const Comp = modifiers?.fontFamily;
    content = Comp ? (
      <Comp fontFamily={fontFamily}>{content}</Comp>
    ) : (
      <span style={{ fontFamily }}>{content}</span>
    );
  }

  if (fontSize) {
    const Comp = modifiers?.fontSize;
    content = Comp ? (
      <Comp fontSize={fontSize}>{content}</Comp>
    ) : (
      <span style={{ fontSize }}>{content}</span>
    );
  }

  return <Fragment key={key}>{content}</Fragment>;
}

// ── Inline Rendering ─────────────────────────────────────────────────

function renderInlineContent(
  children: InlineNode[],
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  return children.map((child, index) => {
    if (child.type === 'text') {
      return renderTextNode(child, index, modifiers);
    }

    if (child.type === 'link') {
      const LinkComp = blocks?.link;
      const linkChildren = child.children.map((textNode, i) =>
        renderTextNode(textNode, i, modifiers)
      );

      return LinkComp ? (
        <LinkComp key={index} url={child.url} target={child.target} rel={child.rel}>
          {linkChildren}
        </LinkComp>
      ) : (
        <a key={index} href={child.url} target={child.target} rel={child.rel}>
          {linkChildren}
        </a>
      );
    }

    return null;
  });
}

// ── List Rendering ───────────────────────────────────────────────────

const orderedStyles = ['decimal', 'lower-alpha', 'upper-roman'];
const unorderedStyles = ['disc', 'circle', 'square'];

function getListStyleType(format: 'ordered' | 'unordered', indentLevel: number): string {
  const styles = format === 'ordered' ? orderedStyles : unorderedStyles;
  return styles[indentLevel % styles.length];
}

function renderListItem(
  node: ListItemNode,
  key: number,
  isTodo: boolean,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ListItemComp = blocks?.['list-item'];
  const children = renderInlineContent(node.children, blocks, modifiers);

  if (ListItemComp) {
    return (
      <ListItemComp key={key} checked={isTodo ? node.checked : undefined}>
        {children}
      </ListItemComp>
    );
  }

  if (isTodo) {
    const checked = node.checked ?? false;
    return (
      <li key={key} style={{ listStyle: 'none' }}>
        <input type="checkbox" checked={checked} readOnly style={{ marginRight: '0.5em' }} />
        <span style={checked ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>
          {children}
        </span>
      </li>
    );
  }

  return <li key={key}>{children}</li>;
}

function renderList(
  node: ListNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ListComp = blocks?.list;
  const indentLevel = node.indentLevel || 0;
  const isTodo = node.format === 'todo';
  const children = node.children.map((child, index) => {
    if (child.type === 'list-item') {
      return renderListItem(child, index, isTodo, blocks, modifiers);
    }
    if (child.type === 'list') {
      return renderList(child, index, blocks, modifiers);
    }
    return null;
  });

  if (ListComp) {
    return (
      <ListComp key={key} format={node.format} indentLevel={indentLevel}>
        {children}
      </ListComp>
    );
  }

  if (isTodo) {
    return (
      <ul key={key} style={{ listStyle: 'none', paddingLeft: indentLevel > 0 ? '1.5em' : 0 }}>
        {children}
      </ul>
    );
  }

  const Tag = node.format === 'ordered' ? 'ol' : 'ul';
  const listStyleType = getListStyleType(node.format as 'ordered' | 'unordered', indentLevel);
  return (
    <Tag key={key} style={{ listStyleType }}>
      {children}
    </Tag>
  );
}

// ── Table Rendering ──────────────────────────────────────────────────

function renderTable(
  block: TableNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const TableComp = blocks?.table;
  const RowComp = blocks?.['table-row'];
  const CellComp = blocks?.['table-cell'];
  const HeaderCellComp = blocks?.['table-header-cell'];

  const rows = block.children.map((row, rowIndex) => {
    const cells = row.children.map((cell, cellIndex) => {
      const cellChildren = renderInlineContent(cell.children, blocks, modifiers);
      const isHeader = cell.type === 'table-header-cell';

      if (isHeader && HeaderCellComp) {
        return <HeaderCellComp key={cellIndex}>{cellChildren}</HeaderCellComp>;
      }
      if (!isHeader && CellComp) {
        return <CellComp key={cellIndex}>{cellChildren}</CellComp>;
      }

      const CellTag = isHeader ? 'th' : 'td';
      return <CellTag key={cellIndex}>{cellChildren}</CellTag>;
    });

    return RowComp ? <RowComp key={rowIndex}>{cells}</RowComp> : <tr key={rowIndex}>{cells}</tr>;
  });

  return TableComp ? (
    <TableComp key={key}>{rows}</TableComp>
  ) : (
    <table key={key}>
      <tbody>{rows}</tbody>
    </table>
  );
}

// ── Block Rendering ──────────────────────────────────────────────────

function getPlainText(children: InlineNode[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') return child.text;
      if (child.type === 'link') return child.children.map((t) => t.text).join('');
      return '';
    })
    .join('');
}

function renderBlock(
  block: BlockNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  switch (block.type) {
    case 'paragraph':
      return renderParagraph(block, key, blocks, modifiers);
    case 'heading':
      return renderHeading(block, key, blocks, modifiers);
    case 'list':
      return renderList(block, key, blocks, modifiers);
    case 'quote':
      return renderQuote(block, key, blocks, modifiers);
    case 'code':
      return renderCode(block, key, blocks);
    case 'image':
      return renderImage(block, key, blocks);
    case 'horizontal-line':
      return renderHorizontalLine(block, key, blocks);
    case 'table':
      return renderTable(block, key, blocks, modifiers);
    case 'media-embed':
      return renderMediaEmbed(block, key, blocks);
    default:
      return null;
  }
}

function getBlockStyle(block: {
  textAlign?: string;
  lineHeight?: string;
  indent?: number;
}): CSSProperties | undefined {
  const style: CSSProperties = {};
  if (block.textAlign) style.textAlign = block.textAlign as CSSProperties['textAlign'];
  if (block.lineHeight) style.lineHeight = block.lineHeight;
  if (block.indent) style.marginLeft = `${block.indent * 2}rem`;
  return Object.keys(style).length > 0 ? style : undefined;
}

function renderParagraph(
  block: ParagraphNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ParagraphComp = blocks?.paragraph;
  const children = renderInlineContent(block.children, blocks, modifiers);
  const style = getBlockStyle(block);

  return ParagraphComp ? (
    <ParagraphComp key={key} style={style}>
      {children}
    </ParagraphComp>
  ) : (
    <p key={key} style={style}>
      {children}
    </p>
  );
}

function renderHeading(
  block: HeadingNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const HeadingComp = blocks?.heading;
  const children = renderInlineContent(block.children, blocks, modifiers);
  const style = getBlockStyle(block);

  if (HeadingComp) {
    return (
      <HeadingComp key={key} level={block.level} style={style}>
        {children}
      </HeadingComp>
    );
  }

  const Tag = `h${block.level}` as const;
  return (
    <Tag key={key} style={style}>
      {children}
    </Tag>
  );
}

function renderQuote(
  block: QuoteNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const QuoteComp = blocks?.quote;
  const children = renderInlineContent(block.children, blocks, modifiers);
  const style = getBlockStyle(block);

  return QuoteComp ? (
    <QuoteComp key={key} style={style}>
      {children}
    </QuoteComp>
  ) : (
    <blockquote key={key} style={style}>
      {children}
    </blockquote>
  );
}

function renderCode(block: CodeNode, key: number, blocks?: CustomBlocksConfig): ReactNode {
  const CodeComp = blocks?.code;
  const plainText = getPlainText(block.children);

  if (CodeComp) {
    return (
      <CodeComp key={key} plainText={plainText}>
        {plainText}
      </CodeComp>
    );
  }

  return (
    <pre key={key}>
      <code>{plainText}</code>
    </pre>
  );
}

function renderImage(block: ImageNode, key: number, blocks?: CustomBlocksConfig): ReactNode {
  const ImageComp = blocks?.image;

  if (ImageComp) {
    return (
      <ImageComp
        key={key}
        image={block.image}
        caption={block.caption}
        imageAlign={block.imageAlign}
      />
    );
  }

  const align = block.imageAlign || 'center';
  const alignStyle: CSSProperties = {
    textAlign: align,
  };

  return (
    <figure key={key} style={alignStyle}>
      <img
        src={block.image.url}
        alt={block.image.alternativeText || ''}
        width={block.image.width}
        height={block.image.height}
      />
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  );
}

function renderHorizontalLine(
  _block: HorizontalLineNode,
  key: number,
  blocks?: CustomBlocksConfig
): ReactNode {
  const HrComp = blocks?.['horizontal-line'];
  return HrComp ? <HrComp key={key} /> : <hr key={key} />;
}

function renderMediaEmbed(
  block: MediaEmbedNode,
  key: number,
  blocks?: CustomBlocksConfig
): ReactNode {
  const EmbedComp = blocks?.['media-embed'];

  if (EmbedComp) {
    return <EmbedComp key={key} url={block.url} originalUrl={block.originalUrl} />;
  }

  return (
    <div key={key} style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={block.url}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        title="Embedded media"
      />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function BlocksRenderer({ content, blocks, modifiers }: BlocksRendererProps): ReactNode {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  return <>{content.map((block, index) => renderBlock(block, index, blocks, modifiers))}</>;
}
