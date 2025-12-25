import React, { useState, useEffect } from 'react';
import { fetchArticles } from '../../services/api';
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import LoadingSpinner from './LoadingSpinner';

const ArticleList = () => {
  const [articles,setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(()=>{
    loadArticles();
  }, [filter, currentPage]);

  const loadArticles = async () =>{
    try {
        setLoading(true);
        setError(null);

        const params = {
            page : currentPage,
            per_page : 9
        }

         if (filter === 'original') {
        params.is_updated = false;
      } else if (filter === 'enhanced') {
        params.is_updated = true;
      }
      const response = await fetchArticles(params);
      if(response.data){
        setArticles(response.data);
        setTotalPages(response.last_page || 1);
      }
      else{
        setArticles(response);
      }

    }
    catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false);
    }

  }
   const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && articles.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Article Library
        </h1>
        <p className="text-gray-600">
          Browse original and AI-enhanced articles
        </p>
      </div>
      <FilterBar 
        currentFilter={filter} 
        onFilterChange={handleFilterChange}
        articleCount={articles.length}
      />
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadArticles}
            className="mt-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            Try Again
          </button>
        </div>
      )}
      {!loading && articles.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-gray-500">
            {filter === 'all' ? 'Start by adding some articles to the database.' : `No ${filter} articles available.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {loading && articles.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ArticleList


