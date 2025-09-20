const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Метод для инициализации токена из localStorage
  initToken() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Всегда проверяем токен из localStorage
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Если токен недействителен, очищаем его
        if (response.status === 401) {
          localStorage.removeItem('token');
          this.token = null;
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(login, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(login, password, nickname, email) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password, nickname, email }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async getAllUsers() {
    return this.request('/auth/users');
  }

  // Products methods
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Dishes methods
  async getDishes() {
    return this.request('/dishes');
  }

  async getDish(id) {
    return this.request(`/dishes/${id}`);
  }

  async createDish(dishData) {
    return this.request('/dishes', {
      method: 'POST',
      body: JSON.stringify(dishData),
    });
  }

  async updateDish(id, dishData) {
    return this.request(`/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dishData),
    });
  }

  async deleteDish(id) {
    return this.request(`/dishes/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiClient();
