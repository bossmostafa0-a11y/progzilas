// src/services/clientService.js
import { api, handleApiError } from './api';

// ============ مشاريع العميل ============

// جلب مشاريع العميل
export const getClientProjects = async () => {
  try {
    const response = await api.get('/client/myprojects');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// إنشاء مشروع جديد (عميل)
export const createClientProject = async (projectData) => {
  try {
    const response = await api.post('/client/createproject', projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// جلب تفاصيل مشروع (عميل)
export const getClientProjectDetails = async (projectId) => {
  try {
    const response = await api.get(`/client/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ العروض ============

// جلب العروض على مشروع
export const getClientProposals = async () => {
  try {
    const response = await api.get(`/client/getProjectProposals`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ قبول عرض ============
export const acceptProposal = async (proposalId) => {
  try {
    const response = await api.patch(`/client/accept/${proposalId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ رفض عرض ============
export const rejectProposal = async (proposalId) => {
  try {
    const response = await api.patch(`/client/reject/${proposalId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ المشتريات ============

// جلب مشتريات العميل
export const getClientPurchases = async () => {
  try {
    const response = await api.get('/client/purchases');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// شراء مشروع من المتجر
export const purchaseProject = async (projectId, packageId) => {
  try {
    const response = await api.post('/client/purchase', { projectId, packageId });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
//جلب بيانات الداش بورد للعميل
export const getClientDashboard = async () => {
  const response = await api.get('/client/clinetdashboard');
  return response.data.data;
};


// ✅ تحديث بيانات الحساب
export const updateAccountSettings = async (data) => {
  const response = await api.put('/client/updateAccountSettings', data);
  return response.data;
};

// ✅ تحديث إعدادات الإشعارات
export const updateNotificationSettings = async (data) => {
  const response = await api.put('/client/updateNotificationSettings', data);
  return response.data;
};

// ✅ تغيير كلمة المرور
export const changePassword = async (data) => {
  const response = await api.put('/auth/changePassword', data);
  return response.data;
};

// ✅ حذف الحساب
export const deleteAccount = async () => {
  const response = await api.delete('/client/deleteAccount');
  return response.data;
};
export const getMarketplaceProjectById = async (id) => {
  const response = await api.get(`/client/getdetilsproject/${id}`);
  return response.data;
};