/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function VerifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyAccount, resendVerification } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const emailFromUrl = queryParams.get('email') || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']); // ✅ 6 أرقام بدل 10
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState(emailFromUrl || '');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 5) { // ✅ 5 بدل 9
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6); // ✅ 6 بدل 10
    if (/^[0-9]{6}$/.test(pastedData)) { // ✅ 6 بدل 10
      const digits = pastedData.split('');
      setCode(digits);
      if (inputRefs.current[5]) { // ✅ 5 بدل 9
        inputRefs.current[5].focus();
      }
    }
  };

 const handleVerify = async (e) => {
    e.preventDefault();
    
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('يرجى إدخال رمز التحقق الكامل (6 أرقام)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyAccount(email, fullCode);
      console.log('✅ Verify response:', response);
      
      // ✅ نجاح
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Verify error:', err);
      
      // ✅ لو الخطأ "تم تفعيل الاكونت بنجاح" - نعتبره نجاح
      const errorMessage = err?.message || err?.response?.data?.message || '';
      
      if (errorMessage.includes('تم تفعيل') || errorMessage.includes('تفعيل') || errorMessage.includes('نجاح')) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(errorMessage || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      const response = await resendVerification(email);
      console.log('✅ Resend response:', response);
      
      if (response && response.success) {
        setResendTimer(60);
        alert('تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني');
      } else {
        setError(response?.message || 'حدث خطأ أثناء إعادة الإرسال');
      }
    } catch (err) {
      console.error('❌ Resend error:', err);
      setError(err?.message || 'حدث خطأ أثناء إعادة إرسال الرمز');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen flex flex-col relative" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <Navbar />

      <main className="flex-grow relative flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🔐
              </motion.div>
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                تفعيل الحساب
              </h1>
              <p className="text-gray-500 text-sm">
                أدخل رمز التحقق المكون من 6 أرقام المرسل إلى بريدك الإلكتروني
              </p>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center"
              >
                <span className="text-2xl block mb-1">✅</span>
                تم تفعيل حسابك بنجاح! جاري تحويلك لصفحة تسجيل الدخول...
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  أدخل رمز التفعيل
                </label>
                {/* ✅ بداية من الشمال - dir="ltr" */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center gap-2"
                  dir="ltr"
                  onPaste={handlePaste}
                >
                  {code.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      variants={fadeInUp}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 focus:border-indigo-500 focus:outline-none transition-all duration-300 ${
                        error ? 'border-red-500' : 'border-gray-200'
                      } bg-white/50 backdrop-blur-sm`}
                      disabled={loading || success}
                    />
                  ))}
                </motion.div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  يمكنك لصق الرمز بالكامل Ctrl+V
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all duration-300 ${
                  loading || success ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : success ? (
                  '✅ تم التفعيل'
                ) : (
                  'تفعيل الحساب 🚀'
                )}
              </motion.button>
            </form>

            {/* ✅ زر إعادة الإرسال */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || loading}
                className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
              >
                {resendTimer > 0 
                  ? `إعادة إرسال الرمز بعد ${resendTimer} ثانية`
                  : 'إعادة إرسال الرمز 🔄'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600 transition">
                ← العودة إلى تسجيل الدخول
              </Link>
            </div>

            {email && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-lg">📧</span>
                  <span>تم إرسال الرمز إلى:</span>
                  <span className="font-semibold text-gray-700">{email}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}