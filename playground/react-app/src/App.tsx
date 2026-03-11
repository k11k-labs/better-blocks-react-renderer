import { useEffect, useState } from 'react';
import { BlocksRenderer, type BlocksContent } from '@k11k/better-blocks-react-renderer';

interface Article {
  id: number;
  documentId: string;
  content: BlocksContent;
}

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

      {articles.map((article) => (
        <article
          key={article.documentId}
          style={{
            marginBottom: 48,
            borderBottom: '1px solid #eee',
            paddingBottom: 24,
          }}
        >
          <BlocksRenderer content={article.content} />
        </article>
      ))}
    </div>
  );
}

export default App;
