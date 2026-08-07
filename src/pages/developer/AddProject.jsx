import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  createProject,
  getVideoUploadUrl,
  uploadVideoToR2,
  getProjectFileUploadUrl,
  uploadProjectFileToR2,
} from "../../services/develper.service.js";

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';
import { useNotificationSound } from '../../hooks/useNotificationSound';

export default function AddProject() {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const { playSound } = useNotificationSound();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [upgradeMessage, setUpgradeMessage] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    demoUrl: '',
    githubUrl: '',
    license: 'Commercial',
    videoFile: null,
    downloadFile: null,
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

  // ✅ Validate form - كل الحقول مطلوبة
  const validateForm = () => {
    const errors = {};
    
    if (!formData.projectName.trim()) errors.projectName = 'اسم المشروع مطلوب';
    if (!formData.category) errors.category = 'التصنيف مطلوب';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'الوصف القصير مطلوب';
    if (!formData.fullDescription.trim()) errors.fullDescription = 'الوصف المفصل مطلوب';
    if (!formData.demoUrl.trim()) errors.demoUrl = 'رابط العرض التجريبي مطلوب';
    if (!formData.githubUrl.trim()) errors.githubUrl = 'رابط GitHub مطلوب';
    if (!formData.videoFile) errors.videoFile = 'الفيديو التوضيحي مطلوب';
    if (formData.technologies.length === 0) errors.technologies = 'أضف تقنية واحدة على الأقل';
    if (formData.mainFeatures.length === 0) errors.mainFeatures = 'أضف ميزة واحدة على الأقل';
    if (!formData.supportPeriod) errors.supportPeriod = 'مدة الدعم الفني مطلوبة';
    if (!formData.updatesPeriod) errors.updatesPeriod = 'مدة التحديثات مطلوبة';
    if (!formData.basic.price || formData.basic.price <= 0) errors.basicPrice = 'سعر باقة Basic مطلوب';
    if (!formData.pro.price || formData.pro.price <= 0) errors.proPrice = 'سعر باقة Pro مطلوب';
    if (!formData.enterprise.price || formData.enterprise.price <= 0) errors.enterprisePrice = 'سعر باقة Enterprise مطلوب';
    if (formData.images.length === 0) errors.images = 'أضف صورة واحدة على الأقل';
    if (!formData.downloadFile) errors.downloadFile = 'ملف المشروع مطلوب';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setValidationErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 250 * 1024 * 1024) {
        setValidationErrors({ ...validationErrors, videoFile: 'حجم الفيديو يجب ألا يزيد عن 250 ميجابايت' });
        return;
      }
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors({ ...validationErrors, videoFile: 'صيغة الفيديو غير مدعومة' });
        return;
      }
      setFormData(prev => ({ ...prev, videoFile: file }));
      setValidationErrors(prev => ({ ...prev, videoFile: '' }));
    }
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, videoFile: null }));
  };

  // Handle download file upload
  const handleDownloadUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setValidationErrors({ ...validationErrors, downloadFile: 'حجم الملف يجب ألا يزيد عن 500 ميجابايت' });
        return;
      }
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['zip', 'rar', '7z'].includes(ext)) {
        setValidationErrors({ ...validationErrors, downloadFile: 'صيغة الملف غير مدعومة. الصيغ المدعومة: ZIP, RAR, 7Z' });
        return;
      }
      setFormData(prev => ({ ...prev, downloadFile: file }));
      setValidationErrors(prev => ({ ...prev, downloadFile: '' }));
    }
  };

  const removeDownload = () => {
    setFormData(prev => ({ ...prev, downloadFile: null }));
  };

  // Tech Stack Functions
  const addTech = () => {
    if (tempTech.trim() && !formData.technologies.includes(tempTech.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, tempTech.trim()] });
      setTempTech('');
      setValidationErrors(prev => ({ ...prev, technologies: '' }));
    }
  };

  const removeTech = (tech) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) });
  };

  // Features Functions
  const addFeature = () => {
    if (tempFeature.trim() && !formData.mainFeatures.includes(tempFeature.trim())) {
      setFormData({ ...formData, mainFeatures: [...formData.mainFeatures, tempFeature.trim()] });
      setTempFeature('');
      setValidationErrors(prev => ({ ...prev, mainFeatures: '' }));
    }
  };

  const removeFeature = (feature) => {
    setFormData({ ...formData, mainFeatures: formData.mainFeatures.filter(f => f !== feature) });
  };

  // Package Features Functions
  const addPackageFeature = (packageName) => {
    const feature = packageName === 'basic' ? tempBasicFeature : packageName === 'pro' ? tempProFeature : tempEnterpriseFeature;
    if (feature.trim()) {
      const key = packageName === 'basic' ? 'basic' : packageName === 'pro' ? 'pro' : 'enterprise';
      setFormData(prev => ({ ...prev, [key]: { ...prev[key], features: [...prev[key].features, feature.trim()] } }));
      if (packageName === 'basic') setTempBasicFeature('');
      else if (packageName === 'pro') setTempProFeature('');
      else setTempEnterpriseFeature('');
    }
  };

  const removePackageFeature = (packageName, index) => {
    const key = packageName === 'basic' ? 'basic' : packageName === 'pro' ? 'pro' : 'enterprise';
    setFormData(prev => ({ ...prev, [key]: { ...prev[key], features: prev[key].features.filter((_, i) => i !== index) } }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePackageChange = (packageName, field, value) => {
    const key = packageName === 'basic' ? 'basic' : packageName === 'pro' ? 'pro' : 'enterprise';
    setFormData(prev => ({ ...prev, [key]: { ...prev[key], [field]: field === 'price' ? Number(value) : value } }));
    setValidationErrors(prev => ({ ...prev, [`${packageName}Price`]: '' }));
  };

  // Submit form
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setLoading(true);
  setUploadProgress(0);
  setUpgradeMessage(null);

  try {
    let videoUrl = "";
    let downloadurl = "";

    // ====================================
    // رفع الفيديو إلى Cloudflare R2
    // ====================================
    if (formData.videoFile) {
      console.log("📤 Getting Video Upload URL...");

      const videoData = await getVideoUploadUrl(formData.videoFile);

      console.log("☁ Uploading Video To R2...");

      await uploadVideoToR2(
        videoData.uploadUrl,
        formData.videoFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percentCompleted);

          console.log(`🎥 Video Upload ${percentCompleted}%`);
        }
      );

      videoUrl = videoData.videoUrl;

      console.log("✅ Video Uploaded");
    }

    // ====================================
    // رفع ملف المشروع إلى Cloudflare R2
    // ====================================
    if (formData.downloadFile) {
      console.log("📤 Getting Project File Upload URL...");

      const fileData = await getProjectFileUploadUrl(formData.downloadFile);

      console.log("☁ Uploading Project File To R2...");

      await uploadProjectFileToR2(
        fileData.uploadUrl,
        formData.downloadFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percentCompleted);

          console.log(`📦 File Upload ${percentCompleted}%`);
        }
      );

      downloadurl = fileData.fileUrl;

      console.log("✅ Project File Uploaded");
    }

    // ====================================
    // إنشاء البيانات المرسلة للباك
    // ====================================
    const submitData = new FormData();

    submitData.append("projectName", formData.projectName);
    submitData.append("category", formData.category);
    submitData.append("shortDescription", formData.shortDescription);
    submitData.append(
      "fullDescription",
      formData.fullDescription || ""
    );
    submitData.append("demoUrl", formData.demoUrl || "");
    submitData.append("githubUrl", formData.githubUrl || "");
    submitData.append("license", formData.license);

    submitData.append(
      "supportPeriod",
      formData.supportPeriod || ""
    );

    submitData.append(
      "updatesPeriod",
      formData.updatesPeriod || ""
    );

    submitData.append(
      "technologies",
      JSON.stringify(formData.technologies)
    );

    submitData.append(
      "mainFeatures",
      JSON.stringify(formData.mainFeatures)
    );

    submitData.append(
      "basic",
      JSON.stringify({
        price: formData.basic.price,
        deliveryTime: formData.basic.deliveryTime,
        features: formData.basic.features,
      })
    );

    submitData.append(
      "pro",
      JSON.stringify({
        price: formData.pro.price,
        deliveryTime: formData.pro.deliveryTime,
        features: formData.pro.features,
      })
    );

    submitData.append(
      "enterprise",
      JSON.stringify({
        price: formData.enterprise.price,
        deliveryTime: formData.enterprise.deliveryTime,
        features: formData.enterprise.features,
      })
    );

    // ====================================
    // الصور فقط تمر على الباك
    // ====================================
    formData.images.forEach((image) => {
      submitData.append("images", image);
    });

    // ====================================
    // روابط الفيديو والملف بعد رفعهم إلى R2
    // ====================================
    submitData.append("videoUrl", videoUrl);
    submitData.append("downloadurl", downloadurl);

    console.log("📤 Creating Project...");

    const response = await createProject(submitData);

    console.log("✅ Project Created:", response);

    setUploadProgress(100);

    playSound();

    await fetchUser();

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/developer/store");
    }, 500);

  } catch (error) {
    console.error("❌ Error creating project:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "حدث خطأ أثناء نشر المشروع";

    if (
      errorMessage.includes("ترقية الخطة") ||
      errorMessage.includes("الخطة المجانية") ||
      errorMessage.includes("الحد الأقصى") ||
      errorMessage.includes("upgrade") ||
      errorMessage.includes("plan") ||
      errorMessage.includes("الحد الاقصي")
    ) {
      setUpgradeMessage({
        title: "🚀 تحتاج إلى ترقية خطتك!",
        message:
          "أنت على الخطة المجانية والحد الأقصى للمشاريع هو 3 مشاريع. الرجاء ترقية الخطة لنشر المزيد.",
        action: "ترقية الخطة الآن",
      });
    } else {
      alert(errorMessage);
    }

    setLoading(false);
    setUploadProgress(0);
  }
};

  // ✅ nextStep مع Validation كامل لكل خطوة
  const nextStep = () => {
    const stepErrors = {};
    
    if (step === 1) {
      if (!formData.projectName.trim()) stepErrors.projectName = 'اسم المشروع مطلوب';
      if (!formData.category) stepErrors.category = 'التصنيف مطلوب';
      if (!formData.shortDescription.trim()) stepErrors.shortDescription = 'الوصف القصير مطلوب';
      if (!formData.fullDescription.trim()) stepErrors.fullDescription = 'الوصف المفصل مطلوب';
      if (!formData.demoUrl.trim()) stepErrors.demoUrl = 'رابط العرض التجريبي مطلوب';
      if (!formData.githubUrl.trim()) stepErrors.githubUrl = 'رابط GitHub مطلوب';
      if (!formData.videoFile) stepErrors.videoFile = 'الفيديو التوضيحي مطلوب';
    }
    
    if (step === 2) {
      if (formData.technologies.length === 0) stepErrors.technologies = 'أضف تقنية واحدة على الأقل';
      if (formData.mainFeatures.length === 0) stepErrors.mainFeatures = 'أضف ميزة واحدة على الأقل';
      if (!formData.supportPeriod) stepErrors.supportPeriod = 'مدة الدعم الفني مطلوبة';
      if (!formData.updatesPeriod) stepErrors.updatesPeriod = 'مدة التحديثات مطلوبة';
    }
    
    if (step === 3) {
      if (!formData.basic.price || formData.basic.price <= 0) stepErrors.basicPrice = 'سعر باقة Basic مطلوب';
      if (!formData.pro.price || formData.pro.price <= 0) stepErrors.proPrice = 'سعر باقة Pro مطلوب';
      if (!formData.enterprise.price || formData.enterprise.price <= 0) stepErrors.enterprisePrice = 'سعر باقة Enterprise مطلوب';
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      return;
    }
    
    setValidationErrors({});
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
    { number: 4, title: 'الصور والنشر', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="add-project" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                إضافة مشروع جديد 🚀
              </h1>
              <p className="text-gray-500 mt-1">أضف مشروعك للمتجر وابدأ في بيعه لعدة عملاء</p>
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
                              setValidationErrors(prev => ({ ...prev, category: '' }));
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
                        وصف مفصل <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="fullDescription"
                        rows="6"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.fullDescription ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none resize-none`}
                        placeholder="وصف مفصل للمشروع يشمل جميع المميزات والتفاصيل التقنية..."
                      />
                      {validationErrors.fullDescription && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.fullDescription}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رابط العرض التجريبي <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="demoUrl"
                          value={formData.demoUrl}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.demoUrl ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          placeholder="https://example.com/demo"
                        />
                        {validationErrors.demoUrl && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.demoUrl}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          رابط GitHub <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.githubUrl ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                          placeholder="https://github.com/username/project"
                        />
                        {validationErrors.githubUrl && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.githubUrl}</p>
                        )}
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
                          فيديو توضيحي <span className="text-red-500">*</span>
                        </label>
                        {formData.videoFile ? (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🎬</span>
                              <div>
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                  {formData.videoFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} ميجابايت
                                </p>
                              </div>
                            </div>
                            <button type="button" onClick={removeVideo} className="text-red-500 hover:text-red-700">✕</button>
                          </div>
                        ) : (
                          <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                            validationErrors.videoFile ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'
                          }`}>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              onChange={handleVideoUpload}
                              className="hidden"
                              id="videoUpload"
                            />
                            <label htmlFor="videoUpload" className="cursor-pointer">
                              <div className="text-2xl mb-1">🎥</div>
                              <p className="text-sm text-gray-500">اضغط لرفع فيديو</p>
                              <p className="text-xs text-gray-400 mt-1">MP4, WebM, OGG, MOV - أقصى حجم 250 ميجا</p>
                            </label>
                          </div>
                        )}
                        {validationErrors.videoFile && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.videoFile}</p>
                        )}
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
                        <button type="button" onClick={addTech} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">إضافة</button>
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
                        <button type="button" onClick={addFeature} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">إضافة</button>
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
                          مدة الدعم الفني <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="supportPeriod"
                          value={formData.supportPeriod}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.supportPeriod ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                        >
                          <option value="">اختر مدة الدعم</option>
                          {supportOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {validationErrors.supportPeriod && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.supportPeriod}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مدة التحديثات <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="updatesPeriod"
                          value={formData.updatesPeriod}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                            validationErrors.updatesPeriod ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          } focus:outline-none`}
                        >
                          <option value="">اختر مدة التحديثات</option>
                          {updatesOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {validationErrors.updatesPeriod && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.updatesPeriod}</p>
                        )}
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
                    <div className={`border-2 rounded-2xl p-6 transition-all ${validationErrors.basicPrice ? 'border-red-500' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">📦 Basic</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">السعر ($) <span className="text-red-500">*</span></label>
                          <input type="number" value={formData.basic.price} onChange={(e) => handlePackageChange('basic', 'price', e.target.value)} className={`w-full px-4 py-2 rounded-xl border-2 ${validationErrors.basicPrice ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:outline-none`} placeholder="سعر الباقة" />
                          {validationErrors.basicPrice && <p className="text-red-500 text-xs mt-1">{validationErrors.basicPrice}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">مدة التسليم (أيام)</label>
                          <input type="number" value={formData.basic.deliveryTime} onChange={(e) => handlePackageChange('basic', 'deliveryTime', e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">مميزات الباقة</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempBasicFeature} onChange={(e) => setTempBasicFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('basic')} className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="أضف ميزة جديدة" />
                          <button type="button" onClick={() => addPackageFeature('basic')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">إضافة</button>
                        </div>
                        <div className="space-y-1">
                          {formData.basic.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button type="button" onClick={() => removePackageFeature('basic', idx)} className="text-red-500 hover:text-red-700">✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pro Package */}
                    <div className={`border-2 rounded-2xl p-6 transition-all ${validationErrors.proPrice ? 'border-red-500' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">⭐ Pro</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">موصى به</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">السعر ($) <span className="text-red-500">*</span></label>
                          <input type="number" value={formData.pro.price} onChange={(e) => handlePackageChange('pro', 'price', e.target.value)} className={`w-full px-4 py-2 rounded-xl border-2 ${validationErrors.proPrice ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:outline-none`} placeholder="سعر الباقة" />
                          {validationErrors.proPrice && <p className="text-red-500 text-xs mt-1">{validationErrors.proPrice}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">مدة التسليم (أيام)</label>
                          <input type="number" value={formData.pro.deliveryTime} onChange={(e) => handlePackageChange('pro', 'deliveryTime', e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">مميزات الباقة</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempProFeature} onChange={(e) => setTempProFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('pro')} className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="أضف ميزة جديدة" />
                          <button type="button" onClick={() => addPackageFeature('pro')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">إضافة</button>
                        </div>
                        <div className="space-y-1">
                          {formData.pro.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button type="button" onClick={() => removePackageFeature('pro', idx)} className="text-red-500 hover:text-red-700">✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enterprise Package */}
                    <div className={`border-2 rounded-2xl p-6 transition-all ${validationErrors.enterprisePrice ? 'border-red-500' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">🏢 Enterprise</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">السعر ($) <span className="text-red-500">*</span></label>
                          <input type="number" value={formData.enterprise.price} onChange={(e) => handlePackageChange('enterprise', 'price', e.target.value)} className={`w-full px-4 py-2 rounded-xl border-2 ${validationErrors.enterprisePrice ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:outline-none`} placeholder="سعر الباقة" />
                          {validationErrors.enterprisePrice && <p className="text-red-500 text-xs mt-1">{validationErrors.enterprisePrice}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">مدة التسليم (أيام)</label>
                          <input type="number" value={formData.enterprise.deliveryTime} onChange={(e) => handlePackageChange('enterprise', 'deliveryTime', e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">مميزات الباقة</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempEnterpriseFeature} onChange={(e) => setTempEnterpriseFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addPackageFeature('enterprise')} className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="أضف ميزة جديدة" />
                          <button type="button" onClick={() => addPackageFeature('enterprise')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">إضافة</button>
                        </div>
                        <div className="space-y-1">
                          {formData.enterprise.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">✓ {feature}</span>
                              <button type="button" onClick={() => removePackageFeature('enterprise', idx)} className="text-red-500 hover:text-red-700">✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Images & Video & Download & Publish */}
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
                        صور المشروع <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        validationErrors.images ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'
                      }`}>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="imageUpload" />
                        <label htmlFor="imageUpload" className="cursor-pointer">
                          <div className="text-4xl mb-2">🖼️</div>
                          <p className="text-gray-500">اضغط لرفع الصور</p>
                          <p className="text-xs text-gray-400 mt-1">يمكنك رفع أكثر من صورة</p>
                        </label>
                      </div>
                      {validationErrors.images && <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-xl" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        فيديو توضيحي <span className="text-red-500">*</span>
                      </label>
                      {formData.videoFile ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <div className="flex items-center gap-3"><span className="text-3xl">🎬</span><div><p className="font-medium">{formData.videoFile.name}</p><p className="text-sm text-gray-500">{(formData.videoFile.size / (1024 * 1024)).toFixed(2)} ميجابايت</p></div></div>
                          <button type="button" onClick={removeVideo} className="text-red-500 hover:text-red-700 text-xl">✕</button>
                        </div>
                      ) : (
                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${validationErrors.videoFile ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}>
                          <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleVideoUpload} className="hidden" id="videoUploadStep4" />
                          <label htmlFor="videoUploadStep4" className="cursor-pointer"><div className="text-4xl mb-2">🎥</div><p className="text-gray-500">اضغط لرفع فيديو</p></label>
                        </div>
                      )}
                      {validationErrors.videoFile && <p className="text-red-500 text-xs mt-1">{validationErrors.videoFile}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ملف المشروع <span className="text-red-500">*</span>
                      </label>
                      {formData.downloadFile ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <div className="flex items-center gap-3"><span className="text-3xl">📦</span><div><p className="font-medium">{formData.downloadFile.name}</p><p className="text-sm text-gray-500">{(formData.downloadFile.size / (1024 * 1024)).toFixed(2)} ميجابايت</p></div></div>
                          <button type="button" onClick={removeDownload} className="text-red-500 hover:text-red-700 text-xl">✕</button>
                        </div>
                      ) : (
                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${validationErrors.downloadFile ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'}`}>
                          <input type="file" accept=".zip,.rar,.7z" onChange={handleDownloadUpload} className="hidden" id="downloadUpload" />
                          <label htmlFor="downloadUpload" className="cursor-pointer"><div className="text-4xl mb-2">📦</div><p className="text-gray-500">اضغط لرفع ملف المشروع</p><p className="text-xs text-gray-400 mt-1">ZIP, RAR, 7Z - أقصى حجم 500 ميجا</p></label>
                        </div>
                      )}
                      {validationErrors.downloadFile && <p className="text-red-500 text-xs mt-1">{validationErrors.downloadFile}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition">
                    السابق
                  </button>
                )}
                {step < 4 ? (
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto">
                    التالي
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto disabled:opacity-50">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري النشر... {uploadProgress}%</span>
                      </div>
                    ) : (
                      'نشر المشروع 🚀'
                    )}
                  </button>
                )}
              </div>

              {/* ✅ رسالة الترقية - تحت زر النشر */}
              {upgradeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-r-4 border-amber-500 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl mt-1">⚠️</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-800">🚀 تحتاج إلى ترقية خطتك!</h3>
                      <p className="text-amber-700 mt-1 text-sm">
                        أنت على الخطة المجانية والحد الأقصى للمشاريع هو 3 مشاريع. الرجاء قم بالترقية لنشر المزيد.
                      </p>
                      <Link
                        to="/pricing"
                        className="inline-block mt-3 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm"
                      >
                        ترقية الخطة الآن 💎
                      </Link>
                    </div>
                    <button
                      onClick={() => setUpgradeMessage(null)}
                      className="text-amber-400 hover:text-amber-600 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}