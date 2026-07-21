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
  const response = await api.get('/client/getmyprojectbuyed');
  return response.data;
};

// شراء مشروع من المتجر
export const purchaseProject = async (data) => {
  const response = await api.post('/client/buyproject', data);
  return response.data;
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
//جلب مشروع معين في التجر
export const getMarketplaceProjectById = async (id) => {
  const response = await api.get(`/client/getdetilsproject/${id}`);
  return response.data;
};
//جلب المبرمجين و المشاريع 
export const getHomeDetails = async () => {
  const response = await api.get('/client/gethomedetails');
  return response.data;
};


export const submitReview = async (data) => {
  const response = await api.post('/client/submitProjectReview', data);
  return response.data;
};
//جلب تقيمات مشروع معبن
export const getProjectReviews = async (projectId) => {
  const response = await api.get(`/client/getProjectReviews/${projectId}`);
  return response.data;
};
//انشاء دعم فني
export const createSupportChat = async (projectId) => {
  const response = await api.post('/client/createsupport', { storeproject: projectId });
  return response.data;
};

// ✅ إرسال بلاغ عن مشكلة مع الصور
export const submitReport = async (formData) => {
  try {
    const response = await api.post('/client/addreport', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};