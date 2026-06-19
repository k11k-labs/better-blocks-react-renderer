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
};

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
          </article>
        );
      })}
    </div>
  );
}

export default App;
