import { Fragment, type ReactNode } from 'react';

import type {
  BlockNode,
  BlocksRendererProps,
  CodeNode,
  CustomBlocksConfig,
  CustomModifiersConfig,
  HeadingNode,
  ImageNode,
  InlineNode,
  ListItemNode,
  ListNode,
  ParagraphNode,
  QuoteNode,
  TextNode,
} from './types';

// ── Text / Modifier Rendering ────────────────────────────────────────

function renderTextNode(node: TextNode, key: number, modifiers?: CustomModifiersConfig): ReactNode {
  const { text, bold, italic, underline, strikethrough, code, color, backgroundColor } = node;

  let content: ReactNode = text;

  // Apply modifiers inside-out
  if (code) {
    const Comp = modifiers?.code;
    content = Comp ? <Comp>{content}</Comp> : <code>{content}</code>;
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
        <LinkComp key={index} url={child.url}>
          {linkChildren}
        </LinkComp>
      ) : (
        <a key={index} href={child.url}>
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
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ListItemComp = blocks?.['list-item'];
  const children = renderInlineContent(node.children, blocks, modifiers);

  return ListItemComp ? (
    <ListItemComp key={key}>{children}</ListItemComp>
  ) : (
    <li key={key}>{children}</li>
  );
}

function renderList(
  node: ListNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ListComp = blocks?.list;
  const indentLevel = node.indentLevel || 0;
  const children = node.children.map((child, index) => {
    if (child.type === 'list-item') {
      return renderListItem(child, index, blocks, modifiers);
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

  const Tag = node.format === 'ordered' ? 'ol' : 'ul';
  const listStyleType = getListStyleType(node.format, indentLevel);
  return (
    <Tag key={key} style={{ listStyleType }}>
      {children}
    </Tag>
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
    default:
      return null;
  }
}

function renderParagraph(
  block: ParagraphNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const ParagraphComp = blocks?.paragraph;
  const children = renderInlineContent(block.children, blocks, modifiers);

  return ParagraphComp ? (
    <ParagraphComp key={key}>{children}</ParagraphComp>
  ) : (
    <p key={key}>{children}</p>
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

  if (HeadingComp) {
    return (
      <HeadingComp key={key} level={block.level}>
        {children}
      </HeadingComp>
    );
  }

  const Tag = `h${block.level}` as const;
  return <Tag key={key}>{children}</Tag>;
}

function renderQuote(
  block: QuoteNode,
  key: number,
  blocks?: CustomBlocksConfig,
  modifiers?: CustomModifiersConfig
): ReactNode {
  const QuoteComp = blocks?.quote;
  const children = renderInlineContent(block.children, blocks, modifiers);

  return QuoteComp ? (
    <QuoteComp key={key}>{children}</QuoteComp>
  ) : (
    <blockquote key={key}>{children}</blockquote>
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
    return <ImageComp key={key} image={block.image} />;
  }

  return (
    <img
      key={key}
      src={block.image.url}
      alt={block.image.alternativeText || ''}
      width={block.image.width}
      height={block.image.height}
    />
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function BlocksRenderer({ content, blocks, modifiers }: BlocksRendererProps): ReactNode {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  return <>{content.map((block, index) => renderBlock(block, index, blocks, modifiers))}</>;
}
