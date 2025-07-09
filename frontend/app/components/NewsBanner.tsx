import React, { useEffect, useState } from 'react';
 
interface NewsArticle {
  title: string;
  link: string;
  image_url?: string;
  description?: string;
  source_id?: string;
  pubDate?: string;
  creator?: string[];
  category?: string[];
}
 
interface NewsBannerProps {
  topic: string;
}
 
const ENDPOINT = 'https://n8n.srv810314.hstgr.cloud/webhook/news';
 
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
 
export default function NewsBanner({ topic }: NewsBannerProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
 
  useEffect(() => {
    setLoading(true);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic || 'AI' }),
    })
      .then(res => res.json())
      .then(data => {
        setArticles(Array.isArray(data.results) ? data.results.slice(0, 20) : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load news.');
        setLoading(false);
      });
  }, [topic]);
 
  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <span className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-400 text-center py-4">{error}</div>;
  }
  if (!articles.length) {
    return <div className="text-gray-400 text-center py-4">No news found.</div>;
  }
 
  return (
    <div className="w-full flex flex-col items-start mt-8 max-w-2xl">
      <h2 className="text-lg font-bold text-gray-100 mb-4 uppercase tracking-wide">Latest in Technology</h2>
      <div className="w-full flex flex-col divide-y divide-gray-700">
        {articles.map((article, idx) => (
          <div key={idx} className="flex flex-row items-start py-5 gap-4">
            <div className="flex-1 min-w-0">
              {/* Category/Source */}
              <div className="text-xs font-semibold text-blue-400 mb-1">
                {article.category && article.category.length ? article.category[0] : (article.source_id || 'News')}
              </div>
              {/* Headline */}
              <div className="text-lg font-bold text-gray-100 leading-snug mb-1 line-clamp-2">
                {article.title}
              </div>
              {/* Description */}
              {article.description && (
                <div className="text-sm text-gray-300 mb-1 line-clamp-3">{article.description}</div>
              )}
              {/* Byline/Date */}
              <div className="text-xs text-gray-400 mb-1">
                {formatDate(article.pubDate)}
                {article.creator && article.creator.length ? ' | ' + article.creator.join(', ') : ''}
              </div>
              {/* Read more */}
              <button
                className="text-blue-400 text-xs font-semibold hover:underline focus:outline-none"
                onClick={() => setOpenIdx(idx)}
              >
                Read more
              </button>
            </div>
            {/* Image */}
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-28 h-20 object-cover rounded-md flex-shrink-0 ml-2 border border-gray-700 bg-gray-900"
                style={{ minWidth: '7rem', minHeight: '5rem' }}
              />
            )}
          </div>
        ))}
      </div>
      {/* Modal for full news */}
      {openIdx !== null && articles[openIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-700">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-2xl font-bold focus:outline-none"
              onClick={() => setOpenIdx(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {articles[openIdx].image_url && (
              <img
                src={articles[openIdx].image_url}
                alt={articles[openIdx].title}
                className="w-full h-48 object-cover rounded mb-4 border border-gray-800 bg-gray-900"
              />
            )}
            <div className="text-xs font-semibold text-blue-400 mb-2">
              {articles[openIdx].category && articles[openIdx].category.length ? articles[openIdx].category[0] : (articles[openIdx].source_id || 'News')}
            </div>
            <div className="text-2xl font-bold text-gray-100 mb-2 leading-tight">
              {articles[openIdx].title}
            </div>
            <div className="text-xs text-gray-400 mb-4">
              {formatDate(articles[openIdx].pubDate)}
              {articles[openIdx].creator && articles[openIdx].creator.length ? ' | ' + articles[openIdx].creator.join(', ') : ''}
            </div>
            {articles[openIdx].description && (
              <div className="text-base text-gray-200 mb-4 whitespace-pre-line">{articles[openIdx].description}</div>
            )}
            <a
              href={articles[openIdx].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-400 hover:underline text-sm font-semibold"
            >
              View original article &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}