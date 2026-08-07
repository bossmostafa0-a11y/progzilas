import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { submitReport } from '../../services/cliecnt.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiUpload, FiX, FiSend, FiAlertCircle, FiCheckCircle, FiImage } from 'react-icons/fi';

export default function ReportProblem() {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // ✅ معالجة رفع الصور
  const handleImageUpload = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`الصورة ${file.name} حجمها يتجاوز 5 ميجابايت`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`الملف ${file.name} ليس صورة`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    const totalImages = images.length + validFiles.length;
    if (totalImages > MAX_IMAGES) {
      setError(`يمكنك رفع ${MAX_IMAGES} صور فقط. لديك حالياً ${images.length} صورة`);
      return;
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setImages([...images, ...newImages]);
    setError('');
  };

  // ✅ حذف صورة
  const removeImage = (id) => {
    const imgToRemove = images.find(img => img.id === id);
    if (imgToRemove) {
      URL.revokeObjectURL(imgToRemove.preview);
    }
    setImages(images.filter(img => img.id !== id));
  };

  // ✅ معالجة السحب والإفلات
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  // ✅ دالة إرسال البلاغ - باستخدام الخدمة
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('الرجاء كتابة وصف للمشكلة');
      return;
    }

    if (description.trim().length < 10) {
      setError('الوصف يجب أن لا يقل عن 10 أحرف');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // إضافة الوصف
      formData.append('fullDescription', description);
      
      // إضافة الصور
      images.forEach((img) => {
        formData.append('images', img.file);
      });

      // ✅ استخدام دالة createReport من الخدمة
       await submitReport(formData);

      setSubmitted(true);
      
      // تنظيف الـ preview URLs
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'حدث خطأ أثناء إرسال البلاغ');
    } finally {
      setLoading(false);
    }
  };

  // ✅ إعادة تعيين النموذج
  const resetForm = () => {
    setDescription('');
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiAlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">الإبلاغ عن مشكلة</h1>
                <p className="text-white/80 text-sm mt-1">
                  ساعدنا في تحسين المنصة عن طريق الإبلاغ عن أي مشكلة تواجهك
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {submitted ? (
              // ✅ صفحة نجاح الإرسال
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">تم إرسال البلاغ بنجاح! ✅</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  شكراً لك على مساعدتنا في تحسين المنصة. سيتم مراجعة البلاغ في أقرب وقت.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  إرسال بلاغ جديد
                </button>
              </motion.div>
            ) : (
              // ✅ نموذج الإبلاغ
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* وصف المشكلة */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    📝 وصف المشكلة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setError('');
                    }}
                    placeholder="اكتب وصفاً تفصيلياً للمشكلة التي تواجهها..."
                    className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition outline-none resize-none"
                    maxLength="1000"
                    required
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>الحد الأدنى 10 أحرف</span>
                    <span>{description.length}/1000</span>
                  </div>
                </div>

                {/* رفع الصور */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🖼️ الصور (اختياري)
                    <span className="text-sm text-gray-400 font-normal mr-2">
                      (حد أقصى {MAX_IMAGES} صور)
                    </span>
                  </label>

                  {/* منطقة السحب والإفلات */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-red-500 bg-red-50/50'
                        : 'border-gray-300 hover:border-red-400 hover:bg-gray-50/50'
                    } ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleImageUpload(e.target.files);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      disabled={images.length >= MAX_IMAGES}
                    />

                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      اسحب الصور هنا أو اضغط للرفع
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      JPG, PNG, GIF - حد أقصى 5 ميجابايت لكل صورة
                    </p>
                    {images.length > 0 && (
                      <p className="text-sm text-indigo-600 mt-2">
                        تم رفع {images.length} من {MAX_IMAGES} صور
                      </p>
                    )}
                  </div>

                  {/* معرض الصور المرفوعة */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                      {images.map((img) => (
                        <motion.div
                          key={img.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative group"
                        >
                          <img
                            src={img.preview}
                            alt="مرفق"
                            className="w-full h-24 sm:h-28 object-cover rounded-xl border-2 border-gray-200 group-hover:border-red-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-[10px] text-center py-0.5 rounded-lg">
                            #{images.indexOf(img) + 1}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* عدد الصور المتبقية */}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center gap-2"
                    >
                      <FiImage className="w-4 h-4" />
                      إضافة صور ({images.length}/{MAX_IMAGES})
                    </button>
                  )}
                </div>

                {/* عرض الأخطاء */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3"
                  >
                    <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="whitespace-pre-line">{error}</div>
                  </motion.div>
                )}

                {/* معلومات المستخدم */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p>👤 سيتم إرسال البلاغ باسم: <span className="font-semibold">{user?.username || 'مستخدم'}</span></p>
                  <p className="mt-1">📧 البريد الإلكتروني: <span className="font-semibold">{user?.email || 'غير متوفر'}</span></p>
                </div>

                {/* أزرار الإرسال */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        إرسال البلاغ
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (images.length > 0 || description) {
                        if (window.confirm('هل أنت متأكد من مسح البيانات؟')) {
                          resetForm();
                        }
                      }
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    مسح البيانات
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* معلومات إضافية */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">📱</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">الرد خلال</p>
                <p className="text-xs text-gray-500">خلال 24 ساعة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">🔒</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">بيانات آمنة</p>
                <p className="text-xs text-gray-500">جميع البيانات مشفرة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">💡</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">نصائح</p>
                <p className="text-xs text-gray-500">اشرح المشكلة بالتفصيل</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}