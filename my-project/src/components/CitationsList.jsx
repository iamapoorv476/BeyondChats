import React from 'react';

const CitationsList = ({ references }) => {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        References & Citations
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm">
        This article was enhanced using insights from the following sources:
      </p>

      <ol className="space-y-3">
        {references.map((ref, index) => {
          // Handle both string URLs and object references
          const url = typeof ref === 'string' ? ref : ref.url;
          const title = typeof ref === 'object' ? ref.title : null;

          return (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium break-all"
                >
                  {title || url}
                </a>
                {title && (
                  <p className="text-sm text-gray-500 mt-1 break-all">{url}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CitationsList;
