import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: 'البريد الإلكتروني مطلوب' });
      return;
    }
    if (!email.includes('@')) {
      setErrors({ email: 'البريد الإلكتروني غير صحيح' });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setResendTimer(60);
      
      // Start resend timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      alert(`تم إرسال رمز التحقق إلى ${email}`);
    }, 1500);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!code) {
      setErrors({ code: 'رمز التحقق مطلوب' });
      return;
    }
    if (code.length !== 6) {
      setErrors({ code: 'رمز التحقق يجب أن يكون 6 أرقام' });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    if (newPassword.length < 6) newErrors.newPassword = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (!confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResendTimer(60);
      alert('تم إعادة إرسال رمز التحقق');
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl mb-4"
              >
                🔐
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">
                {step === 1 && 'نسيت كلمة المرور؟'}
                {step === 2 && 'تحقق من بريدك الإلكتروني'}
                {step === 3 && 'إنشاء كلمة مرور جديدة'}
              </h1>
              <p className="text-gray-500 text-sm">
                {step === 1 && 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق'}
                {step === 2 && `أدخل الرمز الذي أرسلناه إلى ${email}`}
                {step === 3 && 'أدخل كلمة المرور الجديدة لحسابك'}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center"
              >
                ✅ تم تغيير كلمة المرور بنجاح! جاري التحويل...
              </motion.div>
            )}

            {/* Step 1: Email Form */}
            {step === 1 && (
              <motion.form
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:border-indigo-500 focus:outline-none transition-all`}
                    placeholder="example@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    'إرسال رمز التحقق 📧'
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 2: Verification Code Form */}
            {step === 2 && (
              <motion.form
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                onSubmit={handleVerifyCode}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.code ? 'border-red-500' : 'border-gray-200'
                    } focus:border-indigo-500 focus:outline-none transition-all text-center text-2xl tracking-widest`}
                    placeholder="••••••"
                    maxLength="6"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {resendTimer > 0 
                      ? `إعادة إرسال الكود بعد ${resendTimer} ثانية`
                      : 'إعادة إرسال الكود 🔄'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحقق...
                    </div>
                  ) : (
                    'تحقق من الرمز ✓'
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 3: Reset Password Form */}
            {step === 3 && (
              <motion.form
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-200'
                    } focus:border-indigo-500 focus:outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    } focus:border-indigo-500 focus:outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التغيير...
                    </div>
                  ) : (
                    'تغيير كلمة المرور 🔑'
                  )}
                </button>
              </motion.form>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-700">
                ← العودة إلى تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}