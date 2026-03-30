import type { ReactNode, ComponentType, CSSProperties } from 'react';

// ── Text & Inline Nodes ──────────────────────────────────────────────

export type TextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  uppercase?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: string;
};

export type LinkNode = {
  type: 'link';
  url: string;
  target?: '_blank' | '_self';
  rel?: string;
  children: TextNode[];
};

export type InlineNode = TextNode | LinkNode;

// ── Text Alignment ──────────────────────────────────────────────────

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

// ── Block Nodes ──────────────────────────────────────────────────────

export type ListItemNode = {
  type: 'list-item';
  checked?: boolean;
  children: InlineNode[];
};

export type ParagraphNode = {
  type: 'paragraph';
  textAlign?: TextAlign;
  lineHeight?: string;
  indent?: number;
  children: InlineNode[];
};

export type HeadingNode = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: TextAlign;
  lineHeight?: string;
  indent?: number;
  children: InlineNode[];
};

export type ListNode = {
  type: 'list';
  format: 'ordered' | 'unordered' | 'todo';
  indentLevel?: number;
  children: (ListItemNode | ListNode)[];
};

export type QuoteNode = {
  type: 'quote';
  textAlign?: TextAlign;
  lineHeight?: string;
  indent?: number;
  children: InlineNode[];
};

export type CodeNode = {
  type: 'code';
  children: InlineNode[];
};

export type ImageNode = {
  type: 'image';
  image: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
  caption?: string;
  imageAlign?: 'left' | 'center' | 'right';
  children: [{ type: 'text'; text: '' }];
};

export type HorizontalLineNode = {
  type: 'horizontal-line';
  children: [{ type: 'text'; text: '' }];
};

export type TableCellNode = {
  type: 'table-cell';
  children: InlineNode[];
};

export type TableHeaderCellNode = {
  type: 'table-header-cell';
  children: InlineNode[];
};

export type TableRowNode = {
  type: 'table-row';
  children: (TableCellNode | TableHeaderCellNode)[];
};

export type TableNode = {
  type: 'table';
  children: TableRowNode[];
};

export type MediaEmbedNode = {
  type: 'media-embed';
  url: string;
  originalUrl?: string;
  children: [{ type: 'text'; text: '' }];
};

export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | ListNode
  | QuoteNode
  | CodeNode
  | ImageNode
  | HorizontalLineNode
  | TableNode
  | MediaEmbedNode;

export type BlocksContent = BlockNode[];

// ── Modifier (Mark) Props ────────────────────────────────────────────

export type ModifierProps = {
  children: ReactNode;
};

export type ColorModifierProps = {
  children: ReactNode;
  color: string;
};

export type BackgroundColorModifierProps = {
  children: ReactNode;
  backgroundColor: string;
};

// ── Block Component Props ────────────────────────────────────────────

export type BlockComponentProps<T = Record<string, unknown>> = T & {
  children: ReactNode;
};

// ── Custom Renderers Config ──────────────────────────────────────────

export type CustomBlocksConfig = Partial<{
  paragraph: ComponentType<BlockComponentProps<{ style?: CSSProperties }>>;
  heading: ComponentType<
    BlockComponentProps<{ level: 1 | 2 | 3 | 4 | 5 | 6; style?: CSSProperties }>
  >;
  list: ComponentType<
    BlockComponentProps<{ format: 'ordered' | 'unordered' | 'todo'; indentLevel: number }>
  >;
  'list-item': ComponentType<BlockComponentProps<{ checked?: boolean }>>;
  link: ComponentType<BlockComponentProps<{ url: string; target?: string; rel?: string }>>;
  quote: ComponentType<BlockComponentProps<{ style?: CSSProperties }>>;
  code: ComponentType<BlockComponentProps<{ plainText: string }>>;
  image: ComponentType<{
    image: { url: string; alternativeText?: string | null; width?: number; height?: number };
    caption?: string;
    imageAlign?: 'left' | 'center' | 'right';
    children?: ReactNode;
  }>;
  'horizontal-line': ComponentType<Record<string, unknown>>;
  table: ComponentType<BlockComponentProps>;
  'table-row': ComponentType<BlockComponentProps>;
  'table-cell': ComponentType<BlockComponentProps>;
  'table-header-cell': ComponentType<BlockComponentProps>;
  'media-embed': ComponentType<{ url: string; originalUrl?: string }>;
}>;

export type FontFamilyModifierProps = {
  children: ReactNode;
  fontFamily: string;
};

export type FontSizeModifierProps = {
  children: ReactNode;
  fontSize: string;
};

export type CustomModifiersConfig = Partial<{
  bold: ComponentType<ModifierProps>;
  italic: ComponentType<ModifierProps>;
  underline: ComponentType<ModifierProps>;
  strikethrough: ComponentType<ModifierProps>;
  code: ComponentType<ModifierProps>;
  uppercase: ComponentType<ModifierProps>;
  superscript: ComponentType<ModifierProps>;
  subscript: ComponentType<ModifierProps>;
  color: ComponentType<ColorModifierProps>;
  backgroundColor: ComponentType<BackgroundColorModifierProps>;
  fontFamily: ComponentType<FontFamilyModifierProps>;
  fontSize: ComponentType<FontSizeModifierProps>;
}>;

// ── Component Props ──────────────────────────────────────────────────

export type BlocksRendererProps = {
  content: BlocksContent;
  blocks?: CustomBlocksConfig;
  modifiers?: CustomModifiersConfig;
};
