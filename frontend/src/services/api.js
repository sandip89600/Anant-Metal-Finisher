import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Bearer token if stored in sessionStorage (supplementing cookies)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('amf_auth_token') || sessionStorage.getItem('amp_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for standardized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      errors: error.response?.data?.errors || []
    };
    return Promise.reject(customError);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const productsApi = {
  getProducts: (params) => api.get('/capabilities', { params }),
  getProductBySlug: (slug) => api.get(`/capabilities/${slug}`),
  getCategories: () => api.get('/categories')
};

export const capabilitiesApi = productsApi;

export const galleryApi = {
  getGallery: (params) => api.get('/gallery', { params }),
  getWork: (params) => api.get('/gallery/work', { params }),
  getItemById: (id) => api.get(`/gallery/${id}`)
};

export const blogApi = {
  getBlogs: (params) => api.get('/blog', { params }),
  getBlogBySlug: (slug) => api.get(`/blog/${slug}`),
  getCategories: () => api.get('/blog/categories')
};

export const enquiryApi = {
  submitContact: (data) => api.post('/contact', data),
  submitQuote: (data) => api.post('/quotes', data)
};

export const settingsApi = {
  getPublicSettings: () => api.get('/settings/public')
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Capabilities / Products
  getProducts: (params) => api.get('/admin/products', { params }),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Gallery & Our Work Portfolio
  getGallery: (params) => api.get('/admin/gallery', { params }),
  createGalleryItem: (data) => api.post('/admin/gallery', data),
  updateGalleryItem: (id, data) => api.patch(`/admin/gallery/${id}`, data),
  deleteGalleryItem: (id) => api.delete(`/admin/gallery/${id}`),

  // Blogs
  getBlogs: (params) => api.get('/admin/blog', { params }),
  getBlog: (id) => api.get(`/admin/blog/${id}`),
  createBlog: (data) => api.post('/admin/blog', data),
  updateBlog: (id, data) => api.patch(`/admin/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/admin/blog/${id}`),

  // Enquiries & Messages
  getEnquiries: (params) => api.get('/admin/enquiries', { params }),
  getEnquiry: (id) => api.get(`/admin/enquiries/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/enquiries/${id}/status`, { status }),
  toggleRead: (id, isRead) => api.patch(`/admin/enquiries/${id}/read`, { isRead }),
  deleteEnquiry: (id) => api.delete(`/admin/enquiries/${id}`),
  addNote: (id, note) => api.post(`/admin/enquiries/${id}/notes`, { note }),
  exportCsvUrl: (params = {}) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const query = new URLSearchParams(params).toString();
    return `${base}/admin/enquiries/export?${query}`;
  },

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),

  // Upload
  uploadImage: (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
