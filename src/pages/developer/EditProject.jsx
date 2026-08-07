// src/pages/developer/EditProject.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { updatestoreProject  } from '../../services/develper.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function EditProject() {
  const location = useLocation();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [step, setStep] = useState(1);
  
  // ✅ استقبال البيانات من الـ state
  const projectData = location.state?.project;
  
  // ✅ التحقق من وجود البيانات - بدون setState
  useEffect(() => {
    if (!projectData) {
      alert('لا توجد بيانات للمشروع');
      navigate('/dashboard/developer/store');
    }
  }, [projectData, navigate]);

  // Form Data - يتم تعبئتها مباشرة من projectData
  const [formData, setFormData] = useState(() => {
    if (projectData) {
      return {
        projectName: projectData.name || '',
        category: projectData.category || '',
        shortDescription: projectData.description || '',
        fullDescription: projectData.fullDescription || '',
        demoUrl: projectData.demoUrl || '',
        githubUrl: projectData.githubUrl || '',
        license: projectData.license || 'Commercial',
        videoUrl: projectData.videoUrl || '',
        supportPeriod: projectData.supportPeriod || '',
        updatesPeriod: projectData.updatesPeriod || '',
        technologies: projectData.tech || [],
        mainFeatures: projectData.mainFeatures || [],
        images: projectData.images || [],
        basic: projectData.basic || { 
          price: '', 
          deliveryTime: 3, 
          features: ['كود المصدر', 'التثبيت', 'شرح بالفيديو'] 
        },
        pro: projectData.pro || { 
          price: '', 
          deliveryTime: 7, 
          features: ['كل ما في Basic', 'تعديل الألوان', 'إضافة ميزة جديدة'] 
        },
        enterprise: projectData.enterprise || { 
          price: '', 
          deliveryTime: 30, 
          features: ['كل ما في Pro', 'بناء مخصص', 'دعم فني كامل'] 
        }
      };
    }
    return {
      projectName: '',
      category: '',
      shortDescription: '',
      fullDescription: '',
      demoUrl: '',
      githubUrl: '',
      license: 'Commercial',
      videoUrl: '',
      supportPeriod: '',
      updatesPeriod: '',
      technologies: [],
      mainFeatures: [],
      images: [],
      basic: {
        price: '',
        deliveryTime: 3,
        features: ['كود المصدر', 'التثبيت', 'شرح بالفيديو']
      },
      pro: {
        price: '',
        deliveryTime: 7,
        features: ['كل ما في Basic', 'تعديل الألوان', 'إضافة ميزة جديدة']
      },
      enterprise: {
        price: '',
        deliveryTime: 30,
        features: ['كل ما في Pro', 'بناء مخصص', 'دعم فني كامل']
      }
    };
  });

  // Temporary states
  const [tempTech, setTempTech] = useState('');
  const [tempFeature, setTempFeature] = useState('');
  const [tempBasicFeature, setTempBasicFeature] = useState('');
  const [tempProFeature, setTempProFeature] = useState('');
  const [tempEnterpriseFeature, setTempEnterpriseFeature] = useState('');

  const categories = [
    { value: 'management', label: 'نظم إدارة', icon: '📊' },
    { value: 'ecommerce', label: 'متاجر إلكترونية', icon: '🛒' },
    { value: 'education', label: 'منصات تعليمية', icon: '📚' },
    { value: 'dashboard', label: 'لوحات تحكم', icon: '📈' },
    { value: 'mobile', label: 'تطبيقات موبايل', icon: '📱' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🤖' }
  ];

  const techOptions = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
    'Laravel', 'PHP', 'Java', 'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
    'MySQL', 'Firebase', 'AWS', 'Docker', 'TailwindCSS', 'TypeScript', 'GraphQL'
  ];

  const licenseOptions = [
    { value: 'Regular', label: 'ترخيص عادي - يمكن بيعه لعميل واحد' },
    { value: 'Extended', label: 'ترخيص ممتد - يمكن بيعه لعدة عملاء' },
    { value: 'Unlimited', label: 'ترخيص غير محدود - بيع غير محدود' }
  ];

  const supportOptions = [
    { value: '1month', label: 'شهر واحد' },
    { value: '3months', label: '3 أشهر' },
    { value: '6months', label: '6 أشهر' },
    { value: '1year', label: 'سنة كاملة' }
  ];

  const updatesOptions = [
    { value: '3months', label: '3 أشهر' },
    { value: '6months', label: '6 أشهر' },
    { value: '1year', label: 'سنة كاملة' },
    { value: 'lifetime', label: 'مدى الحياة' }
  ];

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.projectName.trim()) errors.projectName = 'اسم المشروع مطلوب';
    if (!formData.category) errors.category = 'التصنيف مطلوب';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'الوصف القصير مطلوب';
    if (formData.technologies.length === 0) errors.technologies = 'أضف تقنية واحدة على الأقل';
    if (formData.mainFeatures.length === 0) errors.mainFeatures = 'أضف ميزة واحدة على الأقل';
    if (!formData.basic.price || formData.basic.price <= 0) errors.basicPrice = 'سعر باقة Basic مطلوب';
    if (!formData.pro.price || formData.pro.price <= 0) errors.proPrice = 'سعر باقة Pro مطلوب';
    if (!formData.enterprise.price || formData.enterprise.price <= 0) errors.enterprisePrice = 'سعر باقة Enterprise مطلوب';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Tech Stack Functions
  const addTech = () => {
    if (tempTech.trim() && !formData.technologies.includes(tempTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tempTech.trim()]
      });
      setTempTech('');
      setValidationErrors({ ...validationErrors, technologies: '' });
    }
  };

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  // Features Functions
  const addFeature = () => {
    if (tempFeature.trim() && !formData.mainFeatures.includes(tempFeature.trim())) {
      setFormData({
        ...formData,
        mainFeatures: [...formData.mainFeatures, tempFeature.trim()]
      });
      setTempFeature('');
      setValidationErrors({ ...validationErrors, mainFeatures: '' });
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      mainFeatures: formData.mainFeatures.filter(f => f !== feature)
    });
  };

  // Package Features Functions
  const addPackageFeature = (packageName) => {
    const feature = packageName === 'basic' ? tempBasicFeature : 
                    packageName === 'pro' ? tempProFeature : tempEnterpriseFeature;
    
    if (feature.trim()) {
      const key = packageName === 'basic' ? 'basic' : 
                  packageName === 'pro' ? 'pro' : 'enterprise';
      
      setFormData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          features: [...prev[key].features, feature.trim()]
        }
      }));
      
      if (packageName === 'basic') setTempBasicFeature('');
      else if (packageName === 'pro') setTempProFeature('');
      else setTempEnterpriseFeature('');
    }
  };

  const removePackageFeature = (packageName, index) => {
    const key = packageName === 'basic' ? 'basic' : 
                packageName === 'pro' ? 'pro' : 'enterprise';
    
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        features: prev[key].features.filter((_, i) => i !== index)
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const handlePackageChange = (packageName, field, value) => {
    const key = packageName === 'basic' ? 'basic' : 
                packageName === 'pro' ? 'pro' : 'enterprise';
    
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'price' ? Number(value) : value
      }
    }));
    
    setValidationErrors({ ...validationErrors, [`${packageName}Price`]: '' });
  };

  // ✅ تحديث المشروع - تم التعديل: التحديث يحدث فقط عند الضغط على الزر
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  setSaving(true);
  
  try {
    // ✅ تجهيز البيانات كـ JSON
    const submitData = {
      id: projectData.id,
      projectName: formData.projectName,
      category: formData.category,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription || '',
      demoUrl: formData.demoUrl || '',
      githubUrl: formData.githubUrl || '',
      license: formData.license,
      videoUrl: formData.videoUrl || '',
      supportPeriod: formData.supportPeriod || '',
      updatesPeriod: formData.updatesPeriod || '',
      technologies: formData.technologies,
      mainFeatures: formData.mainFeatures,
      basic: {
        price: formData.basic.price,
        deliveryTime: formData.basic.deliveryTime,
        features: formData.basic.features
      },
      pro: {
        price: formData.pro.price,
        deliveryTime: formData.pro.deliveryTime,
        features: formData.pro.features
      },
      enterprise: {
        price: formData.enterprise.price,
        deliveryTime: formData.enterprise.deliveryTime,
        features: formData.enterprise.features
      }
    };
    
    
    // ✅ استدعاء updatestoreProject مع JSON
     await updatestoreProject(projectData.id, submitData);
    
    await fetchUser();
    
    alert('✅ تم تحديث المشروع بنجاح');
    navigate('/dashboard/developer/store');
    
  } catch (error) {
    console.error('❌ Error updating project:', error);
    console.error('❌ Error response:', error.response?.data);
    alert(error.response?.data?.message || 'حدث خطأ أثناء تحديث المشروع');
  } finally {
    setSaving(false);
  }
};

  const nextStep = () => {
    if (step === 1) {
      if (!formData.projectName.trim()) {
        setValidationErrors({ projectName: 'اسم المشروع مطلوب' });
        return;
      }
      if (!formData.category) {
        setValidationErrors({ category: 'التصنيف مطلوب' });
        return;
      }
      if (!formData.shortDescription.trim()) {
        setValidationErrors({ shortDescription: 'الوصف القصير مطلوب' });
        return;
      }
    }
    
    if (step === 2) {
      if (formData.technologies.length === 0) {
        setValidationErrors({ technologies: 'أضف تقنية واحدة على الأقل' });
        return;
      }
      if (formData.mainFeatures.length === 0) {
        setValidationErrors({ mainFeatures: 'أضف ميزة واحدة على الأقل' });
        return;
      }
    }
    
    if (step === 3) {
      if (!formData.basic.price || formData.basic.price <= 0) {
        setValidationErrors({ basicPrice: 'سعر باقة Basic مطلوب' });
        return;
      }
      if (!formData.pro.price || formData.pro.price <= 0) {
        setValidationErrors({ proPrice: 'سعر باقة Pro مطلوب' });
        return;
      }
      if (!formData.enterprise.price || formData.enterprise.price <= 0) {
        setValidationErrors({ enterprisePrice: 'سعر باقة Enterprise مطلوب' });
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

  const progressSteps = [
    { number: 1, title: 'المعلومات الأساسية', icon: '📝' },
    { number: 2, title: 'المميزات والتقنيات', icon: '⚙️' },
    { number: 3, title: 'الباقات والأسعار', icon: '💰' },
    { number: 4, title: 'الصور', icon: '🖼️' }
  ];

  // ✅ لو مفيش بيانات، ارجع للصفحة السابقة
  if (!projectData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="store" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                تعديل المشروع ✏️
              </h1>
              <p className="text-gray-500 mt-1">قم بتحديث معلومات مشروعك</p>
            </motion.div>

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${((step - 1) / (progressSteps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {progressSteps.map((s) => (
                  <div key={s.number} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                      step >= s.number
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                        : 'bg-gray-300'
                    }`}>
                      {step > s.number ? '✓' : s.icon}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= s.number ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم المشروع <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.projectName ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none`}
                        placeholder="مثال: نظام إدارة المستشفيات الذكي"
                      />
                      {validationErrors.projectName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.projectName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        التصنيف <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat.value });
                              setValidationErrors({ ...validationErrors, category: '' });
                            }}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                              formData.category === cat.value
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <span>{cat.icon}</span>
                            <span className="text-sm">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                      {validationErrors.category && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        وصف قصير <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="shortDescription"
                        rows="3"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.shortDescription ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none resize-none`}
                        placeholder="وصف مختصر للمشروع (يظهر في بطاقة المشروع)"
                      />
                      {validationErrors.shortDescription && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.shortDescription}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        وصف مفصل
                      </label>
                      <textarea
                        name="fullDescription"
                        rows="6"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="وصف مفصل للمشروع يشمل جميع المميزات والتفاصيل التقنية..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رابط العرض التجريبي
                        </label>
                        <input
                          type="url"
                          name="demoUrl"
                          value={formData.demoUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="https://example.com/demo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رابط GitHub (اختياري)
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          الترخيص
                        </label>
                        <select
                          name="license"
                          value={formData.license}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          {licenseOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رابط فيديو توضيحي
                        </label>
                        <input
                          type="url"
                          name="videoUrl"
                          value={formData.videoUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Features & Tech */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Tech Stack */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        التقنيات المستخدمة <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tempTech}
                          onChange={(e) => setTempTech(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTech()}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اكتب التقنية ثم اضغط Enter"
                        />
                        <button
                          type="button"
                          onClick={addTech}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        >
                          إضافة
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.technologies.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {tech}
                            <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-600">✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {techOptions.filter(t => !formData.technologies.includes(t)).slice(0, 15).map(tech => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => {
                              if (!formData.technologies.includes(tech)) {
                                setFormData({ ...formData, technologies: [...formData.technologies, tech] });
                              }
                            }}
                            className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition"
                          >
                            + {tech}
                          </button>
                        ))}
                      </div>
                      {validationErrors.technologies && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.technologies}</p>
                      )}
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المميزات الرئيسية <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tempFeature}
                          onChange={(e) => setTempFeature(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="مثال: لوحة تحكم متقدمة"
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        >
                          إضافة
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData.mainFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-700">✓ {feature}</span>
                            <button type="button" onClick={() => removeFeature(feature)} className="text-red-500 hover:text-red-700">✕</button>
                          </div>
                        ))}
                      </div>
                      {validationErrors.mainFeatures && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.mainFeatures}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مدة الدعم الفني
                        </label>
                        <select
                          name="supportPeriod"
                          value={formData.supportPeriod}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">اختر مدة الدعم</option>
                          {supportOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مدة التحديثات
                        </label>
                        <select
                          name="updatesPeriod"
                          value={formData.updatesPeriod}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">اختر مدة التحديثات</option>
                          {updatesOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Packages & Pricing */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Basic Package */}
                    <div className={`border-2 rounded-2xl p-6 transition-all ${
                      validationErrors.basicPrice ? 'border-red-500' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">📦 Basic</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            السعر ($) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.basic.price}
                            onChange={(e) => handlePackageChange('basic', 'price', e.target.value)}
                            className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${
                              validationErrors.basicPrice ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } focus:outline-none`}
                            placeholder="سعر الباقة"
                          />
                          {validationErrors.basicPrice && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.basicPrice}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            مدة التسليم (أيام)
                          </label>
                          <input
                            type="number"
                            value={formData.basic.deliveryTime}
                            onChange={(e) => handlePackageChange('basic', 'deliveryTime', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مميزات الباقة
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={tempBasicFeature}
                            onChange={(e) => setTempBasicFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('basic')}
                            className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="أضف ميزة جديدة"
                          />
                          <button
                            type="button"
                            onClick={() => addPackageFeature('basic')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                          >
                            إضافة
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.basic.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button
                                type="button"
                                onClick={() => removePackageFeature('basic', idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pro Package */}
                    <div className={`border-2 rounded-2xl p-6 transition-all ${
                      validationErrors.proPrice ? 'border-red-500' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">⭐ Pro</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">موصى به</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            السعر ($) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.pro.price}
                            onChange={(e) => handlePackageChange('pro', 'price', e.target.value)}
                            className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${
                              validationErrors.proPrice ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } focus:outline-none`}
                            placeholder="سعر الباقة"
                          />
                          {validationErrors.proPrice && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.proPrice}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            مدة التسليم (أيام)
                          </label>
                          <input
                            type="number"
                            value={formData.pro.deliveryTime}
                            onChange={(e) => handlePackageChange('pro', 'deliveryTime', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مميزات الباقة
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={tempProFeature}
                            onChange={(e) => setTempProFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('pro')}
                            className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="أضف ميزة جديدة"
                          />
                          <button
                            type="button"
                            onClick={() => addPackageFeature('pro')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                          >
                            إضافة
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.pro.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button
                                type="button"
                                onClick={() => removePackageFeature('pro', idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enterprise Package */}
                    <div className={`border-2 rounded-2xl p-6 transition-all ${
                      validationErrors.enterprisePrice ? 'border-red-500' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">🏢 Enterprise</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            السعر ($) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.enterprise.price}
                            onChange={(e) => handlePackageChange('enterprise', 'price', e.target.value)}
                            className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${
                              validationErrors.enterprisePrice ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            } focus:outline-none`}
                            placeholder="سعر الباقة"
                          />
                          {validationErrors.enterprisePrice && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.enterprisePrice}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            مدة التسليم (أيام)
                          </label>
                          <input
                            type="number"
                            value={formData.enterprise.deliveryTime}
                            onChange={(e) => handlePackageChange('enterprise', 'deliveryTime', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مميزات الباقة
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={tempEnterpriseFeature}
                            onChange={(e) => setTempEnterpriseFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('enterprise')}
                            className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="أضف ميزة جديدة"
                          />
                          <button
                            type="button"
                            onClick={() => addPackageFeature('enterprise')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                          >
                            إضافة
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.enterprise.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button
                                type="button"
                                onClick={() => removePackageFeature('enterprise', idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Images */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        صور المشروع
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img 
                              src={img} 
                              alt={`Project ${idx}`} 
                              className="w-full h-32 object-cover rounded-xl"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">💡 لتغيير الصور، قم بحذف المشروع وإعادة إنشائه</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                {step < 4 ? (
                  <button
                    key="next"
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    key="submit"
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري التحديث...</span>
                      </div>
                    ) : (
                      'تحديث المشروع 💾'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}