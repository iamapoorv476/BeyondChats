
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BeyondChats Article Library
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-Enhanced Content Platform
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                   AI Powered
                </span>
              </div>
            </div>
          </div>
        </header>

        
        <main>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </main>

       
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 text-sm">
                  This platform showcases original articles from BeyondChats and their AI-enhanced versions, 
                  improved using advanced language models and competitive analysis.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Features</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>✓ Original Content Archive</li>
                  <li>✓ AI-Enhanced Articles</li>
                  <li>✓ Competitive Analysis</li>
                  <li>✓ Source Citations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Technology</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• React + Tailwind CSS</li>
                  <li>• Laravel API</li>
                  <li>• Node.js Scraping</li>
                  <li>• Groq AI</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
              <p>© 2024 BeyondChats Article Enhancement Project</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;