import React, { useState, useEffect, use } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchArticleById } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import CitationsList from './CitationsList';

const ArticleDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [article ,setArticle] = useState(null);
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect (()=>{
        loadArticle();
    }, [id]);

    const loadArticle = async ()=>{
        try{
            setLoading(true);
            setError(null);
            const data = await fetchArticleById(id);
            setArticle(data);
        }
        catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
    }

    const formatDate = (dateString) => {
        if(!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US',{
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  if (!article) return null;

   return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Articles
      </button>
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {article.is_updated && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">AI Enhanced Article</span>
            </div>
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-8 pb-6 border-b border-gray-200">
            {article.author && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{article.author}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(article.published_date || article.created_at)}</span>
            </div>

            {article.source_url && (
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Original Source
              </a>
            )}
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>

          {article.references && article.references.length > 0 && (
            <CitationsList references={article.references} />
          )}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
            <div className="space-y-3">
              {article.original_article && (
                <Link
                  to={`/article/${article.original_article.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Original Version</p>
                      <p className="font-semibold text-gray-900">{article.original_article.title}</p>
                    </div>
                  </div>
                </Link>
              )}

              {article.updated_versions && article.updated_versions.length > 0 && (
                <>
                  {article.updated_versions.map((updatedArticle) => (
                    <Link
                      key={updatedArticle.id}
                      to={`/article/${updatedArticle.id}`}
                      className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm text-green-700 mb-1">Enhanced Version</p>
                          <p className="font-semibold text-gray-900">{updatedArticle.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;