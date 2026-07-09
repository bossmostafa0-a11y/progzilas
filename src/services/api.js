// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://startupreally-production.up.railway.app';

// ✅ تأكد من التصدير بالاسم الصحيح
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 300000,
  withCredentials: true
});

// Interceptor: إضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `user ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: معالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'حدث خطأ في الخادم',
      data: error.response.data
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت',
      data: null
    };
  } else {
    return {
      status: 0,
      message: error.message || 'حدث خطأ غير متوقع',
      data: null
    };
  }
};

// ✅ تأكد من التصدير الافتراضي
export default api;