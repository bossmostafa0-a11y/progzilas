// src/services/notification.service.js

import { api, handleApiError } from './api';

// ✅ جلب جميع الإشعارات
export const getNotifications = async () => {
  try {
    const response = await api.get('/notification');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ✅ جلب عدد الإشعارات غير المقروءة
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notification/unread-count');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ✅ تعليم إشعار كمقروء
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notification/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ✅ تعليم جميع الإشعارات كمقروءة
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch('/notification/read-all');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ✅ حذف إشعار
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notification/${notificationId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ✅ حذف جميع الإشعارات
export const deleteAllNotifications = async () => {
  try {
    const response = await api.delete('/notification');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};