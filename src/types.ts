import type { ReactNode, ComponentType } from 'react';

// ── Text & Inline Nodes ──────────────────────────────────────────────

export type TextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  backgroundColor?: string;
};

export type LinkNode = {
  type: 'link';
  url: string;
  children: TextNode[];
};

export type InlineNode = TextNode | LinkNode;

// ── Block Nodes ──────────────────────────────────────────────────────

export type ListItemNode = {
  type: 'list-item';
  children: InlineNode[];
};

export type ParagraphNode = {
  type: 'paragraph';
  children: InlineNode[];
};

export type HeadingNode = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
};

export type ListNode = {
  type: 'list';
  format: 'ordered' | 'unordered';
  indentLevel?: number;
  children: (ListItemNode | ListNode)[];
};

export type QuoteNode = {
  type: 'quote';
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
  children: [{ type: 'text'; text: '' }];
};

export type BlockNode = ParagraphNode | HeadingNode | ListNode | QuoteNode | CodeNode | ImageNode;

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
  paragraph: ComponentType<BlockComponentProps>;
  heading: ComponentType<BlockComponentProps<{ level: 1 | 2 | 3 | 4 | 5 | 6 }>>;
  list: ComponentType<
    BlockComponentProps<{ format: 'ordered' | 'unordered'; indentLevel: number }>
  >;
  'list-item': ComponentType<BlockComponentProps>;
  link: ComponentType<BlockComponentProps<{ url: string }>>;
  quote: ComponentType<BlockComponentProps>;
  code: ComponentType<BlockComponentProps<{ plainText: string }>>;
  image: ComponentType<{
    image: { url: string; alternativeText?: string | null; width?: number; height?: number };
    children?: ReactNode;
  }>;
}>;

export type CustomModifiersConfig = Partial<{
  bold: ComponentType<ModifierProps>;
  italic: ComponentType<ModifierProps>;
  underline: ComponentType<ModifierProps>;
  strikethrough: ComponentType<ModifierProps>;
  code: ComponentType<ModifierProps>;
  color: ComponentType<ColorModifierProps>;
  backgroundColor: ComponentType<BackgroundColorModifierProps>;
}>;

// ── Component Props ──────────────────────────────────────────────────

export type BlocksRendererProps = {
  content: BlocksContent;
  blocks?: CustomBlocksConfig;
  modifiers?: CustomModifiersConfig;
};
