import { useEffect, useState } from 'react';
import {
  BlocksRenderer,
  type BlocksContent,
  type CustomBlocksConfig,
} from '@k11k/better-blocks-react-renderer';

interface Article {
  id: number;
  documentId: string;
  content: BlocksContent;
}

// A custom callout renderer that fully replaces the default GitHub-style markup.
// It receives `variant`, `title`, and the already-rendered `children`.
const EMOJI: Record<string, string> = {
  note: 'ℹ️',
  tip: '💡',
  important: '📣',
  warning: '⚠️',
  caution: '🛑',
};

const customBlocks: CustomBlocksConfig = {
  callout: ({ variant, title, children }) => (
    <div
      style={{
        borderRadius: 8,
        padding: '12px 16px',
        margin: '16px 0',
        background: '#f4f0ff',
        border: '1px solid #d7c7ff',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>
        {EMOJI[variant] ?? '🔖'} {title ?? variant.toUpperCase()}
      </div>
      {children}
    </div>
  ),
  // A custom details renderer that fully replaces the default <details> markup.
  // It receives `summary`, `defaultOpen`, and the already-rendered `children`.
  details: ({ summary, defaultOpen, children }) => (
    <details
      className="custom-details"
      open={defaultOpen}
      style={{
        borderRadius: 8,
        margin: '16px 0',
        background: '#f4f0ff',
        border: '1px solid #d7c7ff',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 700,
          padding: '10px 16px',
          color: '#7c3aed',
        }}
      >
        🔽 {summary}
      </summary>
      <div style={{ padding: '0 16px 8px' }}>{children}</div>
    </details>
  ),
};

// GitHub-style CSS targeting the DEFAULT details markup (bb-details classes).
// This proves the default output can be themed with plain CSS, no override.
const githubDetailsCss = `
.gh-details .bb-details {
  border: 1px solid #d0d7de;
  border-radius: 6px;
  margin: 16px 0;
  background: #fff;
}
.gh-details .bb-details-summary {
  cursor: pointer;
  padding: 8px 16px;
  font-weight: 600;
  background: #f6f8fa;
  border-radius: 6px;
  list-style: none;
}
/* Hide the browser's native disclosure triangle and draw our own that rotates */
.gh-details .bb-details-summary::-webkit-details-marker {
  display: none;
}
.gh-details .bb-details-summary::before {
  content: '\\25B8';
  display: inline-block;
  margin-right: 8px;
  color: #57606a;
  transition: transform 0.15s ease;
}
.gh-details .bb-details[open] > .bb-details-summary::before {
  transform: rotate(90deg);
}
.gh-details .bb-details[open] > .bb-details-summary {
  border-bottom: 1px solid #d0d7de;
  border-radius: 6px 6px 0 0;
  margin-bottom: 8px;
}
/* Inset the body via horizontal margin (not padding) so list bullets keep their
   indentation and nested details boxes don't get extra interior padding. */
.gh-details .bb-details > :not(.bb-details-summary) {
  margin-left: 16px;
  margin-right: 16px;
}
/* Bottom padding only when open — when collapsed the summary should fill the
   card edge-to-edge with no gap below it. */
.gh-details .bb-details[open] {
  padding-bottom: 8px;
}

/* Custom override demo: hide the native marker so only the emoji shows, and
   keep the body content flush within the box. */
.custom-details > summary {
  list-style: none;
}
.custom-details > summary::-webkit-details-marker {
  display: none;
}
.custom-details > div > :first-child {
  margin-top: 0;
}
.custom-details > div > :last-child {
  margin-bottom: 0;
}
`;

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/articles?status=published')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setArticles(
          json.data.map((item: Article) => ({
            id: item.id,
            documentId: item.documentId,
            content: item.content,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <style>{githubDetailsCss}</style>
      <h1>Better Blocks Renderer Playground</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Fetching articles from Strapi at <code>localhost:1337</code> and rendering with{' '}
        <code>@k11k/better-blocks-react-renderer</code>
      </p>

      {loading && <p>Loading articles...</p>}
      {error && (
        <p style={{ color: 'red' }}>
          Error: {error}. Make sure Strapi is running on port 1337.
        </p>
      )}
      {!loading && !error && articles.length === 0 && (
        <p>
          No published articles found. Create one in{' '}
          <a href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer">
            Strapi admin
          </a>{' '}
          and publish it.
        </p>
      )}

      {articles.map((article) => {
        // Pull just the callout blocks out so the custom-renderer demo below is
        // focused on callouts (not a second copy of the whole article).
        const callouts = article.content.filter((block) => block.type === 'callout');
        const details = article.content.filter((block) => block.type === 'details');

        return (
          <article
            key={article.documentId}
            style={{
              marginBottom: 48,
              borderBottom: '1px solid #eee',
              paddingBottom: 24,
            }}
          >
            <h2
              style={{
                color: '#888',
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ① Default rendering &mdash; callouts are GitHub-style
            </h2>
            <BlocksRenderer content={article.content} />

            {callouts.length > 0 && (
              <section
                style={{
                  marginTop: 40,
                  paddingTop: 16,
                  borderTop: '2px dashed #d7c7ff',
                }}
              >
                <h2
                  style={{
                    color: '#7c3aed',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ② Custom callout renderer &mdash; same callouts via the{' '}
                  <code>blocks</code> override
                </h2>
                <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>
                  The callouts below are the exact same content as above, re-rendered with a
                  custom <code>callout</code> component (purple boxes with emoji) instead of the
                  built-in GitHub-style default.
                </p>
                <BlocksRenderer content={callouts} blocks={customBlocks} />
              </section>
            )}

            {details.length > 0 && (
              <section
                style={{
                  marginTop: 40,
                  paddingTop: 16,
                  borderTop: '2px dashed #d0d7de',
                }}
              >
                <h2
                  style={{
                    color: '#57606a',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ③ GitHub-style details &mdash; default markup themed with plain{' '}
                  <code>.bb-details</code> CSS
                </h2>
                <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>
                  The same details blocks as above, restyled to look like GitHub&rsquo;s
                  collapsible sections purely via CSS on the default <code>bb-details</code> /{' '}
                  <code>bb-details-summary</code> classes &mdash; no <code>blocks</code> override.
                </p>
                <div className="gh-details">
                  <BlocksRenderer content={details} />
                </div>

                <h2
                  style={{
                    color: '#7c3aed',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: 32,
                  }}
                >
                  ④ Custom details renderer &mdash; via the <code>blocks</code> override
                </h2>
                <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>
                  The same details blocks re-rendered with a custom <code>details</code> component
                  (purple box, emoji marker) instead of the built-in default.
                </p>
                <BlocksRenderer content={details} blocks={customBlocks} />
              </section>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default App;
