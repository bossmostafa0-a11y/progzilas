import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { forgotPassword } from '../../services/authService.js';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }
    if (!email.includes('@')) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }
    
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'فشل في إرسال طلب استعادة كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow relative overflow-hidden">
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
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl mb-4"
              >
                🔐
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">نسيت كلمة المرور؟</h1>
              <p className="text-gray-500 text-sm">
                أدخل بريدك الإلكتروني وسنرسل لك كلمة مرور جديدة
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="text-6xl">📧</div>
                <div className="p-4 bg-green-100 text-green-700 rounded-xl">
                  <p className="font-bold">تم الإرسال بنجاح!</p>
                  <p className="text-sm mt-1">
                    تم إرسال كلمة مرور جديدة إلى
                  </p>
                  <p className="font-semibold">{email}</p>
                </div>
                <p className="text-gray-500 text-sm">جاري تحويلك لصفحة تسجيل الدخول...</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${error ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:outline-none transition-all`}
                    placeholder="example@domain.com"
                  />
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
                    'إرسال كلمة مرور جديدة 📧'
                  )}
                </button>
              </motion.form>
            )}

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