import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CompleteClientProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form Data للعميل
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    companyBio: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    location: '',
    phone: '',
    projectsNeeded: [],
    budget: '',
    preferredTech: [],
    contactPerson: '',
    contactPosition: ''
  });

  // Temporary states
  const [tempTech, setTempTech] = useState('');


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData({
          ...formData,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover Upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setFormData({
          ...formData,
          coverImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add preferred tech
  const addTech = () => {
    if (tempTech.trim() && !formData.preferredTech.includes(tempTech.trim())) {
      setFormData({
        ...formData,
        preferredTech: [...formData.preferredTech, tempTech.trim()]
      });
      setTempTech('');
    }
  };

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      preferredTech: formData.preferredTech.filter(t => t !== tech)
    });
  };

  // Add project type
  const toggleProject = (project) => {
    if (formData.projectsNeeded.includes(project)) {
      setFormData({
        ...formData,
        projectsNeeded: formData.projectsNeeded.filter(p => p !== project)
      });
    } else {
      setFormData({
        ...formData,
        projectsNeeded: [...formData.projectsNeeded, project]
      });
    }
  };

  // Validate current step before moving
  const validateStep = () => {
    if (step === 1) {
      if (!formData.companyName.trim()) {
        alert('يرجى إدخال اسم الشركة');
        return false;
      }
      if (!formData.industry) {
        alert('يرجى اختيار المجال');
        return false;
      }
    }
    if (step === 2 && formData.projectsNeeded.length === 0) {
      alert('يرجى اختيار نوع المشاريع التي تبحث عنها');
      return false;
    }
    return true;
  };

  // Final validation before submit
  const validateForm = () => {
    if (!formData.companyName.trim()) {
      alert('يرجى إدخال اسم الشركة');
      return false;
    }
    if (!formData.industry) {
      alert('يرجى اختيار المجال');
      return false;
    }
    if (formData.projectsNeeded.length === 0) {
      alert('يرجى اختيار نوع المشاريع التي تبحث عنها');
      return false;
    }
    return true;
  };

  // Final submission - only when user clicks the final button
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    await updateProfile(formData);
    
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/client');
      }, 1500);
    }, 1500);
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const industries = [
    { value: 'tech', label: 'تقنية المعلومات', icon: '💻' },
    { value: 'ecommerce', label: 'التجارة الإلكترونية', icon: '🛒' },
    { value: 'education', label: 'التعليم', icon: '📚' },
    { value: 'healthcare', label: 'الرعاية الصحية', icon: '🏥' },
    { value: 'finance', label: 'الخدمات المالية', icon: '💰' },
    { value: 'realestate', label: 'العقارات', icon: '🏠' },
    { value: 'marketing', label: 'التسويق', icon: '📢' },
    { value: 'other', label: 'أخرى', icon: '📦' }
  ];

  const companySizes = [
    { value: '1-10', label: 'شركة ناشئة (1-10 موظف)' },
    { value: '11-50', label: 'شركة صغيرة (11-50 موظف)' },
    { value: '51-200', label: 'شركة متوسطة (51-200 موظف)' },
    { value: '201-500', label: 'شركة كبيرة (201-500 موظف)' },
    { value: '500+', label: 'شركة عملاقة (500+ موظف)' }
  ];

  const projectTypes = [
    { value: 'web', label: 'موقع ويب', icon: '🌐' },
    { value: 'mobile', label: 'تطبيق موبايل', icon: '📱' },
    { value: 'dashboard', label: 'لوحة تحكم', icon: '📊' },
    { value: 'ecommerce', label: 'متجر إلكتروني', icon: '🛒' },
    { value: 'crm', label: 'نظام CRM', icon: '📋' },
    { value: 'erp', label: 'نظام ERP', icon: '⚙️' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🧠' },
    { value: 'cloud', label: 'الحوسبة السحابية', icon: '☁️' }
  ];

  const techOptions = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
    'Python', 'Django', 'Laravel', 'PHP', 'Java',
    'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
    'AWS', 'Docker', 'TailwindCSS', 'TypeScript'
  ];

  const progressSteps = [
    { number: 1, title: 'معلومات الشركة', icon: '🏢' },
    { number: 2, title: 'تفاصيل المشاريع', icon: '📋' },
    { number: 3, title: 'معلومات التواصل', icon: '📞' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50/30" dir="rtl">
      <Navbar />

      <main className="flex-grow relative py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              أكمل بيانات شركتك 🏢
            </h1>
            <p className="text-gray-600">
              سجل معلومات شركتك لتجد أفضل المبرمجين لمشاريعك
            </p>
          </motion.div>

          {/* Save Success Message */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center"
            >
              ✅ تم حفظ البيانات بنجاح! جاري التحويل...
            </motion.div>
          )}

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
            {/* Step 1: Company Info */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="text-center">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    شعار الشركة
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">🏢</span>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة الغلاف
                  </label>
                  <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">اضغط لرفع صورة الغلاف</span>
                      </div>
                    )}
                    <label className="absolute bottom-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم الشركة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="مثال: شركة التقنية العربية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وصف الشركة
                  </label>
                  <textarea
                    name="companyBio"
                    rows="4"
                    value={formData.companyBio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                    placeholder="حدثنا عن شركتك، رؤيتك، وأهدافك..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المجال <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">اختر المجال</option>
                      {industries.map(ind => (
                        <option key={ind.value} value={ind.value}>
                          {ind.icon} {ind.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      حجم الشركة
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">اختر حجم الشركة</option>
                      {companySizes.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      سنة التأسيس
                    </label>
                    <input
                      type="number"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: مصر، القاهرة"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    موقع الشركة الإلكتروني
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نوع المشاريع التي تبحث عنها <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {projectTypes.map(project => (
                      <button
                        key={project.value}
                        type="button"
                        onClick={() => toggleProject(project.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                          formData.projectsNeeded.includes(project.value)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <span>{project.icon}</span>
                        <span className="text-sm">{project.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الميزانية التقريبية
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">اختر الميزانية</option>
                    <option value="under1000">أقل من $1000</option>
                    <option value="1000-5000">$1000 - $5000</option>
                    <option value="5000-10000">$5000 - $10000</option>
                    <option value="10000-50000">$10000 - $50000</option>
                    <option value="above50000">أكثر من $50000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    التقنيات المفضلة
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
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredTech.map((tech, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-600">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {techOptions.filter(t => !formData.preferredTech.includes(t)).slice(0, 10).map(tech => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          if (!formData.preferredTech.includes(tech)) {
                            setFormData({ ...formData, preferredTech: [...formData.preferredTech, tech] });
                          }
                        }}
                        className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition"
                      >
                        + {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الشخص المسؤول
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      name="contactPosition"
                      value={formData.contactPosition}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: مدير تقنية المعلومات"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="+20123456789"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mt-4">
                  <h3 className="font-bold text-gray-800 mb-3">📋 ملخص معلومات الشركة</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">اسم الشركة:</span>
                      <span className="font-semibold">{formData.companyName || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجال:</span>
                      <span className="font-semibold">
                        {industries.find(i => i.value === formData.industry)?.label || 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع المشاريع:</span>
                      <span className="font-semibold">{formData.projectsNeeded.length} نوع</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التقنيات المفضلة:</span>
                      <span className="font-semibold">{formData.preferredTech.length} تقنية</span>
                    </div>
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
              {step < 3 ? (
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
                      جاري الحفظ...
                    </div>
                  ) : (
                    'إكمال البروفايل 🚀'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}