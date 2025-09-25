const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        // Only set Content-Type for non-FormData requests
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Document endpoints
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('document', file);
    const token = localStorage.getItem('token');
    
    return this.request('/documents/process', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, but keep Authorization
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData,
    });
  }

  async getDocumentHistory(limit = 50, offset = 0) {
    return this.request(`/documents/history?limit=${limit}&offset=${offset}`);
  }

  async getDocumentStats() {
    return this.request('/documents/stats');
  }

  // Chat endpoints
  async askQuestion(question, context, documentName, sessionId) {
    return this.request('/chat/ask', {
      method: 'POST',
      body: JSON.stringify({
        question,
        context,
        documentName,
        sessionId,
      }),
    });
  }

  async getChatHistory(sessionId) {
    return this.request(`/chat/history/${sessionId}`);
  }

  async getChatSessions() {
    return this.request('/chat/sessions');
  }

  // Analytics endpoints
  async getAnalyticsDashboard() {
    return this.request('/analytics/dashboard');
  }

  async getAnalyticsTrends(days = 30) {
    return this.request(`/analytics/trends?days=${days}`);
  }
}

export default new ApiService();