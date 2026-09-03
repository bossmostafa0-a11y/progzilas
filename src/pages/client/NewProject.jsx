// src/pages/client/NewProject.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createClientProject } from '../../services/cliecnt.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function NewProject() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  
  // ✅ حالة النافذة المنبثقة (Toast)
  const [toast, setToast] = useState({
    show: false,
    type: '', // 'success' or 'error'
    message: '',
    title: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    skills: [],
    time: '',
    budget: '',
    currency: 'USD',
    deadline: ''
  });

  const [tempSkill, setTempSkill] = useState('');

  const categories = [
    { value: 'web', label: 'تطوير ويب', icon: '🌐' },
    { value: 'mobile', label: 'تطبيق موبايل', icon: '📱' },
    { value: 'desktop', label: 'تطبيق كمبيوتر', icon: '💻' },
    { value: 'cross-platform', label: 'كمبيوتر وموبيل معاً', icon: '🔄' },
    { value: 'design', label: 'تصميم واجهات', icon: '🎨' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🧠' },
    { value: 'cloud', label: 'الحوسبة السحابية', icon: '☁️' }
  ];

  // ✅ العملات المتاحة - دولار أمريكي أو جنيه مصري فقط
  const currencies = [
    { value: 'USD', label: '🇺🇸 دولار أمريكي ($)' },
    { value: 'EGP', label: '🇪🇬 جنيه مصري (E£)' },
  ];

  // ✅ اقتراحات المهارات
  const skillSuggestions = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
    'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
    'C#', '.NET', 'PHP', 'Laravel', 'Ruby on Rails', 'Go', 'Rust',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQL Server', 'Firebase', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux',
    'Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow',
    'GraphQL', 'REST API', 'WebSocket', 'Socket.io',
    'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Agile', 'Scrum'
  ];

  // ✅ عرض الـ Toast
  const showToast = (type, message, title = '') => {
    setToast({
      show: true,
      type,
      message,
      title: title || (type === 'success' ? '✅ نجاح' : '❌ خطأ')
    });

    // ✅ اختفاء بعد 5 ثواني
    setTimeout(() => {
      setToast({
        show: false,
        type: '',
        message: '',
        title: ''
      });
    }, 5000);
  };

  // ✅ إخفاء الـ Toast يدوياً
  const hideToast = () => {
    setToast({
      show: false,
      type: '',
      message: '',
      title: ''
    });
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, tempSkill.trim()]
      });
      setTempSkill('');
      setValidationErrors({ ...validationErrors, skills: '' });
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  // ✅ التحقق من صحة النموذج - كل الحقول مطلوبة
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'اسم المشروع مطلوب';
    if (!formData.type) errors.type = 'التصنيف مطلوب';
    if (!formData.description.trim()) errors.description = 'وصف المشروع مطلوب';
    if (!formData.budget || parseFloat(formData.budget) <= 0) errors.budget = 'الميزانية مطلوبة وقيمة صحيحة';
    if (!formData.time.trim()) errors.time = 'المدة المتوقعة مطلوبة';
    if (!formData.currency) errors.currency = 'العملة مطلوبة';
    if (!formData.deadline) errors.deadline = 'آخر ميعاد للتقديم مطلوب';
    if (formData.skills.length === 0) errors.skills = 'المهارات المطلوبة مطلوبة (اختر مهارة واحدة على الأقل)';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ إرسال المشروع للباك اند
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // ✅ عرض خطأ التحقق
      showToast('error', 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح', '⚠️ تحقق من البيانات');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        name: formData.name,
        desctption: formData.description,
        type: formData.type,
        skills: formData.skills || [],
        time: formData.time || '',
        budget: formData.budget || '',
        currency: formData.currency || 'USD',
        deadline: formData.deadline || ''
      };
      
      await createClientProject(submitData);
      await fetchUser();
      
      // ✅ عرض رسالة نجاح
      showToast('success', 'تم نشر المشروع بنجاح! سيتم مراجعته قريباً', '🎉 مبروك!');
      
      // ✅ الانتقال بعد 2 ثانية
      setTimeout(() => {
        navigate('/dashboard/client/projects');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error creating project:', error);
      // ✅ عرض رسالة خطأ
      showToast('error', error.response?.data?.message || 'حدث خطأ أثناء نشر المشروع', '❌ فشل النشر');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // ✅ تحقق من الخطوة الأولى - كل الحقول مطلوبة
    if (step === 1) {
      const errors = {};
      if (!formData.name.trim()) errors.name = 'اسم المشروع مطلوب';
      if (!formData.type) errors.type = 'التصنيف مطلوب';
      if (!formData.description.trim()) errors.description = 'وصف المشروع مطلوب';
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        // ✅ عرض خطأ التحقق
        showToast('error', 'يرجى تعبئة جميع الحقول في هذه الخطوة', '⚠️ بيانات ناقصة');
        return;
      }
    }
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <ClientSidebar activePage="new-project" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                مشروع جديد ➕
              </h1>
              <p className="text-gray-500 mt-1">انشر مشروعك الجديد واحصل على عروض من أفضل المبرمجين</p>
              <p className="text-xs text-red-500 mt-1">* جميع الحقول مطلوبة</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم المشروع <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.name ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none`}
                        placeholder="مثال: نظام إدارة متكامل"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        التصنيف <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map(cat => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, type: cat.value });
                              setValidationErrors({ ...validationErrors, type: '' });
                            }}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              formData.type === cat.value
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{cat.icon}</div>
                            <div className="text-xs">{cat.label}</div>
                          </button>
                        ))}
                      </div>
                      {validationErrors.type && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        وصف المشروع <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.description ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none resize-none`}
                        placeholder="وصف تفصيلي للمشروع، المتطلبات، والأهداف..."
                      />
                      {validationErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          الميزانية <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.budget ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          placeholder="أدخل الميزانية المحددة"
                          min="0"
                          step="100"
                        />
                        {validationErrors.budget && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.budget}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          العملة <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.currency ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none bg-white`}
                        >
                          {currencies.map(curr => (
                            <option key={curr.value} value={curr.value}>{curr.label}</option>
                          ))}
                        </select>
                        {validationErrors.currency && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.currency}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المدة المتوقعة (بالأيام) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.time ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          placeholder="مثال: 30 يوم"
                        />
                        {validationErrors.time && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          آخر ميعاد للتقديم <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.deadline ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {validationErrors.deadline && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.deadline}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">📅 اختر آخر تاريخ لتلقي العروض</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المهارات المطلوبة <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tempSkill}
                          onChange={(e) => setTempSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                            validationErrors.skills ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          placeholder="اكتب المهارة ثم اضغط Enter أو اختر من الاقتراحات"
                          list="skill-suggestions"
                        />
                        <datalist id="skill-suggestions">
                          {skillSuggestions.map((skill, index) => (
                            <option key={index} value={skill} />
                          ))}
                        </datalist>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        >
                          إضافة
                        </button>
                      </div>
                      
                      {/* ✅ اقتراحات المهارات */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">💡 اقتراحات المهارات الشائعة:</p>
                        <div className="flex flex-wrap gap-2">
                          {skillSuggestions.slice(0, 12).map((skill, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (!formData.skills.includes(skill)) {
                                  setFormData({
                                    ...formData,
                                    skills: [...formData.skills, skill]
                                  });
                                  setValidationErrors({ ...validationErrors, skills: '' });
                                }
                              }}
                              className="px-2 py-1 text-xs bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-700 rounded-full transition-colors border border-gray-200 hover:border-indigo-300"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">✕</button>
                          </span>
                        ))}
                      </div>
                      {validationErrors.skills && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.skills}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                      السابق
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      key="next"
                      onClick={nextStep}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto"
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      type="submit"
                      key="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري النشر...
                        </div>
                      ) : (
                        'نشر المشروع 🚀'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast Notification - كارد جانبي جميل */}
      {toast.show && (
        <div className="fixed top-24 left-4 z-50 w-full max-w-sm animate-slide-in-left">
          <div 
            className={`rounded-2xl shadow-2xl p-5 border-r-4 ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* أيقونة */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {toast.type === 'success' ? (
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              
              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${
                  toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {toast.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  toast.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {toast.message}
                </p>
              </div>
              
              {/* زر الإغلاق */}
              <button
                onClick={hideToast}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200/50 flex items-center justify-center transition"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* شريط التقدم (يختفي بعد 5 ثواني) */}
            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-5000 ${
                  toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: '100%',
                  animation: 'shrink 5s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ إضافة الـ keyframes في نهاية الصفحة */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
      `}</style>

      <Footer />
    </div>
  );
}