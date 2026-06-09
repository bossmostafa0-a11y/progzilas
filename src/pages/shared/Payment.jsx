import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Payment() {
  const { user, isDeveloper } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Payment Data
  const [paymentData, setPaymentData] = useState({
    amount: '',
    purpose: '',
    // Vodafone Cash
    vodafoneNumber: '',
    // Bank Transfer
    bankName: '',
    accountNumber: '',
    accountName: '',
    transferImage: null,
    // Card Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentData({
          ...paymentData,
          transferImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        if (isDeveloper) {
          navigate('/dashboard/developer/earnings');
        } else {
          navigate('/dashboard/client/purchases');
        }
      }, 2000);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'vodafone', name: 'فودافون كاش', icon: '📱', color: 'from-red-500 to-orange-500' },
    { id: 'bank', name: 'تحويل بنكي', icon: '🏦', color: 'from-blue-500 to-cyan-500' },
    { id: 'card', name: 'بطاقة ائتمانية', icon: '💳', color: 'from-purple-500 to-pink-500' }
  ];

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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-gray-500">جاري تحويلك...</p>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              إتمام الدفع 💳
            </h1>
            <p className="text-gray-500 mt-2">اختر طريقة الدفع المناسبة لك</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1 space-y-4"
            >
              <h3 className="font-bold text-gray-800 mb-4">طرق الدفع</h3>
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  variants={fadeInUp}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setStep(2);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                    {method.icon}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{method.name}</div>
                    <div className="text-xs text-gray-500">ادفع بسرعة وسهولة</div>
                  </div>
                  {paymentMethod === method.id && (
                    <span className="mr-auto text-indigo-600">✓</span>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {step === 1 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">اختر طريقة الدفع</h3>
                    <p className="text-gray-500">يرجى اختيار طريقة الدفع من القائمة</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                      <button
                        onClick={() => setStep(1)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        ← العودة
                      </button>
                      <h3 className="text-xl font-bold text-gray-800">
                        {paymentMethod === 'vodafone' && 'الدفع عبر فودافون كاش'}
                        {paymentMethod === 'bank' && 'التحويل البنكي'}
                        {paymentMethod === 'card' && 'الدفع عبر البطاقة الائتمانية'}
                      </h3>
                    </div>

                    {/* Amount Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المبلغ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="أدخل المبلغ"
                      />
                    </div>

                    {/* Purpose Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        سبب الدفع <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={paymentData.purpose}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="مثال: شراء مشروع - سحب أرباح"
                      />
                    </div>

                    {/* Vodafone Cash Form */}
                    {paymentMethod === 'vodafone' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم فودافون كاش <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="vodafoneNumber"
                            value={paymentData.vodafoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="01xxxxxxxxx"
                          />
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <p className="text-sm text-blue-700 flex items-center gap-2">
                            <span>ℹ️</span>
                            سيتم إرسال طلب الدفع إلى رقم فودافون كاش الخاص بك
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Bank Transfer Form */}
                    {paymentMethod === 'bank' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم البنك <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={paymentData.bankName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="البنك الأهلي المصري"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الحساب <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={paymentData.accountNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="رقم الحساب البنكي"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم صاحب الحساب <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="accountName"
                            value={paymentData.accountName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="الاسم كما في البنك"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            إيصال التحويل <span className="text-red-500">*</span>
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-500 transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="transferImage"
                            />
                            <label htmlFor="transferImage" className="cursor-pointer">
                              <div className="text-2xl mb-2">📎</div>
                              <p className="text-gray-500 text-sm">اضغط لرفع إيصال التحويل</p>
                            </label>
                          </div>
                          {paymentData.transferImage && (
                            <div className="mt-2 text-sm text-green-600">✓ تم رفع الإيصال</div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم البطاقة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الاسم على البطاقة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={paymentData.cardName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            placeholder="الاسم كما على البطاقة"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              تاريخ الانتهاء <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={paymentData.expiryDate}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={paymentData.cvv}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                              placeholder="123"
                              maxLength="4"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Bank Account Info for withdrawals */}
                    {isDeveloper && paymentMethod && (
                      <div className="bg-gray-50 rounded-xl p-4 mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2 mb-2">معلومات الحساب البنكي لاستلام الأموال</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">اسم البنك:</span> البنك الأهلي المصري</p>
                          <p><span className="text-gray-500">رقم الحساب:</span> 123456789</p>
                          <p><span className="text-gray-500">اسم صاحب الحساب:</span> {user?.name || 'أحمد محمد'}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handlePayment}
                      disabled={loading || !paymentData.amount}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري معالجة الدفع...
                        </div>
                      ) : (
                        'تأكيد الدفع ✓'
                      )}
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