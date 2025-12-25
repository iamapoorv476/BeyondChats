import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange, articleCount }) => {
  const filters = [
    { id: 'all', label: 'All Articles', icon: '📚' },
    { id: 'original', label: 'Original', icon: '📝' },
    { id: 'enhanced', label: 'AI Enhanced', icon: '✨' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentFilter === filter.id
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
        
        <div className="ml-auto flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{articleCount} articles</span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
