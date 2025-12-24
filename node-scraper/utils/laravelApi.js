const axios = require('axios');

const API_BASE_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

async function fetchLatestArticle() {
    try {
        console.log('Fetching latest article from Laravel API...');
        
        const response = await axios.get(`${API_BASE_URL}/articles/latest/fetch`);
        
        if (!response.data) {
            throw new Error('No articles found');
        }

        console.log(`Fetched article: "${response.data.title}"`);
        return response.data;

    } catch (error) {
        console.error('Error fetching latest article:', error.message);
        throw error;
    }
}

async function fetchArticles(params = {}) {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles`, { params });
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        throw error;
    }
}

async function createArticle(articleData) {
    try {
        console.log(`Publishing article: "${articleData.title}"`);
        
        const response = await axios.post(`${API_BASE_URL}/articles`, articleData);
        
        console.log('Article published successfully');
        return response.data.article || response.data;

    } catch (error) {
        console.error('Error creating article:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

async function updateArticle(articleId, articleData) {
    try {
        console.log(`Updating article ID: ${articleId}`);
        
        const response = await axios.put(`${API_BASE_URL}/articles/${articleId}`, articleData);
        
        console.log('Article updated successfully');
        return response.data.article || response.data;

    } catch (error) {
        console.error('Error updating article:', error.message);
        throw error;
    }
}

async function deleteArticle(articleId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/articles/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting article:', error.message);
        throw error;
    }
}

async function fetchArticleById(articleId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article:', error.message);
        throw error;
    }
}

module.exports = {
    fetchLatestArticle,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchArticleById
};