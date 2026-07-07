// src/pages/client/CompleteClientProfile.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; 
import { getClientImages } from '../../services/authService'; 
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// صور احتياطية في حال كانت قاعدة البيانات فارغة تماماً
const DEFAULT_FALLBACK_IMAGES = [
  { _id: '1', image: 'https://via.placeholder.com/200/6366f1/ffffff?text=Image+1', name: 'صورة افتراضية 1', type: 'profile' },
  { _id: '2', image: 'https://via.placeholder.com/200/8b5cf6/ffffff?text=Image+2', name: 'صورة افتراضية 2', type: 'profile' },
  { _id: '3', image: 'https://via.placeholder.com/200/06b6d4/ffffff?text=Image+3', name: 'صورة افتراضية 3', type: 'cover' },
  { _id: '4', image: 'https://via.placeholder.com/1200x400/6366f1/ffffff?text=Cover+1', name: 'غلاف افتراضي 1', type: 'cover' }
];

export default function CompleteClientProfile() {
  const { user, compliteprofileclient, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ استخراج الإيميل من الـ URL
  const searchParams = new URLSearchParams(location.search);
  const emailFromUrl = searchParams.get('email');
  
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // الـ State الخاص بالصور القادمة من الباك آند
  const [availableImages, setAvailableImages] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  const [loadingImages, setLoadingImages] = useState(true); 
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerType, setImagePickerType] = useState('logo'); // 'logo' أو 'cover'
  
  const hasInitialized = useRef(false);
  
  // ✅ Lazy State Initialization متوافق مع مسميات الباك آند
  const [formData, setFormData] = useState(() => ({
    profileImage: user?.profileImage || '',
    coverImage: user?.coverImage || ''
  }));

  // ✅ مزامنة formData مع user عند تحديثه (مرة واحدة فقط)
  useEffect(() => {
    if (user && !hasInitialized.current) {
      hasInitialized.current = true;
      setFormData(prev => ({
        ...prev,
        profileImage: user.profileImage || prev.profileImage || '',
        coverImage: user.coverImage || prev.coverImage || ''
      }));
    }
  }, [user]);

  // التحكم في السكرول عند فتح المودال
  useEffect(() => {
    document.body.style.overflow = showImagePicker ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [showImagePicker]);

  // ✅ جلب الصور بما يتوافق مع هيكلة الـ JSON الخاص بك (data.images)
  const fetchAvailableImages = useCallback(async (isMounted) => {
    try {
      const response = await getClientImages(); 
      
      if (isMounted) {
        // قراءة المصفوفة من data.images بناءً على الـ Response الخاص بك
        const imagesArray = response?.data?.images || response?.images || [];
        
        if (imagesArray.length > 0) {
          setAvailableImages(imagesArray);
        } else {
          setAvailableImages(DEFAULT_FALLBACK_IMAGES);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching images:', error);
      if (isMounted) {
        setAvailableImages(DEFAULT_FALLBACK_IMAGES);
      }
    } finally {
      if (isMounted) {
        setLoadingImages(false);
      }
    }
  }, []);

  // الـ Effect الآمن لمنع الـ Sync Render Error
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      fetchAvailableImages(isMounted);
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [fetchAvailableImages]);

  const openImagePicker = (type) => {
    setImagePickerType(type);
    setShowImagePicker(true);
  };

  // ✅ دالة فلترة الصور حسب النوع
  const getFilteredImages = () => {
    const type = imagePickerType === 'logo' ? 'profile' : 'cover';
    return availableImages.filter(img => img.type === type);
  };

  // ✅ تعديل قراءة الرابط ليكون من التابع (img.image) مع التحقق من النوع
  const selectImage = (img) => {
    const imageUrl = img.image;
    if (imagePickerType === 'logo') {
      setLogoPreview(imageUrl);
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
    } else {
      setCoverPreview(imageUrl);
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    }
    setShowImagePicker(false);
  };

  // ✅ دالة الإرسال مع استخدام الإيميل من الـ URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ✅ استخدم الإيميل من الـ URL أولاً، ثم من user، ثم من localStorage
      const userEmail = emailFromUrl || user?.email || localStorage.getItem('userEmail') || '';
      
      console.log('📧 Email from URL:', emailFromUrl);
      console.log('📧 Final email used:', userEmail);
      
      if (!userEmail) {
        console.error('❌ No email found');
        alert('حدث خطأ: لا يوجد بريد إلكتروني للمستخدم');
        setLoading(false);
        return;
      }

      console.log('📤 Sending data:', {
        email: userEmail,
        profileImage: formData.profileImage,
        coverImage: formData.coverImage
      });

      // ✅ إرسال البيانات مع الإيميل
      await compliteprofileclient({
        email: userEmail,
        profileImage: formData.profileImage,
        coverImage: formData.coverImage
      });
      
      setSaveSuccess(true);
      await fetchUser(); // تحديث بيانات الحساب الجلوبال
      
      setTimeout(() => {
        navigate('/dashboard/client');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const isFormChanged = formData.profileImage !== (user?.profileImage || '') || formData.coverImage !== (user?.coverImage || '');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50/30" dir="rtl">
      <Navbar />

      <main className="flex-grow relative py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              إكمال بيانات الحساب 🖼️
            </h1>
            <p className="text-gray-600">اختر شعار وغلاف لشركتك من معرض الصور المتاحة</p>
            {emailFromUrl && (
              <p className="text-sm text-indigo-600 mt-2">📧 البريد الإلكتروني: {emailFromUrl}</p>
            )}
          </motion.div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center font-medium">
                ✅ تم تحديث البيانات بنجاح! جاري التوجيه...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="space-y-8">
              
              {/* الشعار */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">🏢 شعار الشركة</label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : formData.profileImage ? (
                      <img src={formData.profileImage} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">🏢</span>
                    )}
                  </div>
                  <button type="button" onClick={() => openImagePicker('logo')} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition shadow-lg w-40 font-medium">
                    📂 اختر شعاراً
                  </button>
                </div>
              </div>

              {/* الغلاف */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">🖼️ صورة الغلاف</label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 border-4 border-white shadow-lg">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">لم يتم تحديد غلاف بعد</div>
                    )}
                  </div>
                  <button type="button" onClick={() => openImagePicker('cover')} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 transition shadow-lg font-medium">
                    📂 اختر غلافاً
                  </button>
                </div>
              </div>

              {/* زر الحفظ */}
              <button type="submit" disabled={loading || !isFormChanged} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'جاري الحفظ...' : 'حفظ البيانات والصور 🚀'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* المودال الموحد لعرض الصور المتاحة مع فلترة حسب النوع */}
      <AnimatePresence>
        {showImagePicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowImagePicker(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {imagePickerType === 'logo' ? '🏢 اختر شعاراً من المعرض' : '🖼️ اختر غلافاً من المعرض'}
                </h3>
                <button onClick={() => setShowImagePicker(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              
              {loadingImages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {getFilteredImages().length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getFilteredImages().map((img) => (
                        <motion.button
                          key={img._id || img.id}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => selectImage(img)}
                          className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-all"
                        >
                          <img src={img.image} alt={img.name || 'صورة'} className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">اختيار</span>
                          </div>
                          {/* ✅ عرض نوع الصورة */}
                          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                            {img.type === 'profile' ? 'شعار' : 'غلاف'}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-3">📭</p>
                      <p>لا توجد صور من نوع {imagePickerType === 'logo' ? 'شعار (Profile)' : 'غلاف (Cover)'} متاحة</p>
                      <p className="text-sm mt-2">يرجى إضافة صور في لوحة التحكم</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}