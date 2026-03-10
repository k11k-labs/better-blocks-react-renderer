import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlocksRenderer } from '../src';
import type { BlocksContent } from '../src';

describe('BlocksRenderer', () => {
  it('returns null for empty content', () => {
    const { container } = render(<BlocksRenderer content={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null for undefined-ish content', () => {
    const { container } = render(<BlocksRenderer content={null as unknown as BlocksContent} />);
    expect(container.innerHTML).toBe('');
  });

  // ── Paragraphs ───────────────────────────────────────────────────

  it('renders a paragraph with plain text', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Hello world' }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Hello world').tagName).toBe('P');
  });

  // ── Headings ─────────────────────────────────────────────────────

  it('renders headings h1-h6', () => {
    const content: BlocksContent = [
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'H1' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'H2' }] },
      { type: 'heading', level: 3, children: [{ type: 'text', text: 'H3' }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('H1').tagName).toBe('H1');
    expect(screen.getByText('H2').tagName).toBe('H2');
    expect(screen.getByText('H3').tagName).toBe('H3');
  });

  // ── Standard Marks ───────────────────────────────────────────────

  it('renders bold text', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Bold', bold: true }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Bold').tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Italic', italic: true }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Italic').tagName).toBe('EM');
  });

  it('renders underline text', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Under', underline: true }] },
    ];
    render(<BlocksRenderer content={content} />);
    const el = screen.getByText('Under');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveStyle({ textDecoration: 'underline' });
  });

  it('renders strikethrough text', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Strike', strikethrough: true }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Strike').tagName).toBe('DEL');
  });

  it('renders inline code', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Code', code: true }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Code').tagName).toBe('CODE');
  });

  // ── Color & Background Marks ─────────────────────────────────────

  it('renders text with color', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Red', color: '#E53E3E' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const el = screen.getByText('Red');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveStyle({ color: '#E53E3E' });
  });

  it('renders text with backgroundColor', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Highlighted', backgroundColor: '#FED7D7' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const el = screen.getByText('Highlighted');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveStyle({ backgroundColor: '#FED7D7' });
  });

  it('renders text with both color and backgroundColor', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Both',
            color: '#E53E3E',
            backgroundColor: '#FED7D7',
          },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    // backgroundColor wraps color wraps text
    const bgEl = screen.getByText('Both').closest('span[style*="background-color"]');
    expect(bgEl).toBeInTheDocument();
    const colorEl = screen.getByText('Both').closest('span[style*="color"]');
    expect(colorEl).toBeInTheDocument();
  });

  it('renders bold + color combined', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'BoldRed', bold: true, color: '#E53E3E' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const strong = screen.getByText('BoldRed');
    expect(strong.tagName).toBe('STRONG');
    // color span wraps the strong
    const colorSpan = strong.closest('span[style*="color"]');
    expect(colorSpan).toBeInTheDocument();
  });

  // ── Links ────────────────────────────────────────────────────────

  it('renders links', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ type: 'text', text: 'Click me' }],
          },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const link = screen.getByText('Click me');
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  // ── Lists ────────────────────────────────────────────────────────

  it('renders unordered lists', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Item 1' }] },
          { type: 'list-item', children: [{ type: 'text', text: 'Item 2' }] },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Item 1').closest('ul')).toBeInTheDocument();
    expect(screen.getByText('Item 1').closest('li')).toBeInTheDocument();
  });

  it('renders ordered lists', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'ordered',
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'First' }] }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('First').closest('ol')).toBeInTheDocument();
  });

  it('renders nested lists', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Parent' }] },
          {
            type: 'list',
            format: 'unordered',
            children: [{ type: 'list-item', children: [{ type: 'text', text: 'Child' }] }],
          },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const childLi = screen.getByText('Child').closest('li');
    const nestedUl = childLi?.closest('ul');
    const outerUl = nestedUl?.parentElement?.closest('ul');
    expect(outerUl).toBeInTheDocument();
  });

  // ── Quote ────────────────────────────────────────────────────────

  it('renders blockquote', () => {
    const content: BlocksContent = [
      { type: 'quote', children: [{ type: 'text', text: 'Wise words' }] },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Wise words').closest('blockquote')).toBeInTheDocument();
  });

  // ── Code Block ───────────────────────────────────────────────────

  it('renders code block', () => {
    const content: BlocksContent = [
      { type: 'code', children: [{ type: 'text', text: 'const x = 1;' }] },
    ];
    render(<BlocksRenderer content={content} />);
    const code = screen.getByText('const x = 1;');
    expect(code.tagName).toBe('CODE');
    expect(code.closest('pre')).toBeInTheDocument();
  });

  // ── Image ────────────────────────────────────────────────────────

  it('renders images', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: {
          url: 'https://example.com/img.png',
          alternativeText: 'An image',
          width: 200,
          height: 100,
        },
        children: [{ type: 'text', text: '' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const img = screen.getByAltText('An image');
    expect(img).toHaveAttribute('src', 'https://example.com/img.png');
    expect(img).toHaveAttribute('width', '200');
    expect(img).toHaveAttribute('height', '100');
  });

  // ── Custom Block Renderers ───────────────────────────────────────

  it('uses custom paragraph renderer', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Custom' }] },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <div data-testid="custom-p">{children}</div>,
        }}
      />
    );
    expect(screen.getByTestId('custom-p')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('uses custom heading renderer', () => {
    const content: BlocksContent = [
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Title' }] },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          heading: ({ children, level }) => <div data-testid={`heading-${level}`}>{children}</div>,
        }}
      />
    );
    expect(screen.getByTestId('heading-2')).toBeInTheDocument();
  });

  it('uses custom link renderer', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ type: 'text', text: 'Link' }],
          },
        ],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          link: ({ children, url }) => (
            <a data-testid="custom-link" href={url}>
              {children}
            </a>
          ),
        }}
      />
    );
    expect(screen.getByTestId('custom-link')).toHaveAttribute('href', 'https://example.com');
  });

  // ── Custom Modifier Renderers ────────────────────────────────────

  it('uses custom bold modifier', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Bold', bold: true }] },
    ];
    render(
      <BlocksRenderer
        content={content}
        modifiers={{
          bold: ({ children }) => <b data-testid="custom-bold">{children}</b>,
        }}
      />
    );
    expect(screen.getByTestId('custom-bold')).toBeInTheDocument();
  });

  it('uses custom color modifier', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Colored', color: '#FF0000' }],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        modifiers={{
          color: ({ children, color }) => (
            <span data-testid="custom-color" data-color={color}>
              {children}
            </span>
          ),
        }}
      />
    );
    const el = screen.getByTestId('custom-color');
    expect(el).toHaveAttribute('data-color', '#FF0000');
  });

  it('uses custom backgroundColor modifier', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Highlighted', backgroundColor: '#FFFF00' }],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        modifiers={{
          backgroundColor: ({ children, backgroundColor }) => (
            <mark data-testid="custom-bg" style={{ backgroundColor }}>
              {children}
            </mark>
          ),
        }}
      />
    );
    expect(screen.getByTestId('custom-bg')).toBeInTheDocument();
  });
});
