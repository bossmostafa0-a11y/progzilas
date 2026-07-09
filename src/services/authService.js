import { api, handleApiError } from './api';

// ============ تسجيل مبرمج جديد ============
export const registerDeveloper = async (userData) => {
  try {
    const response = await api.post('/auth/signupdev', { ...userData });
    return response.data;
  } catch (error) { throw handleApiError(error); }
};

// ============ تسجيل عميل جديد ============
export const registerClient = async (userData) => {
  try {
    const response = await api.post('/auth/signupclient', { ...userData });
    return response.data;
  } catch (error) { throw handleApiError(error); }
};

// ============ تسجيل الدخول ============
export const loginUser = async (email, password) => {
  try {
    console.log('📤 Sending login:', { email, password });
    const response = await api.post('/auth/login', { email, password });
    console.log('📥 Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw handleApiError(error);
  }
};

// ============ جلب بيانات المستخدم ============
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) { throw handleApiError(error); }
};

// ============ تحديث البروفايل العام ============
export const updateUserProfile = async (profileData) => {
  try {
    const isFormData = profileData instanceof FormData;
    
    const config = {};
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    
    // ✅ المسار الصحيح
    const response = await api.put('/dev/updateprofiledev', profileData, config);
    return response.data;
  } catch (error) {
    console.error('❌ Update profile error:', error);
    throw handleApiError(error);
  }
};

// ============ ✅ إكمال البروفايل (تعديل الـ Headers لمنع الـ Error) ============

 export const completeProfile = async (formDataObject) => {
  try {
    // formDataObject هنا لازم يكون كائن FormData حقيقي
    const response = await api.put('/auth/complete-profile', formDataObject, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Complete profile error:', error);
    throw handleApiError(error);
  }
};
// اختيار الصور للعميل
export const completeProfileclient = async (profileData) => {
  try {
    // 🚀 تم تعديل المسار ليتطابق مع الدالة في الباك آند: /auth/compliteprofileclient
    // الـ profileData المرسل يحتوي على { email, profileImage, coverImage }
    const response = await api.put('/client/compliteprofileclient', profileData);
    return response.data;
  } catch (error) {
    console.error('❌ Complete client profile error:', error);
    throw handleApiError(error); 
  }
};

// ============ ✅ جلب الصور التي سيختار منها للعميل ============
export const getClientImages = async () => {
  try {
    // 🚀 تم تعديل المسار ليتوافق مع راوت الباك آند الخاص بك: /auth/getAllImages
    const response = await api.get('/client/getallimages');
    return response.data; // يُعيد الـ JSON مباشرة الذي يحتوي على مصفوفة images
  } catch (error) {
    console.error('❌ Fetch client images error:', error);
    throw handleApiError(error);
  }
};

// ============ تسجيل الخروج ============
export const logoutUser = async () => {
  try { await api.post('/auth/logout'); } catch (error) { console.error('Logout error:', error); }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ============ تفعيل الحساب ============
export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  } catch (error) { throw handleApiError(error); }
};
//تغير كلمة السر
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/changePasswordemail', { email });
  return response.data;
};