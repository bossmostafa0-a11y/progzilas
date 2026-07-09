import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// ✅ المصفوفات الثابتة خارج الكامبوننت
const ELEGANT_CODE = [
  'DevHire', '✨', '</>', '{}', '()', '=>', 'const', 'let',
  'مبرمج', 'ابتكار', 'تقنية', 'ريادة', 'نجاح', 'تطوير',
  'React', 'Node', 'AI', 'Cloud', 'Future', 'Code',
  '🌟', '🚀', '💡', '⚡', '🎯', '🏆'
];

const TRACKS = [
  { value: 'frontend', label: 'Frontend Developer', icon: '🎨' },
  { value: 'backend', label: 'Backend Developer', icon: '⚙️' },
  { value: 'fullstack', label: 'Fullstack Developer', icon: '🚀' },
  { value: 'mobile', label: 'Mobile Developer', icon: '📱' },
  { value: 'devops', label: 'DevOps Engineer', icon: '🔧' },
  { value: 'ai', label: 'AI/ML Engineer', icon: '🧠' }
];

const EXPERIENCE_LEVELS = [
  { value: '0-1', label: 'مبتدئ (0-1 سنة)' },
  { value: '1-3', label: 'متوسط (1-3 سنوات)' },
  { value: '3-5', label: 'محترف (3-5 سنوات)' },
  { value: '5+', label: 'خبير (5+ سنوات)' }
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('developer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    track: '',
    experience: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  
  const canvasRef = useRef(null);
  const { login, registerDeveloperUser, registerClientUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Hacker Matrix Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    const fontSize = 24;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let columnsCount = Math.floor(canvas.width / fontSize);
    let columns = Array.from({ length: columnsCount }, () => Math.floor(Math.random() * canvas.height / fontSize));
    let opacities = Array.from({ length: columnsCount }, () => Math.random() * 0.3 + 0.1);
    
    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < columns.length; i++) {
        const randomIndex = Math.floor(Math.random() * ELEGANT_CODE.length);
        const text = ELEGANT_CODE[randomIndex];
        const x = i * fontSize;
        const y = columns[i] * fontSize;
        
        const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');
        
        ctx.fillStyle = gradient;
        ctx.font = `${fontSize}px 'Cairo', 'Courier New', monospace`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#6366f1';
        ctx.globalAlpha = opacities[i];
        
        ctx.fillText(text, x, y);
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        
        if (y > canvas.height && Math.random() > 0.98) {
          columns[i] = 0;
          opacities[i] = Math.random() * 0.3 + 0.1;
        } else {
          columns[i] += 0.5;
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    }
    
    draw();
    
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumnsCount = Math.floor(canvas.width / fontSize);
      
      columns = Array.from({ length: newColumnsCount }, () => Math.floor(Math.random() * canvas.height / fontSize));
      opacities = Array.from({ length: newColumnsCount }, () => Math.random() * 0.3 + 0.1);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'الاسم مطلوب';
      if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
      if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }
      
      if (userType === 'developer') {
        if (!formData.track) newErrors.track = 'يرجى اختيار التخصص';
        if (!formData.experience) newErrors.experience = 'يرجى اختيار سنوات الخبرة';
      } else {
        if (!formData.companyName) newErrors.companyName = 'اسم الشركة مطلوب';
      }
    } else {
      if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
      if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  setShowVerification(false);
  
  try {
    if (isLogin) {
      // ✅ تسجيل الدخول
      await login(formData.email, formData.password);
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('✅ Stored user after login:', storedUser);
      
      if (storedUser.userType === 'developer') {
        navigate('/dashboard/developer');
      } else {
        navigate('/dashboard/client');
      }
    } else {
      // ============ تسجيل جديد ============
      let response;
      
      if (userType === 'developer') {
        // ✅ تسجيل مبرمج
        response = await registerDeveloperUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          track: formData.track,
          experience: formData.experience
        });
        
        console.log('📥 Register developer response:', response);
        
        const message = response?.message || response?.data?.message || '';
        
        if (message.includes('تفعيل') || message.includes('verify') || message.includes('confirmed')) {
          setTempEmail(formData.email);
          setShowVerification(true);
          setErrors({});
        } else if (message.includes('استكمل الملف') || message.includes('complete') || message.includes('profile')) {
          // ✅ مبرمج محتاج يكمل بروفايل
          navigate(`/complete-profile?email=${encodeURIComponent(formData.email)}`);
        } else {
          // ✅ مبرمج → يروح لداشبورد المبرمج
          navigate('/dashboard/developer');
        }
      } else {
        // ✅ تسجيل عميل
        response = await registerClientUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName
        });
        
        console.log('📥 Register client response:', response);
        
        const message = response?.message || response?.data?.message || '';
        
        if (message.includes('تفعيل') || message.includes('verify') || message.includes('confirmed')) {
          setTempEmail(formData.email);
          setShowVerification(true);
          setErrors({});
        } else if (message.includes('اكمل ملف العميل') || message.includes('complete') || message.includes('profile')) {
          // ✅ عميل محتاج يكمل بروفايل العميل
          navigate(`/complete-client-profile?email=${encodeURIComponent(formData.email)}`);
        } else {
          // ✅ عميل → يروح لداشبورد العميل
          navigate('/dashboard/client');
        }
      }
    }
  } catch (error) {
    console.error('🔴 Error:', error);
    
    // ✅ استخرج رسالة الخطأ
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        error?.data?.message || 
                        '';
    
    console.log('📝 Error message:', errorMessage);
    
    // ✅ التوجيه بناءً على الرسالة فقط (بغض النظر عن userType)
    if (errorMessage.includes('تفعيل') || errorMessage.includes('verify') || errorMessage.includes('confirmed')) {
      setTempEmail(formData.email);
      setShowVerification(true);
      setErrors({});
    } 
    // ✅ لو الرسالة "اكمل ملف العميل" → روح لصفحة العميل
    else if (errorMessage.includes('اكمل ملف العميل')) {
      console.log('✅ Redirecting to CLIENT profile page (based on message)');
      navigate(`/complete-client-profile?email=${encodeURIComponent(formData.email)}`);
    } 
    // ✅ لو الرسالة "استكمل الملف" → روح لصفحة المبرمج
    else if (errorMessage.includes('استكمل الملف')) {
      console.log('✅ Redirecting to DEVELOPER profile page (based on message)');
      navigate(`/complete-profile?email=${encodeURIComponent(formData.email)}`);
    } 
    // ✅ لو الرسالة فيها complete profile → حسب السياق
    else if (errorMessage.toLowerCase().includes('complete') && errorMessage.toLowerCase().includes('profile')) {
      // لو الرسالة فيها "client" روح للعميل
      if (errorMessage.toLowerCase().includes('client')) {
        navigate(`/complete-client-profile?email=${encodeURIComponent(formData.email)}`);
        console.log('✅ Redirecting to CLIENT profile page (complete client)');
      } else {
        navigate(`/complete-profile?email=${encodeURIComponent(formData.email)}`);
        console.log('✅ Redirecting to DEVELOPER profile page (complete profile)');
      }
    } 
    else {
      setErrors({
        submit: errorMessage || 'حدث خطأ، يرجى المحاولة مرة أخرى'
      });
    }
  } finally {
    setLoading(false);
  }
};
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen flex flex-col relative" dir="rtl">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ background: 'linear-gradient(135deg, #0f0c1e 0%, #1a1025 50%, #0f0c1e 100%)' }}
      />
      
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-indigo-950/30 via-transparent to-purple-950/30 pointer-events-none"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="flex-grow relative overflow-hidden">
          <div className="max-w-md mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/10"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {isLogin ? 'مرحباً بعودتك' : 'انضم إلى DevHire'}
                </h1>
                <p className="text-white/50">
                  {isLogin 
                    ? 'سجل دخولك للوصول إلى حسابك' 
                    : userType === 'developer' 
                      ? 'سجل كمبرمج وابدأ رحلة الربح' 
                      : 'سجل كعميل وابحث عن أفضل المبرمجين'}
                </p>
              </div>

             

             

              {/* ✅ رسالة التفعيل */}
              {showVerification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center"
                >
                  <p className="text-yellow-300 text-sm mb-3">
                    ⏳ تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك من خلال البريد الإلكتروني
                  </p>
                  <Link 
                    to={`/verify-account?email=${encodeURIComponent(tempEmail)}`}
                    className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                  >
                    🔐 الذهاب لتفعيل الحساب
                  </Link>
                </motion.div>
              )}

              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  إنشاء حساب
                </button>
              </div>

              {/* User Type Selection */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-semibold text-white/70 mb-3">
                    أنا
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType('developer')}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${
                        userType === 'developer'
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-white/20 text-white/40 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xl ml-2">💻</span>
                      مبرمج
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('client')}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${
                        userType === 'client'
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-white/20 text-white/40 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xl ml-2">🏢</span>
                      عميل
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center"
                >
                  {errors.submit}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <motion.div variants={fadeInUp} initial="initial" animate="animate">
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      } focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-white/30`}
                      placeholder="أحمد محمد"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </motion.div>
                )}

                {!isLogin && userType === 'client' && (
                  <motion.div variants={fadeInUp} initial="initial" animate="animate">
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      اسم الشركة
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.companyName ? 'border-red-500' : 'border-white/10'
                      } focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-white/30`}
                      placeholder="شركة التقنية العربية"
                    />
                    {errors.companyName && (
                      <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>
                    )}
                  </motion.div>
                )}

                <motion.div variants={fadeInUp} initial="initial" animate="animate">
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    } focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-white/30`}
                    placeholder="ahmed@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp} initial="initial" animate="animate">
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                      errors.password ? 'border-red-500' : 'border-white/10'
                    } focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-white/30`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                  )}
                </motion.div>

                {!isLogin && (
                  <motion.div variants={fadeInUp} initial="initial" animate="animate">
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                      } focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-white/30`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </motion.div>
                )}

                {!isLogin && userType === 'developer' && (
                  <>
                    <motion.div variants={fadeInUp} initial="initial" animate="animate">
                      <label className="block text-sm font-semibold text-white/70 mb-2">
                        التخصص
                      </label>
                      <select
                        name="track"
                        value={formData.track}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.track ? 'border-red-500' : 'border-white/10'
                        } focus:border-indigo-500 focus:outline-none transition-colors text-white`}
                      >
                        <option value="" className="bg-gray-900">اختر تخصصك</option>
                        {TRACKS.map(track => (
                          <option key={track.value} value={track.value} className="bg-gray-900">
                            {track.icon} {track.label}
                          </option>
                        ))}
                      </select>
                      {errors.track && (
                        <p className="text-red-400 text-xs mt-1">{errors.track}</p>
                      )}
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="initial" animate="animate">
                      <label className="block text-sm font-semibold text-white/70 mb-2">
                        سنوات الخبرة
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.experience ? 'border-red-500' : 'border-white/10'
                        } focus:border-indigo-500 focus:outline-none transition-colors text-white`}
                      >
                        <option value="" className="bg-gray-900">اختر سنوات الخبرة</option>
                        {EXPERIENCE_LEVELS.map(level => (
                          <option key={level.value} value={level.value} className="bg-gray-900">
                            {level.label}
                          </option>
                        ))}
                      </select>
                      {errors.experience && (
                        <p className="text-red-400 text-xs mt-1">{errors.experience}</p>
                      )}
                    </motion.div>
                  </>
                )}

                {isLogin && (
                  <div className="text-left">
                    <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center text-sm text-white/40">
                {isLogin ? (
                  <p>
                    ليس لديك حساب؟{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-indigo-400 font-semibold hover:text-indigo-300"
                    >
                      إنشاء حساب الآن
                    </button>
                  </p>
                ) : (
                  <p>
                    لديك حساب بالفعل؟{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-indigo-400 font-semibold hover:text-indigo-300"
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}