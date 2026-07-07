// src/services/chatService.js

import { api, handleApiError } from './api';

// ============ جلب كل المحادثات ============
export const getChats = async () => {
  try {
    const response = await api.get('/chat/my');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ جلب رسائل الشات ============
export const getChatMessages = async (chatId) => {
  try {
    // ✅ المسار الصحيح - يبعت projectId
    const response = await api.get(`/chat/messages/${chatId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ إنشاء شات جديد ============
export const getChatByProject = async (projectId) => {
  try {
    const response = await api.post('/chat/create', { projectId });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};