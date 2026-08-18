// src/services/developerService.js
import axios from "axios";
import { api, handleApiError } from './api';

// ============ المشاريع ============

// جلب مشاريع المبرمج
export const getDeveloperProjects = async (filters = {}) => {
  try {
    const response = await api.get('/dev/getMyProposals', { params: filters });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// جلب تفاصيل مشروع
export const getProjectDetails = async (projectId) => {
  try {
    const response = await api.get(`/developer/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// إنشاء مشروع جديد
export const createProject = async (projectData, onUploadProgress) => {
  try {
    const response = await api.post('/dev/createproject', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress, // ✅ عشان تتبع التحميل
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// تحديث مشروع
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/developer/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// حذف مشروع
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/developer/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ العروض ============

// جلب عروض المبرمج
export const getMyProposals = async () => {
  try {
    const response = await api.get('/dev/getMyProposals');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// جلب عروض المبرمج


// تقديم عرض على مشروع
export const createProposal = async (proposalData) => {
  try {
    const response = await api.post('/dev/createProposal', proposalData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// تحديث عرض
export const updateProposal = async (proposalId, proposalData) => {
  try {
    const response = await api.put(`/developer/proposals/${proposalId}`, proposalData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
//جلب المشاريع المتاحة للتقديم
export const getOpenProjects = async () => {
  try {
    const response = await api.get('/dev/getOpenProjects');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ المتجر ============

// ============ تغيير حالة المشروع (نشر / إيقاف) ============
export const toggleProjectStatus = async (projectId) => {
  try {
    const response = await api.put(`/dev/updatestate`, { 
      id: projectId,       
      
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// جلب مشاريع المتجر
export const getStoreProjects = async (filters = {}) => {
  try {
    const response = await api.get('/dev/getallprojects', { params: filters });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// إضافة مشروع للمتجر
export const addToStore = async (projectData) => {
  try {
    const response = await api.post('/developer/store', projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// تحديث مشروع في المتجر
export const updatestoreProject = async (projectId, projectData) => {
  try {
    console.log('📤 Updating project:', projectId);
    console.log('📤 Data:', projectData);
    
    // ✅ لو البيانات FormData (ممكن تستخدمه بعدين)
    if (projectData instanceof FormData) {
      const response = await api.put(`/dev/updateProject`, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // ✅ لو بيانات JSON - ده اللي هنستخدمه دلوقتي
    const response = await api.put(`/dev/updateProject`, projectData);
    console.log('📥 Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update error:', error);
    console.error('❌ Error response:', error.response?.data);
    throw handleApiError(error);
  }
};

// حذف مشروع من المتجر
export const deleteStoreProject = async (projectId) => {
  try {
    const response = await api.delete(`/dev/deleteproject`, {
      data: { 
        id: projectId 
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============ الأرباح ============

// جلب أرباح المبرمج
export const getDeveloperEarnings = async () => {
  try {
    const response = await api.get('/dev/getDeveloperEarnings');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// طلب سحب أرباح
export const requestWithdrawal = async (withdrawalData) => {
  try {
    const response = await api.post('/developer/withdraw', withdrawalData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// جلب تاريخ السحوبات
export const getWithdrawalHistory = async () => {
  try {
    const response = await api.get('/developer/withdrawals');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const getDeveloperProject = async () => {
  try {
    const response = await api.get('/dev/GetDeveloperProjects');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDeveloperProfile = async (id) => {
  const response = await api.get(`/client/getdevprofile/${id}`);
  return response.data;
};
export const getDevelopers = async () => {
  const response = await api.get('/client/getalldev');
  return response.data;
};
export const getMarketplaceProjects = async () => {
  const response = await api.get('/client/getstore');
  return response.data;
};


export const updateAccountSettings = async (data) => {
  const response = await api.put('/dev/updateAccountSettings', data);
  return response.data;
};

export const updateNotificationSettings = async (data) => {
  const response = await api.put('/dev/updateNotificationSettings', data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put('/auth/changePassword', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/dev/deleteAccount');
  return response.data;
};

export const getDeveloperDashboard = async () => {
  const response = await api.get('/dev/getDeveloperDashboard');
  return response.data;
};
export const requestWithdraw = async (data) => {
  const response = await api.post('/dev/requestwithdraw', data);
  return response.data;
};

//اضافة عمال سابقة
export const addpreviousprojects = async (projectData, onUploadProgress) => {
  try {
    const response = await api.post('/dev/addpreviousprojects', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress, // ✅ عشان تتبع التحميل
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

//جلب الاعمال السابقة
export const getPreviousProjects = async (userId) => {
  try {
    // ✅ التأكد من وجود userId
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    console.log('📤 Fetching projects for user:', userId);
    
    const response = await api.post('/dev/getpreviousprojects', {
      id: userId
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error in getPreviousProjects:', error);
    throw handleApiError(error);
  }
};


//حذف عمل سابق لدي المبرمج
export const deletePreviousProject = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    console.log('📤 Deleting project with ID:', projectId);
    
    // ✅ DELETE request مع إرسال projectId في الـ body
    const response = await api.delete('/dev/deletepreviousprojects', {
      data: { projectId: projectId }  // ✅ إرسال projectId في الـ body
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error in deletePreviousProject:', error);
    throw handleApiError(error);
  }
};

export const getVideoUploadUrl = async (file) => {
  const response = await api.post("/dev/video-upload-url", {
    fileName: file.name,
    contentType: file.type,
  });

  return response.data;
};


export const uploadVideoToR2 = async (
  uploadUrl,
  file,
  onUploadProgress
) => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress,
  });
};

export const getProjectFileUploadUrl = async (file) => {

    const res = await api.post(
        "/dev/project-file-upload-url",
        {
            fileName: file.name,
            contentType: file.type,
        }
    );

    return res.data;

};

export const uploadProjectFileToR2 = async (
    uploadUrl,
    file,
    onUploadProgress
) => {

    await axios.put(uploadUrl, file, {

        headers: {
            "Content-Type": file.type,
        },

        onUploadProgress,

    });

};
