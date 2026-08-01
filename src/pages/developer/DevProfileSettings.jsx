import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevProfileSettings() {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  // ✅ استخدم useRef لمنع التكرار
  const hasLoaded = useRef(false);
  
  // ✅ Form Data
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.username || '',
    email: user?.email || '',
    title: user?.title || '',
    bio: user?.bio || user?.about || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    experience: user?.experience || '3-5',
    hourlyRate: user?.hourlyRate || 50,
    techStack: user?.techStack || [],
    skills: user?.skills || [],
    languages: user?.languages || ['العربية'],
    education: user?.education || [],
    certificates: user?.certificates || [],
    country: user?.country || '',
    avatar: user?.profileImage || user?.avatar || 'https://via.placeholder.com/200/6366f1/ffffff?text=User',
    coverImage: user?.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    isTeam: user?.isTeam || false // ✅ علامة الفريق
  });

  // ✅ ملفات للرفع
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // ✅ دالة مساعدة لتحويل البيانات من الباك اند (string -> array)
  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value.split(',').filter(Boolean);
      }
    }
    return [];
  };

  // ✅ دالة مساعدة للتأكد من إن القيمة Array قبل الإرسال (قوية)
  const parseToArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value.split(',').filter(Boolean);
      }
    }
    return [];
  };

  // ✅ جلب بيانات المستخدم عند تحميل الصفحة (مرة واحدة فقط)
  useEffect(() => {
    if (hasLoaded.current) return;
    
    const loadUserData = async () => {
      try {
        console.log('📥 Loading user data...');
        const userData = await fetchUser();
        console.log('📥 User data loaded:', userData);
        
        if (userData) {
          setFormData({
            fullName: userData.name || userData.username || '',
            email: userData.email || '',
            title: userData.title || '',
            bio: userData.bio || userData.about || '',
            location: userData.location || '',
            phone: userData.phone || '',
            website: userData.website || '',
            github: userData.github || '',
            linkedin: userData.linkedin || '',
            twitter: userData.twitter || '',
            experience: userData.experience || '3-5',
            hourlyRate: userData.hourlyRate || 50,
            techStack: parseArray(userData.techStack),
            skills: parseArray(userData.skills),
            languages: parseArray(userData.languages),
            education: parseArray(userData.education),
            certificates: parseArray(userData.certificates),
            country: userData.country || '',
            avatar: userData.profileImage || userData.avatar || 'https://via.placeholder.com/200/6366f1/ffffff?text=User',
            coverImage: userData.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
            isTeam: userData.isTeam || false // ✅ علامة الفريق
          });
          
          hasLoaded.current = true;
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  // Temporary states
  const [tempTech, setTempTech] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');
  const [tempEducation, setTempEducation] = useState({ degree: '', institution: '', year: '', description: '' });
  const [tempCertificate, setTempCertificate] = useState({ name: '', issuer: '', date: '', credentialId: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover Upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
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

  // Education Functions
  const addEducation = () => {
    if (tempEducation.degree && tempEducation.institution) {
      setFormData({
        ...formData,
        education: [...formData.education, { ...tempEducation }]
      });
      setTempEducation({ degree: '', institution: '', year: '', description: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  // Certificates Functions
  const addCertificate = () => {
    if (tempCertificate.name && tempCertificate.issuer) {
      setFormData({
        ...formData,
        certificates: [...formData.certificates, { ...tempCertificate }]
      });
      setTempCertificate({ name: '', issuer: '', date: '', credentialId: '' });
    }
  };

  const removeCertificate = (index) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index)
    });
  };

  // ✅ الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // ✅ الحقول النصية
      submitData.append('fullName', formData.fullName || '');
      submitData.append('title', formData.title || '');
      submitData.append('bio', formData.bio || '');
      submitData.append('experience', formData.experience || '3-5');
      submitData.append('hourlyRate', formData.hourlyRate || 50);
      submitData.append('country', formData.country || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('github', formData.github || '');
      submitData.append('linkedin', formData.linkedin || '');
      submitData.append('twitter', formData.twitter || '');
      submitData.append('website', formData.website || '');
      
      // ✅ تأكد من إنها Arrays قبل الإرسال باستخدام parseToArray
      const techStack = parseToArray(formData.techStack);
      const skills = parseToArray(formData.skills);
      const languages = parseToArray(formData.languages);
      const education = parseToArray(formData.education);
      const certificates = parseToArray(formData.certificates);
      
      // ✅ للتأكد من القيم قبل الإرسال
      console.log('📤 Sending techStack (array):', techStack);
      console.log('📤 Sending skills (array):', skills);
      console.log('📤 Sending languages (array):', languages);
      
      submitData.append('techStack', JSON.stringify(techStack));
      submitData.append('skills', JSON.stringify(skills));
      submitData.append('languages', JSON.stringify(languages));
      submitData.append('education', JSON.stringify(education));
      submitData.append('certificates', JSON.stringify(certificates));
      
      // ✅ الملفات
      if (profileImageFile) {
        submitData.append('profileImage', profileImageFile);
      }
      if (coverImageFile) {
        submitData.append('coverImage', coverImageFile);
      }
      
      const response = await updateUserProfile(submitData);
      console.log('✅ Profile updated:', response);
      
      setSaveSuccess(true);
      await fetchUser();
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert(error.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const experienceLevels = [
    { value: '0-1', label: 'مبتدئ (0-1 سنة)' },
    { value: '1-3', label: 'متوسط (1-3 سنوات)' },
    { value: '3-5', label: 'محترف (3-5 سنوات)' },
    { value: '5-8', label: 'خبير (5-8 سنوات)' },
    { value: '8+', label: 'أسطورة (8+ سنوات)' }
  ];

  const techOptions = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
    'Laravel', 'PHP', 'Java', 'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
    'MySQL', 'Firebase', 'AWS', 'Docker', 'TailwindCSS', 'TypeScript', 'GraphQL'
  ];

  const tabs = [
    { id: 'personal', label: 'معلومات شخصية', icon: '👤' },
    { id: 'professional', label: 'المهارات والخبرات', icon: '💻' },
    { id: 'education', label: 'المؤهلات والشهادات', icon: '🎓' },
    { id: 'social', label: 'روابط التواصل', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="profile" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  بروفايلي 👤
                </h1>
                <p className="text-gray-500 mt-1">إدارة وتحديث معلوماتك الشخصية والمهنية</p>
              </div>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl flex items-center gap-2"
                >
                  <span>✅</span> تم حفظ التغييرات بنجاح
                </motion.div>
              )}
            </motion.div>

            {/* Cover & Avatar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            >
              {/* Cover Image */}
              <div className="relative h-48 md:h-64">
                <img 
                  src={coverPreview || formData.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <label className="absolute bottom-3 left-3 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
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

              {/* Avatar */}
              <div className="relative px-6 -mt-16 mb-6">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                      <img 
                        src={avatarPreview || formData.avatar} 
                        alt={formData.fullName} 
                        className="w-full h-full object-cover"
                      />
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
                      </svg>
                    </label>
                  </div>
                  <div className="pb-2">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      {formData.fullName}
                      {/* ✅ علامة الفريق الزرقاء */}
                      {formData.isTeam && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          فريق
                        </span>
                      )}
                    </h2>
                    <p className="text-indigo-600">{formData.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                        : 'text-gray-500 hover:text-indigo-500'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {/* Personal Info Tab */}
                  {activeTab === 'personal' && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الاسم الكامل
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                            disabled
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المسمى الوظيفي
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="مثال: Full Stack Developer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          نبذة عنك
                        </label>
                        <textarea
                          name="bio"
                          rows="5"
                          value={formData.bio}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                          placeholder="حدثنا عن خبراتك ومهاراتك..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الدولة
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="مثال: مصر"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            السعر بالساعة ($)
                          </label>
                          <input
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          سنوات الخبرة
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          {experienceLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Professional Tab */}
                  {activeTab === 'professional' && (
                    <motion.div
                      key="professional"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Tech Stack */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          التقنيات التي تتقنها
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
                          {formData.techStack.map((tech, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                              {tech}
                              <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-600">✕</button>
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
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
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المهارات الشخصية
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

                  {/* Education & Certificates Tab */}
                  {activeTab === 'education' && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Education */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          المؤهلات العلمية
                        </label>
                        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                          <input
                            type="text"
                            placeholder="الشهادة (مثال: بكالوريوس علوم الحاسب)"
                            value={tempEducation.degree}
                            onChange={(e) => setTempEducation({ ...tempEducation, degree: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="الجامعة / المؤسسة"
                            value={tempEducation.institution}
                            onChange={(e) => setTempEducation({ ...tempEducation, institution: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="سنة التخرج"
                            value={tempEducation.year}
                            onChange={(e) => setTempEducation({ ...tempEducation, year: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <textarea
                            placeholder="وصف إضافي (اختياري)"
                            rows="2"
                            value={tempEducation.description}
                            onChange={(e) => setTempEducation({ ...tempEducation, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                          />
                          <button
                            type="button"
                            onClick={addEducation}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                          >
                            إضافة مؤهل علمي
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formData.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <div>
                                <h4 className="font-semibold">{edu.degree}</h4>
                                <p className="text-xs text-gray-500">{edu.institution} - {edu.year}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEducation(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certificates */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          الشهادات المهنية
                        </label>
                        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                          <input
                            type="text"
                            placeholder="اسم الشهادة"
                            value={tempCertificate.name}
                            onChange={(e) => setTempCertificate({ ...tempCertificate, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="الجهة المانحة"
                            value={tempCertificate.issuer}
                            onChange={(e) => setTempCertificate({ ...tempCertificate, issuer: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="تاريخ الإصدار"
                            value={tempCertificate.date}
                            onChange={(e) => setTempCertificate({ ...tempCertificate, date: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="رقم الاعتماد (اختياري)"
                            value={tempCertificate.credentialId}
                            onChange={(e) => setTempCertificate({ ...tempCertificate, credentialId: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={addCertificate}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                          >
                            إضافة شهادة
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formData.certificates.map((cert, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <div>
                                <h4 className="font-semibold">{cert.name}</h4>
                                <p className="text-xs text-gray-500">{cert.issuer} - {cert.date}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeCertificate(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Social Links Tab */}
                  {activeTab === 'social' && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          الموقع الشخصي
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اسم المستخدم في GitHub"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اسم المستخدم في LinkedIn"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Twitter/X
                        </label>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اسم المستخدم في Twitter"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الحفظ...
                      </div>
                    ) : (
                      'حفظ التغييرات 💾'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}