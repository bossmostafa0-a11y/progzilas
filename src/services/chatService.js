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

export const getChatsupport = async () => {
  try {
    const response = await api.get('/chat/getMyChatsupport');
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
    console.log(chatId)
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

//جلب شات الدعم الفني
export const getSupportChat = async (projectId = null) => {
  try {
    const response = await api.get(`/chat/support/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

//جلب الرسائل للدعم الفني 
export const getSupportMessages = async (chatId) => {
  const response = await api.get(`/chat/messages/${chatId}`);
  return response.data;
};