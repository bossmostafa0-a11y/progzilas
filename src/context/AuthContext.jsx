/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import  { createContext, useState, useContext, useEffect , useCallback  } from 'react';
import * as authService from '../services/authService';
import { 
  loginUser, 
  registerDeveloper,
  registerClient,
  fetchUserProfile,
  updateUserProfile,
  completeProfile,
  logoutUser,
  verifyEmail,
  completeProfileclient,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fetchUser = async () => {
  try {
    const response = await fetchUserProfile();
    console.log('📥 Full response:', response); // للتأكد
    
    // ✅ المسار الصحيح للبيانات
    const userData = response?.data?.user ||  // ← ده المسار الصحيح
                    response?.user || 
                    response?.data || 
                    response;
    
    console.log('✅ Extracted user data:', userData);
    
    if (userData && userData._id) {
      // ✅ تأكد من وجود userType
      const userWithType = {
        ...userData,
        userType: userData.userType || 'developer',
        id: userData._id || userData.id
      };
      
      setUser(userWithType);
      setUserType(userWithType.userType);
      localStorage.setItem('user', JSON.stringify(userWithType));
      console.log('✅ User set successfully:', userWithType);
    } else {
      throw new Error('No valid user data found');
    }
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserType(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUserType(userData.userType);
        fetchUser();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
  try {
    const response = await loginUser(email, password);
    console.log('📥 Login response:', response);
    
    // ✅ استخراج التوكن من data
    const token = response.data?.token || response.token || '';
    
    // ✅ بما أن مفيش user في الـ Response، نعمل Mock User
    // لكن الأفضل نجيب بيانات المستخدم من /auth/me
    const user = {
      id: 'temp-' + Date.now(),
      email: email,
      name: email.split('@')[0] || 'مستخدم',
      userType: email.includes('client') ? 'client' : 'developer'
    };
    
    console.log('✅ User created:', user);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setUserType(user.userType);
    
    // ✅ بعد تسجيل الدخول، نجيب بيانات المستخدم الحقيقية
    try {
      await fetchUser();
    } catch (error) {
      console.warn('Could not fetch user profile:', error);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

  const registerDeveloperUser = async (userData) => {
    try {
      const response = await registerDeveloper(userData);
      return response;
    } catch (error) {
      console.error('Register developer error:', error);
      throw error;
    }
  };

  const registerClientUser = async (userData) => {
    try {
      const response = await registerClient(userData);
      return response;
    } catch (error) {
      console.error('Register client error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await updateUserProfile(profileData);
      const userData = response.user;
      setUser(userData);
      setUserType(userData.userType);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // ✅ إكمال البروفايل
  const completeProfileAction = async (formData) => {
    try {
      console.log('🔄 Completing profile with FormData...');
      const response = await completeProfile(formData);
      console.log('✅ Complete profile response:', response);
      
      if (response.user) {
        const userData = response.user;
        setUser(userData);
        setUserType(userData.userType);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response;
    } catch (error) {
      console.error('❌ Complete profile error:', error);
      throw error;
    }
  };

  // للعميل
const uplodimageclient = async (profileData) => {
    try {
      const response = await completeProfileclient(profileData);
      
      // دمج البيانات القديمة والجديدة لضمان عدم اختفاء أي بيانات أخرى للمستخدم
      setUser((prevUser) => {
        const updated = {
          ...prevUser,
          profileImage: profileData.profileImage,
          coverImage: profileData.coverImage
        };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      
      return response;
    } catch (error) {
      console.error('❌ Context updateProfile error:', error);
      throw error;
    }
  };
const fetchMe = useCallback(async () => {
  try {
    setLoading(true);
    const response = await authService.fetchUserProfile();
    console.log('📥 FetchMe response:', response);
    
    const userData = response?.data?.user || response?.user || response?.data;
    
    if (userData) {
      const userWithType = {
        ...userData,
        userType: userData.userType || userData.role || 'developer',
        id: userData._id || userData.id
      };
      
      setUser(userWithType);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithType));
      console.log('✅ User data updated:', userWithType);
      return userWithType;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error in fetchMe:', error);
    return null;
  } finally {
    setLoading(false);
  }
}, []);
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const verifyAccount = async (email, code) => {
    try {
      const response = await verifyEmail(email, code);
      console.log('✅ Verify response:', response);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'حدث خطأ أثناء التفعيل');
      }
    } catch (error) {
      console.error('❌ Verify account error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    registerDeveloperUser,
    registerClientUser,
    logout,
    updateProfile,
    completeProfileAction,
    verifyAccount,
    compliteprofileclient: uplodimageclient,
    fetchUser,
    fetchMe,
    
    isDeveloper: userType === 'developer',
    isClient: userType === 'client',
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};