// src/services/projectRoom.service.js

import { api, handleApiError } from './api';

// ============ جلب بيانات غرفة المشروع ============
export const getProjectRoom = async (projectId) => {
  try {
    const response = await api.get(`/dev/room/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ جلب المهام ============
export const getProjectTasks = async (projectId) => {
  try {
    const response = await api.get(`/dev/getProjectTasks/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ إنشاء مهمة ============
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/dev/createTask', taskData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ تحديث حالة المهمة ============
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/dev/updateTaskStatus/${taskId}`, { status });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ حذف مهمة ============
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/dev/deleteTask/${taskId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// src/services/projectRoom.service.js

// ============ جلب أعضاء المشروع ============
export const getProjectMembers = async (projectId) => {
  try {
    const response = await api.get(`/dev/members/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ إرسال دعوة لمبرمج ============
export const inviteDeveloper = async (projectId, developerId) => {
  try {
    const response = await api.post(`/dev/project/${projectId}/invite`, { developerId });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
//حذف عضو
export const removeTeamMember = async (projectId, memberId) => {
  try {
    const response = await api.delete(`/dev/removeMember/${projectId}/${memberId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// ============ إنشاء مجلد ============
export const createFolder = async (projectId, folderName) => {
  try {
    const response = await api.post(`/dev/createFolder/${projectId}/folder`, { name: folderName });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ جلب ملفات المجلد ============
export const getFolderFiles = async (projectId, folderId) => {
  try {
    const response = await api.get(`/dev/getFolderFiles/${projectId}/folder/${folderId}/files`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ جلب جميع المجلدات ============
export const getProjectFolders = async (projectId) => {
  try {
    const response = await api.get(`/dev/getProjectFolders/${projectId}/folders`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ رفع ملف ============
export const uploadFile = async (projectId, folderId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post(
      `/dev/uploadProjectFil/${projectId}/folder/${folderId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ حذف ملف ============
export const deleteFile = async (projectId, fileId) => {
  try {
    const response = await api.delete(`/dev/deleteProjectFile/${projectId}/file/${fileId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ حذف مجلد ============
export const deleteFolder = async (projectId, folderId) => {
  try {
    const response = await api.delete(`/dev/deleteFolder/${projectId}/folder/${folderId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// ============ جلب الانشطة =================
export const getProjectActivity = async (projectId) => {
  try {
    const response = await api.get(`/dev/getProjectActivity/${projectId}/activity`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// ============ تحديث روابط المشروع ============
export const updateProjectLinks = async (projectId, data) => {
  try {
    const response = await api.patch(`/dev/updateProjectLinks/${projectId}/links`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// ============ جلب المميزات والأهداف معاً ============
export const getProjectFeaturesAndGoals = async (projectId) => {
  try {
    const response = await api.get(`/dev/project/${projectId}/features-goals`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// ============ إضافة ميزة جديدة ============
export const addFeature = async (projectId, featureData) => {
  try {
    const response = await api.post(`/client/addfeatures/${projectId}/feature`, featureData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ إضافة هدف جديد ============
export const addGoal = async (projectId, goalData) => {
  try {
    const response = await api.post(`/client/addObjective/${projectId}/objective`, goalData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ إضافة دفعة جديدة ============
export const addPayment = async (projectId, paymentData) => {
  try {
    const response = await api.post(`/client/addbatch/${projectId}`, paymentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// src/services/projectRoom.service.js

// ============ الموافقة على المشروع ============
export const approveProject = async (projectId) => {
  try {
    const response = await api.patch(`/client/clinetapprove/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// ✅ إضافة دالة submitReview في نهاية الملف

// ============ إرسال تقييم للمشروع ============
export const submitReview = async (data) => {
  try {
    const { projectId, rating, comment } = data;
    
    if (!projectId) {
      throw new Error('معرف المشروع مطلوب');
    }
    
    if (!rating || rating < 1 || rating > 5) {
      throw new Error('يرجى اختيار تقييم من 1 إلى 5 نجوم');
    }

    const response = await api.post(`/client/submitReview/${projectId}`, {
      rating,
      comment: comment || ''
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting review:', error);
    throw handleApiError(error);
  }
};
