
import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {article.is_updated && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold">
          ✨ AI Enhanced
        </div>
      )}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {article.author && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {article.author}
            </span>
          )}
          
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(article.published_date || article.created_at)}
          </span>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {truncateContent(article.content)}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link
            to={`/article/${article.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {article.references && article.references.length > 0 && (
            <span className="text-sm text-gray-500">
              {article.references.length} {article.references.length === 1 ? 'Reference' : 'References'}
            </span>
          )}
        </div>
        {article.is_updated && article.original_article_id && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              to={`/article/${article.original_article_id}`}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              View Original Version
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;