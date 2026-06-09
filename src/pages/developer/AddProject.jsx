import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function AddProject() {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    category: '',
    demoUrl: '',
    githubUrl: '',
    techStack: [],
    features: [],
    images: [],
    videoUrl: '',
    packages: [
      { name: 'Basic', price: '', delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
      { name: 'Pro', price: '', delivery: '7 أيام', features: ['كل ما في Basic', 'تعديل الألوان', 'إضافة ميزة'] },
      { name: 'Enterprise', price: '', delivery: '30 يوم', features: ['كل ما في Pro', 'بناء مخصص', 'دعم فني'] }
    ],
    support: '',
    updates: '',
    license: 'regular'
  });

  // Temporary states
  const [tempTech, setTempTech] = useState('');
  const [tempFeature, setTempFeature] = useState('');
  const [tempPackageFeature, setTempPackageFeature] = useState({ packageIndex: 0, feature: '' });

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

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'اسم المشروع مطلوب';
    if (!formData.category) errors.category = 'التصنيف مطلوب';
    if (!formData.description.trim()) errors.description = 'الوصف القصير مطلوب';
    if (formData.techStack.length === 0) errors.techStack = 'أضف تقنية واحدة على الأقل';
    if (formData.features.length === 0) errors.features = 'أضف ميزة واحدة على الأقل';
    if (formData.images.length === 0) errors.images = 'أضف صورة واحدة على الأقل';
    
    // Check package prices
    formData.packages.forEach((pkg, idx) => {
      if (!pkg.price || pkg.price <= 0) {
        errors[`package_${idx}`] = `سعر باقة ${pkg.name} مطلوب`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Tech Stack Functions
  const addTech = () => {
    if (tempTech.trim() && !formData.techStack.includes(tempTech.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tempTech.trim()]
      });
      setTempTech('');
      setValidationErrors({ ...validationErrors, techStack: '' });
    }
  };

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  // Features Functions
  const addFeature = () => {
    if (tempFeature.trim() && !formData.features.includes(tempFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, tempFeature.trim()]
      });
      setTempFeature('');
      setValidationErrors({ ...validationErrors, features: '' });
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  // Package Features Functions
  const addPackageFeature = () => {
    if (tempPackageFeature.feature.trim()) {
      const newPackages = [...formData.packages];
      newPackages[tempPackageFeature.packageIndex].features.push(tempPackageFeature.feature.trim());
      setFormData({ ...formData, packages: newPackages });
      setTempPackageFeature({ ...tempPackageFeature, feature: '' });
    }
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    const newPackages = [...formData.packages];
    newPackages[packageIndex].features = newPackages[packageIndex].features.filter((_, i) => i !== featureIndex);
    setFormData({ ...formData, packages: newPackages });
  };

  const updatePackagePrice = (index, price) => {
    const newPackages = [...formData.packages];
    newPackages[index].price = price;
    setFormData({ ...formData, packages: newPackages });
    setValidationErrors({ ...validationErrors, [`package_${index}`]: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  // Submit function - only called when user clicks publish
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Save to localStorage for demo
      const existingProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      const newProject = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'published'
      };
      existingProjects.push(newProject);
      localStorage.setItem('userProjects', JSON.stringify(existingProjects));
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard/developer/store');
      }, 500);
    }, 2000);
  };

  const nextStep = () => {
    // Basic validation before moving to next step
    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationErrors({ name: 'اسم المشروع مطلوب' });
        return;
      }
      if (!formData.category) {
        setValidationErrors({ category: 'التصنيف مطلوب' });
        return;
      }
      if (!formData.description.trim()) {
        setValidationErrors({ description: 'الوصف القصير مطلوب' });
        return;
      }
    }
    
    if (step === 2) {
      if (formData.techStack.length === 0) {
        setValidationErrors({ techStack: 'أضف تقنية واحدة على الأقل' });
        return;
      }
      if (formData.features.length === 0) {
        setValidationErrors({ features: 'أضف ميزة واحدة على الأقل' });
        return;
      }
    }
    
    if (step === 3) {
      let hasError = false;
      formData.packages.forEach((pkg, idx) => {
        if (!pkg.price || pkg.price <= 0) {
          setValidationErrors(prev => ({
            ...prev,
            [`package_${idx}`]: `سعر باقة ${pkg.name} مطلوب`
          }));
          hasError = true;
        }
      });
      if (hasError) return;
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
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.name ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none`}
                        placeholder="مثال: نظام إدارة المستشفيات الذكي"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
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
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.description ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none resize-none`}
                        placeholder="وصف مختصر للمشروع (يظهر في بطاقة المشروع)"
                      />
                      {validationErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ترخيص المشروع
                      </label>
                      <select
                        name="license"
                        value={formData.license}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="regular">ترخيص عادي - يمكن بيعه لعميل واحد</option>
                        <option value="extended">ترخيص ممتد - يمكن بيعه لعدة عملاء</option>
                        <option value="unlimited">ترخيص غير محدود - بيع غير محدود</option>
                      </select>
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
                        {formData.techStack.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {tech}
                            <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-600">✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {techOptions.filter(t => !formData.techStack.includes(t)).slice(0, 15).map(tech => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => {
                              if (!formData.techStack.includes(tech)) {
                                setFormData({ ...formData, techStack: [...formData.techStack, tech] });
                              }
                            }}
                            className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition"
                          >
                            + {tech}
                          </button>
                        ))}
                      </div>
                      {validationErrors.techStack && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.techStack}</p>
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
                        {formData.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-700">✓ {feature}</span>
                            <button type="button" onClick={() => removeFeature(feature)} className="text-red-500 hover:text-red-700">✕</button>
                          </div>
                        ))}
                      </div>
                      {validationErrors.features && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.features}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رابط فيديو توضيحي (اختياري)
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
                    {formData.packages.map((pkg, idx) => (
                      <div key={idx} className={`border-2 rounded-2xl p-6 transition-all ${
                        validationErrors[`package_${idx}`] ? 'border-red-500' : 'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
                          {idx === 1 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">موصى به</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              السعر ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={pkg.price}
                              onChange={(e) => updatePackagePrice(idx, e.target.value)}
                              className={`w-full px-4 py-2 rounded-xl border-2 transition-all ${
                                validationErrors[`package_${idx}`] ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                              } focus:outline-none`}
                              placeholder={`سعر باقة ${pkg.name}`}
                            />
                            {validationErrors[`package_${idx}`] && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[`package_${idx}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              مدة التسليم
                            </label>
                            <input
                              type="text"
                              value={pkg.delivery}
                              onChange={(e) => {
                                const newPackages = [...formData.packages];
                                newPackages[idx].delivery = e.target.value;
                                setFormData({ ...formData, packages: newPackages });
                              }}
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
                              value={tempPackageFeature.packageIndex === idx ? tempPackageFeature.feature : ''}
                              onChange={(e) => setTempPackageFeature({ packageIndex: idx, feature: e.target.value })}
                              onKeyPress={(e) => e.key === 'Enter' && addPackageFeature()}
                              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                              placeholder="أضف ميزة جديدة للباقة"
                            />
                            <button
                              type="button"
                              onClick={addPackageFeature}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                            >
                              إضافة
                            </button>
                          </div>
                          <div className="space-y-1">
                            {pkg.features.map((feature, fIdx) => (
                              <div key={fIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700">✓ {feature}</span>
                                <button
                                  type="button"
                                  onClick={() => removePackageFeature(idx, fIdx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الدعم الفني
                      </label>
                      <select
                        name="support"
                        value={formData.support}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">اختر مدة الدعم</option>
                        <option value="1month">شهر واحد</option>
                        <option value="3months">3 أشهر</option>
                        <option value="6months">6 أشهر</option>
                        <option value="1year">سنة كاملة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        التحديثات
                      </label>
                      <select
                        name="updates"
                        value={formData.updates}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">اختر مدة التحديثات</option>
                        <option value="3months">3 أشهر</option>
                        <option value="6months">6 أشهر</option>
                        <option value="1year">سنة كاملة</option>
                        <option value="lifetime">مدى الحياة</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Images & Publish */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        صور المشروع <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        validationErrors.images ? 'border-red-500' : 'border-gray-300 hover:border-indigo-500'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label htmlFor="imageUpload" className="cursor-pointer">
                          <div className="text-4xl mb-2">🖼️</div>
                          <p className="text-gray-500">اضغط لرفع الصور</p>
                          <p className="text-xs text-gray-400 mt-1">يمكنك رفع أكثر من صورة</p>
                        </label>
                      </div>
                      {validationErrors.images && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-xl" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview Card */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4">📱 معاينة المشروع</h3>
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800">{formData.name || 'اسم المشروع'}</h4>
                          <p className="text-sm text-gray-500 mt-1">{formData.description || 'وصف المشروع'}</p>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex gap-1">
                              {formData.techStack.slice(0, 3).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg">{tech}</span>
                              ))}
                            </div>
                            <span className="text-xl font-bold text-indigo-600">
                              ${formData.packages[1]?.price || '0'}
                            </span>
                          </div>
                        </div>
                      </div>
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
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all ml-auto disabled:opacity-50"
                  >
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
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}