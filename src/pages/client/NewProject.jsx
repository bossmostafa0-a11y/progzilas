// src/pages/client/NewProject.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createClientProject } from '../../services/cliecnt.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

export default function NewProject() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    skills: [],
    time: '',
    budget: '',
    deadline: ''
  });

  const [tempSkill, setTempSkill] = useState('');

  const categories = [
    { value: 'web', label: 'تطوير ويب', icon: '🌐' },
    { value: 'mobile', label: 'تطبيق موبايل', icon: '📱' },
    { value: 'desktop', label: 'تطبيق كمبيوتر', icon: '💻' }, // ✅ جديد
    { value: 'cross-platform', label: 'كمبيوتر وموبيل معاً', icon: '🔄' }, // ✅ جديد
    { value: 'design', label: 'تصميم واجهات', icon: '🎨' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🧠' },
    { value: 'cloud', label: 'الحوسبة السحابية', icon: '☁️' }
  ];

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, tempSkill.trim()]
      });
      setTempSkill('');
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

  // ✅ التحقق من صحة النموذج
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'اسم المشروع مطلوب';
    if (!formData.type) errors.type = 'التصنيف مطلوب';
    if (!formData.description.trim()) errors.description = 'وصف المشروع مطلوب';
    if (!formData.deadline) errors.deadline = 'آخر ميعاد للتقديم مطلوب';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ إرسال المشروع للباك اند
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    try {
      // ✅ تجهيز البيانات للإرسال
      const submitData = {
        name: formData.name,
        desctption: formData.description,
        type: formData.type,
        skills: formData.skills || [],
        time: formData.time || '',
        budget: formData.budget || '',
        deadline: formData.deadline || ''
      };
      
      console.log('📤 Sending project data:', submitData);
      
      // ✅ استدعاء الدالة من clientService
      const response = await createClientProject(submitData);
      console.log('📥 Project created:', response);
      
      // ✅ تحديث بيانات المستخدم
      await fetchUser();
      
      alert('✅ تم نشر المشروع بنجاح');
      navigate('/dashboard/client/projects');
      
    } catch (error) {
      console.error('❌ Error creating project:', error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء نشر المشروع');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // ✅ تحقق من الخطوة الأولى
    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationErrors({ name: 'اسم المشروع مطلوب' });
        return;
      }
      if (!formData.type) {
        setValidationErrors({ type: 'التصنيف مطلوب' });
        return;
      }
      if (!formData.description.trim()) {
        setValidationErrors({ description: 'وصف المشروع مطلوب' });
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
                          الميزانية ($)
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="أدخل الميزانية المحددة"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المدة المتوقعة (بالأيام)
                        </label>
                        <input
                          type="text"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="مثال: 30 يوم"
                        />
                      </div>
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المهارات المطلوبة
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tempSkill}
                          onChange={(e) => setTempSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اكتب المهارة ثم اضغط Enter"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        >
                          إضافة
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">✕</button>
                          </span>
                        ))}
                      </div>
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

      <Footer />
    </div>
  );
}