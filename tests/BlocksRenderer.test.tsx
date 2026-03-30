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

  it('renders links with target="_blank" and rel', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            target: '_blank',
            rel: 'noopener noreferrer',
            children: [{ type: 'text', text: 'External' }],
          },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const a = screen.getByText('External').closest('a');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not set target when not provided', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ type: 'text', text: 'Normal' }],
          },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const a = screen.getByText('Normal').closest('a');
    expect(a).not.toHaveAttribute('target');
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

  it('applies cycling list-style-type for unordered lists based on indentLevel', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Level 0' }] },
          {
            type: 'list',
            format: 'unordered',
            indentLevel: 1,
            children: [
              { type: 'list-item', children: [{ type: 'text', text: 'Level 1' }] },
              {
                type: 'list',
                format: 'unordered',
                indentLevel: 2,
                children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 2' }] }],
              },
            ],
          },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const uls = container.querySelectorAll('ul');
    expect(uls[0]).toHaveStyle({ listStyleType: 'disc' });
    expect(uls[1]).toHaveStyle({ listStyleType: 'circle' });
    expect(uls[2]).toHaveStyle({ listStyleType: 'square' });
  });

  it('applies cycling list-style-type for ordered lists based on indentLevel', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'ordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Level 0' }] },
          {
            type: 'list',
            format: 'ordered',
            indentLevel: 1,
            children: [
              { type: 'list-item', children: [{ type: 'text', text: 'Level 1' }] },
              {
                type: 'list',
                format: 'ordered',
                indentLevel: 2,
                children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 2' }] }],
              },
            ],
          },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const ols = container.querySelectorAll('ol');
    expect(ols[0]).toHaveStyle({ listStyleType: 'decimal' });
    expect(ols[1]).toHaveStyle({ listStyleType: 'lower-alpha' });
    expect(ols[2]).toHaveStyle({ listStyleType: 'upper-roman' });
  });

  it('cycles list-style-type back to start after exhausting styles', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 3,
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 3' }] }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('ul')).toHaveStyle({ listStyleType: 'disc' });
  });

  it('defaults to indentLevel 0 when not provided', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'No indent' }] }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('ul')).toHaveStyle({ listStyleType: 'disc' });
  });

  it('supports mixed ordered/unordered nested lists with indentLevel', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Bullet' }] },
          {
            type: 'list',
            format: 'ordered',
            indentLevel: 1,
            children: [{ type: 'list-item', children: [{ type: 'text', text: 'Numbered' }] }],
          },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('ul')).toHaveStyle({ listStyleType: 'disc' });
    expect(container.querySelector('ol')).toHaveStyle({ listStyleType: 'lower-alpha' });
  });

  // ── To-do Lists ──────────────────────────────────────────────────

  it('renders to-do list with checkboxes', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: false, children: [{ type: 'text', text: 'Unchecked' }] },
          { type: 'list-item', checked: true, children: [{ type: 'text', text: 'Checked' }] },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it('applies strikethrough and opacity to checked to-do items', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: true, children: [{ type: 'text', text: 'Done' }] },
        ],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const span = screen.getByText('Done');
    expect(span).toHaveStyle({ textDecoration: 'line-through', opacity: 0.6 });
  });

  it('renders to-do list without bullet markers', () => {
    const content: BlocksContent = [
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: false, children: [{ type: 'text', text: 'Task' }] },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const ul = container.querySelector('ul');
    expect(ul).toHaveStyle({ listStyle: 'none' });
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

  it('renders image with caption', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        caption: 'A beautiful photo',
        children: [{ type: 'text', text: '' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('A beautiful photo').tagName).toBe('FIGCAPTION');
  });

  it('does not render figcaption when caption is empty', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('renders image inside a figure element', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('figure')).toBeInTheDocument();
  });

  it('renders image with alignment', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        imageAlign: 'left',
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('figure')).toHaveStyle({ textAlign: 'left' });
  });

  it('defaults image alignment to center', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('figure')).toHaveStyle({ textAlign: 'center' });
  });

  // ── Horizontal Line ──────────────────────────────────────────────

  it('renders horizontal line', () => {
    const content: BlocksContent = [
      { type: 'horizontal-line', children: [{ type: 'text', text: '' }] },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  // ── Text Alignment ───────────────────────────────────────────────

  it('renders paragraph with text alignment', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        textAlign: 'center',
        children: [{ type: 'text', text: 'Centered' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Centered').closest('p')).toHaveStyle({ textAlign: 'center' });
  });

  it('renders heading with text alignment', () => {
    const content: BlocksContent = [
      {
        type: 'heading',
        level: 2,
        textAlign: 'right',
        children: [{ type: 'text', text: 'Right H2' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Right H2')).toHaveStyle({ textAlign: 'right' });
  });

  it('renders blockquote with text alignment', () => {
    const content: BlocksContent = [
      {
        type: 'quote',
        textAlign: 'center',
        children: [{ type: 'text', text: 'Centered quote' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Centered quote').closest('blockquote')).toHaveStyle({
      textAlign: 'center',
    });
  });

  it('does not apply textAlign style when not set', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Default' }] },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('p')?.getAttribute('style')).toBeNull();
  });

  // ── Tables ───────────────────────────────────────────────────────

  it('renders a table with header and data cells', () => {
    const content: BlocksContent = [
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-header-cell', children: [{ type: 'text', text: 'Name' }] },
              { type: 'table-header-cell', children: [{ type: 'text', text: 'Age' }] },
            ],
          },
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ type: 'text', text: 'Alice' }] },
              { type: 'table-cell', children: [{ type: 'text', text: '30' }] },
            ],
          },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelectorAll('th')).toHaveLength(2);
    expect(container.querySelectorAll('td')).toHaveLength(2);
    expect(screen.getByText('Name').tagName).toBe('TH');
    expect(screen.getByText('Alice').tagName).toBe('TD');
  });

  it('renders table within tbody', () => {
    const content: BlocksContent = [
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ type: 'text', text: 'Cell' }] }],
          },
        ],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  // ── Media Embed ──────────────────────────────────────────────────

  it('renders media embed as responsive iframe', () => {
    const content: BlocksContent = [
      {
        type: 'media-embed',
        url: 'https://www.youtube.com/embed/abc123',
        originalUrl: 'https://www.youtube.com/watch?v=abc123',
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123');
    expect(iframe).toHaveAttribute('allowfullscreen', '');
  });

  it('renders media embed wrapper with 16:9 aspect ratio', () => {
    const content: BlocksContent = [
      {
        type: 'media-embed',
        url: 'https://player.vimeo.com/video/12345',
        children: [{ type: 'text', text: '' }],
      },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveStyle({ position: 'relative', paddingBottom: '56.25%', height: '0' });
  });

  // ── Text Modifiers: uppercase, superscript, subscript ────────────

  it('renders uppercase text', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'upper', uppercase: true }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('upper')).toHaveStyle({ textTransform: 'uppercase' });
  });

  it('renders superscript text', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '2', superscript: true }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('2').tagName).toBe('SUP');
  });

  it('renders subscript text', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'n', subscript: true }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('n').tagName).toBe('SUB');
  });

  // ── Text Marks: fontFamily, fontSize ─────────────────────────────

  it('renders text with fontFamily', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Serif', fontFamily: 'Georgia, serif' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Serif')).toHaveStyle({ fontFamily: 'Georgia, serif' });
  });

  it('renders text with fontSize', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Big', fontSize: '24px' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Big')).toHaveStyle({ fontSize: '24px' });
  });

  // ── Block Properties: lineHeight, indent ─────────────────────────

  it('renders paragraph with lineHeight', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        lineHeight: '1.8',
        children: [{ type: 'text', text: 'Spaced' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Spaced').closest('p')).toHaveStyle({ lineHeight: '1.8' });
  });

  it('renders heading with lineHeight', () => {
    const content: BlocksContent = [
      {
        type: 'heading',
        level: 2,
        lineHeight: '2.0',
        children: [{ type: 'text', text: 'Spaced H2' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Spaced H2')).toHaveStyle({ lineHeight: '2.0' });
  });

  it('renders paragraph with indent', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        indent: 2,
        children: [{ type: 'text', text: 'Indented' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    expect(screen.getByText('Indented').closest('p')).toHaveStyle({ marginLeft: '4rem' });
  });

  it('renders block with combined textAlign, lineHeight, and indent', () => {
    const content: BlocksContent = [
      {
        type: 'paragraph',
        textAlign: 'center',
        lineHeight: '1.5',
        indent: 1,
        children: [{ type: 'text', text: 'Combined' }],
      },
    ];
    render(<BlocksRenderer content={content} />);
    const p = screen.getByText('Combined').closest('p');
    expect(p).toHaveStyle({ textAlign: 'center', lineHeight: '1.5', marginLeft: '2rem' });
  });

  it('does not apply lineHeight or indent when not set', () => {
    const content: BlocksContent = [
      { type: 'paragraph', children: [{ type: 'text', text: 'Plain' }] },
    ];
    const { container } = render(<BlocksRenderer content={content} />);
    expect(container.querySelector('p')?.getAttribute('style')).toBeNull();
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

  it('uses custom horizontal-line renderer', () => {
    const content: BlocksContent = [
      { type: 'horizontal-line', children: [{ type: 'text', text: '' }] },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          'horizontal-line': () => <div data-testid="custom-hr" />,
        }}
      />
    );
    expect(screen.getByTestId('custom-hr')).toBeInTheDocument();
  });

  it('uses custom media-embed renderer', () => {
    const content: BlocksContent = [
      {
        type: 'media-embed',
        url: 'https://www.youtube.com/embed/abc',
        originalUrl: 'https://www.youtube.com/watch?v=abc',
        children: [{ type: 'text', text: '' }],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          'media-embed': ({ url }) => <div data-testid="custom-embed">{url}</div>,
        }}
      />
    );
    expect(screen.getByTestId('custom-embed')).toBeInTheDocument();
  });

  it('uses custom table renderers', () => {
    const content: BlocksContent = [
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-header-cell', children: [{ type: 'text', text: 'Header' }] }],
          },
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ type: 'text', text: 'Data' }] }],
          },
        ],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          table: ({ children }) => <div data-testid="custom-table">{children}</div>,
          'table-row': ({ children }) => <div data-testid="custom-row">{children}</div>,
          'table-header-cell': ({ children }) => <div data-testid="custom-th">{children}</div>,
          'table-cell': ({ children }) => <div data-testid="custom-td">{children}</div>,
        }}
      />
    );
    expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    expect(screen.getAllByTestId('custom-row')).toHaveLength(2);
    expect(screen.getByTestId('custom-th')).toBeInTheDocument();
    expect(screen.getByTestId('custom-td')).toBeInTheDocument();
  });

  it('uses custom image renderer with caption and alignment', () => {
    const content: BlocksContent = [
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        caption: 'My caption',
        imageAlign: 'right',
        children: [{ type: 'text', text: '' }],
      },
    ];
    render(
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image, caption, imageAlign }) => (
            <div data-testid="custom-img" data-caption={caption} data-align={imageAlign}>
              <img src={image.url} alt={image.alternativeText || ''} />
            </div>
          ),
        }}
      />
    );
    const el = screen.getByTestId('custom-img');
    expect(el).toHaveAttribute('data-caption', 'My caption');
    expect(el).toHaveAttribute('data-align', 'right');
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
