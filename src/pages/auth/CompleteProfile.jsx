import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    bio: '',
    title: '',
    experience: '',
    hourlyRate: '',
    techStack: [],
    skills: [],
    languages: ['العربية'],
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    avatar: null,
    coverImage: null
  });

  // Temporary states
  const [tempTech, setTempTech] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');

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
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  // Handle Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({
          ...formData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover Image Upload
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

  // Skills Functions
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

  // Languages Functions
  const addLanguage = () => {
    if (tempLanguage.trim() && !formData.languages.includes(tempLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, tempLanguage.trim()]
      });
      setTempLanguage('');
    }
  };

  const removeLanguage = (lang) => {
    if (lang !== 'العربية') {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== lang)
      });
    }
  };

  // Validate all fields before final submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.title.trim()) errors.title = 'المسمى الوظيفي مطلوب';
    if (!formData.bio.trim()) errors.bio = 'نبذة عنك مطلوبة';
    if (!formData.experience) errors.experience = 'سنوات الخبرة مطلوبة';
    if (!formData.hourlyRate || formData.hourlyRate <= 0) errors.hourlyRate = 'السعر بالساعة مطلوب';
    if (formData.techStack.length === 0) errors.techStack = 'أضف تقنية واحدة على الأقل';
    if (formData.skills.length === 0) errors.skills = 'أضف مهارة واحدة على الأقل';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate step before moving to next
  const validateStep = () => {
    if (step === 1) {
      const errors = {};
      if (!formData.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب';
      if (!formData.title.trim()) errors.title = 'المسمى الوظيفي مطلوب';
      if (!formData.bio.trim()) errors.bio = 'نبذة عنك مطلوبة';
      if (!formData.experience) errors.experience = 'سنوات الخبرة مطلوبة';
      if (!formData.hourlyRate || formData.hourlyRate <= 0) errors.hourlyRate = 'السعر بالساعة مطلوب';
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    }
    
    if (step === 2) {
      const errors = {};
      if (formData.techStack.length === 0) errors.techStack = 'أضف تقنية واحدة على الأقل';
      if (formData.skills.length === 0) errors.skills = 'أضف مهارة واحدة على الأقل';
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    }
    
    return true;
  };

  // Final submission - only when user clicks the final button
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(async () => {
      await updateProfile(formData);
      setLoading(false);
      navigate('/dashboard/developer');
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


  const progressSteps = [
    { number: 1, title: 'المعلومات الشخصية', icon: '👤' },
    { number: 2, title: 'المهارات', icon: '💻' },
    { number: 3, title: 'روابط التواصل', icon: '🔗' }
  ];

  const experienceLevels = [
    { value: '', label: 'اختر سنوات الخبرة' },
    { value: '0-1', label: 'مبتدئ (0-1 سنة)' },
    { value: '1-3', label: 'متوسط (1-3 سنوات)' },
    { value: '3-5', label: 'محترف (3-5 سنوات)' },
    { value: '5-8', label: 'خبير (5-8 سنوات)' },
    { value: '8+', label: 'أسطورة (8+ سنوات)' }
  ];

  const techOptions = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
    'Python', 'Django', 'Laravel', 'PHP', 'Java',
    'Flutter', 'React Native', 'MongoDB', 'PostgreSQL', 
    'AWS', 'Docker', 'TailwindCSS', 'TypeScript'
  ];

  
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
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
              أكمل بروفايلك 👋
            </h1>
            <p className="text-gray-600">
              سجل مهاراتك وخبراتك لتبدأ رحلة الربح مع DevHire
            </p>
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

          {/* Form - فقط يحفظ عند الضغط على زر إكمال البروفايل */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1:个人信息 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Avatar Upload */}
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الصورة الشخصية
                    </label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-5xl">👤</span>
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
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
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        validationErrors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } focus:outline-none`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المسمى الوظيفي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        validationErrors.title ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } focus:outline-none`}
                      placeholder="مثال: Full Stack Developer"
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نبذة عنك <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        validationErrors.bio ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      } focus:outline-none resize-none`}
                      placeholder="حدثنا عن خبراتك ومهاراتك..."
                    />
                    {validationErrors.bio && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bio}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        سنوات الخبرة <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.experience ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none`}
                      >
                        {experienceLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                      {validationErrors.experience && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        السعر بالساعة ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                          validationErrors.hourlyRate ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none`}
                        placeholder="مثال: 50"
                      />
                      {validationErrors.hourlyRate && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.hourlyRate}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Skills */}
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
                      التقنيات التي تتقنها <span className="text-red-500">*</span>
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
                      {techOptions.filter(t => !formData.techStack.includes(t)).slice(0, 10).map(tech => (
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

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المهارات الشخصية <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="مثال: حل المشكلات، القيادة"
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
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">✕</button>
                        </span>
                      ))}
                    </div>
                    {validationErrors.skills && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.skills}</p>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اللغات
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tempLanguage}
                        onChange={(e) => setTempLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="مثال: الإنجليزية"
                      />
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                      >
                        إضافة
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {lang}
                          {lang !== 'العربية' && (
                            <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-red-600">✕</button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Social Links */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الموقع الشخصي
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mt-4">
                    <h3 className="font-bold text-gray-800 mb-3">📋 ملخص بروفايلك</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">التقنيات:</span>
                        <span className="font-semibold">{formData.techStack.length} تقنية</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المهارات:</span>
                        <span className="font-semibold">{formData.skills.length} مهارة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">اللغات:</span>
                        <span className="font-semibold">{formData.languages.length} لغة</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons - الحفظ فقط عند الضغط على زر إكمال البروفايل */}
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