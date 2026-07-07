/* eslint-disable react-hooks/set-state-in-effect */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeProfileAction, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const emailFromUrl = queryParams.get('email') || '';
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: emailFromUrl || user?.email || '',
    bio: user?.bio || '',
    title: user?.title || '',
    experience: user?.experience || '',
    hourlyRate: user?.hourlyRate || '',
    techStack: user?.techStack || [],
    skills: user?.skills || [],
    languages: user?.languages || ['العربية'],
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    website: user?.website || '',
    profileImage: null, // سيخزن ملف الـ File الحقيقي المرفوع من الجهاز
    coverImage: null    // سيخزن ملف الـ File الحقيقي المرفوع من الجهاز
  });

  const [tempTech, setTempTech] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">جاري تحميل البيانات...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  // ✅ التقاط الملف الحقيقي وعمل معاينة فورية بالمتصفح
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // للمعاينة البصرية بالصفحة
      setFormData(prev => ({ ...prev, profileImage: file })); // تخزين كائن الـ File الحقيقي لإرساله للباك إند
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file)); // للمعاينة البصرية بالصفحة
      setFormData(prev => ({ ...prev, coverImage: file })); // تخزين كائن الـ File الحقيقي لإرساله للباك إند
    }
  };

  const addTech = () => {
    if (tempTech.trim() && !formData.techStack.includes(tempTech.trim())) {
      setFormData({ ...formData, techStack: [...formData.techStack, tempTech.trim()] });
      setTempTech('');
      setValidationErrors({ ...validationErrors, techStack: '' });
    }
  };

  const removeTech = (tech) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) });
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, tempSkill.trim()] });
      setTempSkill('');
      setValidationErrors({ ...validationErrors, skills: '' });
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addLanguage = () => {
    if (tempLanguage.trim() && !formData.languages.includes(tempLanguage.trim())) {
      setFormData({ ...formData, languages: [...formData.languages, tempLanguage.trim()] });
      setTempLanguage('');
    }
  };

  const removeLanguage = (lang) => {
    if (lang !== 'العربية') {
      setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
    }
  };

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

  // ✅ تحويل البيانات الكاملة إلى FormData لإرسال الملفات مع الحقول النصية بشكل سليم
  const handleSubmitFinal = async () => {
    if (step !== 3 || isSubmitting) return;
    if (!validateForm()) { setStep(1); return; }
    
    setIsSubmitting(true);
    setLoading(true);
    
    try {
      const dataToSend = new FormData();
      
      // إرفاق الحقول العادية
      dataToSend.append('email', formData.email);
      dataToSend.append('fullName', formData.fullName);
      dataToSend.append('title', formData.title);
      dataToSend.append('bio', formData.bio);
      dataToSend.append('experience', formData.experience);
      dataToSend.append('hourlyRate', formData.hourlyRate);
      dataToSend.append('github', formData.github);
      dataToSend.append('linkedin', formData.linkedin);
      dataToSend.append('twitter', formData.twitter);
      dataToSend.append('website', formData.website);
      
      // تحويل المصفوفات إلى نصوص مفصولة بفواصل، الباك إند عندك يستقبلها ويفكها بذكاء عبر دالة .split(',')
      dataToSend.append('techStack', formData.techStack.join(','));
      dataToSend.append('skills', formData.skills.join(','));
      dataToSend.append('languages', formData.languages.join(','));

      // إرفاق الملفات الحقيقية المرفوعة إذا كانت موجودة ليقوم Multer بقرائتها
      if (formData.profileImage) {
        dataToSend.append('profileImage', formData.profileImage);
      }
      if (formData.coverImage) {
        dataToSend.append('coverImage', formData.coverImage);
      }
      
      // استدعاء الأكشن المحدث الذي يرسل الـ FormData
      await completeProfileAction(dataToSend);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setValidationErrors({ submit: error.message || 'حدث خطأ أثناء حفظ البيانات' });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => { if (validateStep()) setStep(step + 1); };
  const prevStep = () => setStep(step - 1);

  const progressSteps = [
    { number: 1, title: 'المعلومات الشخصية', icon: '👤' },
    { number: 2, title: 'المهارات والخبرة', icon: '💻' },
    { number: 3, title: 'الروابط والتواصل', icon: '🔗' }
  ];

  const experienceLevels = [
    { value: '', label: 'اختر سنوات الخبرة' },
    { value: '0-1', label: 'مبتدئ (0-1 سنة)' },
    { value: '1-3', label: 'متوسط (1-3 سنوات)' },
    { value: '3-5', label: 'محترف (3-5 سنوات)' },
    { value: '5-8', label: 'خبير (5-8 سنوات)' },
    { value: '8+', label: 'أسطورة (8+ سنوات)' }
  ];

  const techOptions = ['React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'TailwindCSS', 'TypeScript', 'Python', 'Docker', 'AWS'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Navbar />
      
      <main className="flex-grow relative py-12 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* شريط الخطوات العلوي */}
          <div className="mb-10 flex justify-between items-center relative px-2">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200/80 z-0 rounded-full mx-6">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 rounded-full" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
            
            {progressSteps.map((s) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold ${
                  step >= s.number 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' 
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {step > s.number ? '✓' : s.icon}
                </div>
                <span className={`text-xs mt-2 font-medium transition-all duration-300 ${
                  step >= s.number ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* البورد والنموذج الرئيسي للبيانات */}
          <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-3xl shadow-xl shadow-gray-100/70 border border-gray-100 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-md bg-slate-50 flex items-center justify-center group">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-4xl text-gray-400">👤</span>
                      )}
                      <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-xl cursor-pointer hover:bg-indigo-700 shadow-md transition-colors">
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </label>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">الصورة الشخصية</span>
                  </div>

                  <div className="relative h-36 rounded-2xl bg-slate-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <span className="text-2xl block mb-1">🖼️</span>
                        <span className="text-xs">صورة الغلاف (أبعاد عريضة)</span>
                      </div>
                    )}
                    <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:bg-white shadow-sm border border-gray-100 transition-all">
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      تغيير الغلاف
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${validationErrors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all`} placeholder="أدخل اسمك الثلاثي" />
                      {validationErrors.fullName && <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">المسمى الوظيفي *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${validationErrors.title ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all`} placeholder="مثال: Full-Stack Developer" />
                      {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">نبذة تعريفية (Bio) *</label>
                    <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${validationErrors.bio ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all resize-none`} placeholder="اكتب نبذة مختصرة عن مهاراتك وخبراتك البرمجية..." />
                    {validationErrors.bio && <p className="text-red-500 text-xs mt-1">{validationErrors.bio}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">مستوى الخبرة *</label>
                      <select name="experience" value={formData.experience} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${validationErrors.experience ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all bg-white`}>
                        {experienceLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                      {validationErrors.experience && <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">السعر التقريبي بالساعة ($) *</label>
                      <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${validationErrors.hourlyRate ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all`} placeholder="15" min="1" />
                      {validationErrors.hourlyRate && <p className="text-red-500 text-xs mt-1">{validationErrors.hourlyRate}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">التقنيات البرمجية (Tech Stack) *</label>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={tempTech} onChange={e => setTempTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="مثال: Node.js, React (اضغط Enter للاضافة)" />
                      <button type="button" onClick={addTech} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm font-medium">إضافة</button>
                    </div>
                    {validationErrors.techStack && <p className="text-red-500 text-xs mb-2">{validationErrors.techStack}</p>}
                    
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-gray-100 min-h-[50px]">
                      {formData.techStack.length === 0 && <span className="text-xs text-gray-400 p-1">لم يتم إضافة أي تقنيات بعد...</span>}
                      {formData.techStack.map(t => (
                        <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
                          {t}
                          <button type="button" onClick={() => removeTech(t)} className="text-indigo-400 hover:text-indigo-600 font-bold">✕</button>
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2.5">
                      <span className="text-[11px] text-gray-400 block mb-1">اقتراحات شائعة:</span>
                      <div className="flex flex-wrap gap-1">
                        {techOptions.filter(o => !formData.techStack.includes(o)).slice(0, 8).map(o => (
                          <button key={o} type="button" onClick={() => setFormData({ ...formData, techStack: [...formData.techStack, o] })} className="text-[11px] bg-gray-100 text-gray-600 hover:bg-gray-200 px-2 py-0.5 rounded-md transition-colors">+{o}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">المهارات الشخصية والفرعية (Skills) *</label>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={tempSkill} onChange={e => setTempSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="مثال: Git, Problem Solving" />
                      <button type="button" onClick={addSkill} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-95 transition-all text-sm font-medium">إضافة</button>
                    </div>
                    {validationErrors.skills && <p className="text-red-500 text-xs mb-2">{validationErrors.skills}</p>}
                    
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-gray-100 min-h-[50px]">
                      {formData.skills.length === 0 && <span className="text-xs text-gray-400 p-1">لم يتم إضافة مهارات بعد...</span>}
                      {formData.skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)} className="text-purple-400 hover:text-purple-600 font-bold">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اللغات</label>
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={tempLanguage} onChange={e => setTempLanguage(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())} className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="مثال: English" />
                      <button type="button" onClick={addLanguage} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 text-sm font-medium">إضافة</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {formData.languages.map(l => (
                        <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-gray-200">
                          {l}
                          {l !== 'العربية' && (
                            <button type="button" onClick={() => removeLanguage(l)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-gray-400 mb-2">أضف روابط أعمالك وحساباتك المهنية لزيادة موثوقية ملفك (اختياري)</p>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">حساب GitHub</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 text-sm">🔗</span>
                      <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-left" placeholder="https://github.com/your-username" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">حساب LinkedIn</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 text-sm">🔗</span>
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-left" placeholder="https://linkedin.com/in/your-profile" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">حساب Twitter / X</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 text-sm">🔗</span>
                      <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-left" placeholder="https://x.com/your-handle" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">الموقع الإلكتروني الخاص (Portfolio)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 text-sm">🌐</span>
                      <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-left" placeholder="https://yourwebsite.com" dir="ltr" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* أزرار التحكم والخطوة الحالية */}
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-sm font-medium"
                >
                  السابق
                </button>
              ) : (
                <div />
              )}
              
              <div>
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all text-sm font-medium"
                  >
                    التالي
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSubmitFinal} 
                    disabled={loading || isSubmitting} 
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-100 active:scale-95 transition-all text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'جاري حفظ البيانات وعمل الرفع...' : 'إنهاء وإرسال الملف'}
                  </button>
                )}
              </div>
            </div>

            {validationErrors.submit && (
              <p className="text-red-500 text-center text-sm font-medium mt-4 bg-red-50 p-2.5 rounded-xl border border-red-100">
                {validationErrors.submit}
              </p>
            )}
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}