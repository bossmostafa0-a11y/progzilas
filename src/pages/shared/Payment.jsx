/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { requestWithdraw } from '../../services/develper.service.js';

export default function Payment() {
  const { user, isDeveloper } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(null);
  
  // Payment Data
  const [paymentData, setPaymentData] = useState({
    amount: '',
    // محافظ إلكترونية
    walletNumber: '',
    walletName: '',
    // InstaPay
    instaPayNumber: '',
    instaPayName: ''
  });

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ دالة مخصصة لرقم الهاتف مع validation
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    setPaymentData({
      ...paymentData,
      [e.target.name]: value
    });
    
    // ✅ التحقق من صحة الرقم
    if (value.length > 0 && value.length < 11) {
      setPhoneError('رقم الهاتف يجب أن يكون 11 رقم');
    } else if (value.length === 11) {
      const prefix = value.substring(0, 3);
      
      if (paymentMethod === 'vodafone_cash' && prefix !== '010') {
        setPhoneError('رقم فودافون كاش يجب أن يبدأ بـ 010');
      } else if (paymentMethod === 'etisalat_cash' && prefix !== '011') {
        setPhoneError('رقم اتصالات كاش يجب أن يبدأ بـ 011');
      } else if (paymentMethod === 'orange_cash' && prefix !== '012') {
        setPhoneError('رقم أورنج كاش يجب أن يبدأ بـ 012');
      } else if (paymentMethod === 'instapay' && !['010', '011', '012'].includes(prefix)) {
        setPhoneError('رقم انستا باي يجب أن يبدأ بـ 010 أو 011 أو 012');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    // ✅ Validation
    if (!paymentData.amount || paymentData.amount <= 0) {
      setErrorMessage('يرجى إدخال المبلغ');
      setLoading(false);
      return;
    }

    // ✅ Validation للرقم
    if (phoneError) {
      setLoading(false);
      return;
    }

    // ✅ تجهيز بيانات الحساب
    let accountData;
    
    if (paymentMethod === 'instapay') {
      if (!paymentData.instaPayNumber || !paymentData.instaPayName) {
        setErrorMessage('يرجى إدخال بيانات انستا باي كاملة');
        setLoading(false);
        return;
      }
      if (paymentData.instaPayNumber.length !== 11) {
        setErrorMessage('رقم انستا باي يجب أن يكون 11 رقم');
        setLoading(false);
        return;
      }
      accountData = {
        number: paymentData.instaPayNumber,
        name: paymentData.instaPayName
      };
    } else {
      // Vodafone, Etisalat, Orange Cash
      if (!paymentData.walletNumber || !paymentData.walletName) {
        setErrorMessage('يرجى إدخال رقم المحفظة والاسم');
        setLoading(false);
        return;
      }
      if (paymentData.walletNumber.length !== 11) {
        setErrorMessage('رقم المحفظة يجب أن يكون 11 رقم');
        setLoading(false);
        return;
      }
      accountData = {
        number: paymentData.walletNumber,
        name: paymentData.walletName
      };
    }

    try {
      const methodMap = {
        'vodafone_cash': 'vodafone_cash',
        'etisalat_cash': 'etisalat_cash',
        'orange_cash': 'orange_cash',
        'instapay': 'instapay'
      };

      console.log('📤 Sending withdraw request:', {
        amount: Number(paymentData.amount),
        method: methodMap[paymentMethod],
        account: accountData
      });

      // ✅ إرسال الطلب للباك إند
      const response = await requestWithdraw({
        amount: Number(paymentData.amount),
        method: methodMap[paymentMethod],
        account: accountData.name ,
        phone: accountData.number
      });

      console.log('✅ Withdraw response:', response);

      // ✅ تخزين الرصيد الجديد من الـ response
      const updatedBalance = response?.data?.availableBalance || response?.availableBalance;
      if (updatedBalance !== undefined) {
        setNewBalance(updatedBalance);
      }

      setPaymentSuccess(true);
      setTimeout(() => {
        if (isDeveloper) {
          navigate('/dashboard/developer/earnings');
        } else {
          navigate('/dashboard/client/purchases');
        }
      }, 2500);

    } catch (error) {
      console.error('❌ Payment error:', error);
      setErrorMessage(error?.response?.data?.message || 'فشلت عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: '📱', color: 'from-red-500 to-red-600', colorBg: 'bg-red-50 border-red-200', colorText: 'text-red-700', prefix: '010' },
    { id: 'etisalat_cash', name: 'اتصالات كاش', icon: '📱', color: 'from-green-500 to-green-600', colorBg: 'bg-green-50 border-green-200', colorText: 'text-green-700', prefix: '011' },
    { id: 'orange_cash', name: 'أورنج كاش', icon: '📱', color: 'from-orange-500 to-orange-600', colorBg: 'bg-orange-50 border-orange-200', colorText: 'text-orange-700', prefix: '012' },
    { id: 'instapay', name: 'انستا باي', icon: '🏦', color: 'from-purple-500 to-purple-600', colorBg: 'bg-purple-50 border-purple-200', colorText: 'text-purple-700', prefix: '010/011/012' }
  ];

  const getMethodName = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    return method?.name || '';
  };

  const getPlaceholder = (id) => {
    const placeholders = {
      'vodafone_cash': '010xxxxxxxx',
      'etisalat_cash': '011xxxxxxxx',
      'orange_cash': '012xxxxxxxx',
      'instapay': '010xxxxxxxx أو 011xxxxxxxx أو 012xxxxxxxx'
    };
    return placeholders[id] || '01xxxxxxxxx';
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-5xl">✅</span></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم تقديم طلب السحب بنجاح!</h2>
            <p className="text-gray-500">
              {newBalance !== null 
                ? `الرصيد المتبقي: $${newBalance.toLocaleString()}`
                : 'جاري تحويلك...'}
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">سحب الأرباح 💰</h1>
            <p className="text-gray-500 mt-2">اختر طريقة السحب المناسبة لك</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-gray-800 mb-4">طرق السحب</h3>
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  variants={fadeInUp}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setStep(2);
                    setErrorMessage('');
                    setPhoneError('');
                    setPaymentData({ ...paymentData, walletNumber: '', instaPayNumber: '' });
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${paymentMethod === method.id ? `${method.colorBg} border-2` : 'border-gray-200 hover:border-indigo-300'}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-white text-xl`}>{method.icon}</div>
                  <div className="text-right">
                    <div className={`font-semibold ${paymentMethod === method.id ? method.colorText : 'text-gray-800'}`}>{method.name}</div>
                    <div className="text-xs text-gray-500">يبدأ بـ {method.prefix}</div>
                  </div>
                  {paymentMethod === method.id && <span className={`mr-auto ${method.colorText}`}>✓</span>}
                </motion.button>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {step === 1 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">اختر طريقة السحب</h3>
                    <p className="text-gray-500">يرجى اختيار طريقة السحب من القائمة</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                      <button onClick={() => setStep(1)} className="text-indigo-600 hover:text-indigo-700">← العودة</button>
                      <h3 className="text-xl font-bold text-gray-800">السحب عبر {getMethodName(paymentMethod)}</h3>
                    </div>

                    {errorMessage && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{errorMessage}</motion.div>
                    )}

                    {/* Amount Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">المبلغ <span className="text-red-500">*</span></label>
                      <input type="number" name="amount" value={paymentData.amount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="أدخل المبلغ الذي تريد سحبه" />
                    </div>

                    {/* Wallet Cash Form */}
                    {(paymentMethod === 'vodafone_cash' || paymentMethod === 'etisalat_cash' || paymentMethod === 'orange_cash') && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">رقم المحفظة <span className="text-red-500">*</span></label>
                          <input type="tel" name="walletNumber" value={paymentData.walletNumber} onChange={handlePhoneChange} maxLength={11} className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${phoneError ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'} focus:outline-none`} placeholder={getPlaceholder(paymentMethod)} />
                          {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                          <p className="text-xs text-gray-400 mt-1">يجب أن يتكون من 11 رقم</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم على المحفظة <span className="text-red-500">*</span></label>
                          <input type="text" name="walletName" value={paymentData.walletName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="الاسم المسجل في المحفظة" />
                        </div>
                      </motion.div>
                    )}

                    {/* InstaPay Form */}
                    {paymentMethod === 'instapay' && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف (انستا باي) <span className="text-red-500">*</span></label>
                          <input type="tel" name="instaPayNumber" value={paymentData.instaPayNumber} onChange={handlePhoneChange} maxLength={11} className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${phoneError ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'} focus:outline-none`} placeholder={getPlaceholder(paymentMethod)} />
                          {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                          <p className="text-xs text-gray-400 mt-1">يجب أن يبدأ بـ 010 أو 011 أو 012</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم في انستا باي <span className="text-red-500">*</span></label>
                          <input type="text" name="instaPayName" value={paymentData.instaPayName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none" placeholder="الاسم المسجل في انستا باي" />
                        </div>
                      </motion.div>
                    )}

                   

                    <button onClick={handlePayment} disabled={loading || !paymentData.amount || phoneError} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>جاري معالجة الطلب...</div>
                      ) : 'تأكيد السحب ✓'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}