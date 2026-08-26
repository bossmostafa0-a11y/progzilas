/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { createVipSubscription, getSubscription } from '../../services/payment.service';

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, ] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPlan, setCurrentPlan] = useState('free');
  const [isVipActive, setIsVipActive] = useState(false);

  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.username || user?.name || '');

  const ACCOUNT_NUMBER = import.meta.env.phone || "01002589923";

  // ✅ الحل النهائي: كل اللوجيك جوا useEffect من غير استدعاء دالة خارجية
  useEffect(() => {
    if (!isAuthenticated) return;

    // إنشاء AbortController للإلغاء عند الخروج من الصفحة
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await getSubscription();
        if (response?.data?.subscription) {
          const sub = response.data.subscription;
          setCurrentPlan(sub.plan);
          setIsVipActive(sub.plan === 'vip' && sub.status === 'active');
        }
      } catch (error) {
        // تجاهل أخطاء الإلغاء
        if (error.name === 'AbortError') return;
        console.error('Error fetching subscription:', error);
      }
    };

    fetchData();

    // دالة التنظيف عند الخروج من الصفحة
    return () => {
      abortController.abort();
    };
  }, [isAuthenticated]);

  const developerPlans = [
    {
      id: 'starter',
      name: 'المبتدئ',
      icon: '🌟',
      price: { monthly: 0, yearly: 0 },
      description: 'ممتاز للمبتدئين لاستكشاف المنصة',
      features: [
        { included: true, text: 'حساب مجاني مدى الحياة' },
        { included: true, text: 'نشر 3 مشاريع في المتجر' },
        { included: true, text: 'استقبال عروض المشاريع' },
        { included: true, text: 'لا يمكنك التقديم علي المشاريع' },
      ],
      recommended: false,
      buttonText: 'ابدأ مجاناً',
    },
    {
      id: 'pro',
      name: 'المحترف',
      icon: '💎',
      price: { monthly: 450, yearly: 450 },
      description: 'للراغبين في التوسع وزيادة الأرباح',
      features: [
        { included: true, text: 'نشر غير محدود للمشاريع' },
        { included: true, text: 'دعم فني 24/7' },
        { included: true, text: 'تحديد أولوية في البحث' },
        { included: true, text: 'الوصول للعملاء المميزين' },
        { included: true, text: 'بامكانك البداء في مشاريع العملاء' }
      ],
      recommended: true,
      buttonText: 'اختر الخطة',
    },
  ];

  const handleSelectPlan = (plan, type) => {
    if (!isAuthenticated) {
      setSelectedPlan({ ...plan, type });
      setShowModal(true);
      return;
    }

    if (plan.price.monthly === 0) {
      alert(`✅ تم تفعيل خطة "${plan.name}" لك بنجاح!`);
      return;
    }

    if (isVipActive) {
      alert('🎉 أنت مشترك بالفعل في الخطة المدفوعة!');
      return;
    }

    setSelectedPlan({ ...plan, type });
    setShowModal(true);
  };

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  };

  const getPriceDisplay = (plan) => {
    const price = getPrice(plan);
    if (price === 0) return 'مجاني';
    return `${price} ج.م`;
  };

  const getPeriodText = () => {
    return billingCycle === 'monthly' ? '/شهر' : '/سنة';
  };

  const handlePaymentSubmit = async () => {
    if (!senderPhone || !name) {
      alert("من فضلك اكتب اسمك ورقم تليفونك");
      return;
    }

    setLoading(true);

    try {
      const payload = { senderPhone, name };
      const response = await createVipSubscription(payload);
      
      if (response.success) {
        const paymentRef = response?.data?.payment?.reference || 'لم يتم تحديده';
        const paymentNumber = response?.data?.payment?.paymentNumber || 'لم يتم تحديده';

        alert(`✅ تم إنشاء طلب اشتراك VIP بنجاح!
        
        - المبلغ: 450 ج.م
        - رقم التحويل: ${paymentRef}
        - رقم العملية: ${paymentNumber}
        
        برجاء تحويل المبلغ على الرقم: ${ACCOUNT_NUMBER}
        سيتم تفعيل اشتراكك فور تأكيد الدفع من الإدارة.`);
        
        setShowModal(false);
        setSenderPhone('');
        setName('');
        setSelectedPlan(null);
        
        // تحديث الحالة يدوياً بعد نجاح الطلب
        const updatedResponse = await getSubscription();
        if (updatedResponse?.data?.subscription) {
          const sub = updatedResponse.data.subscription;
          setCurrentPlan(sub.plan);
          setIsVipActive(sub.plan === 'vip' && sub.status === 'active');
        }
      } else {
        alert(response.message || 'حدث خطأ أثناء إنشاء الطلب');
      }
    } catch (error) {
      console.error("❌ خطأ:", error);
      const errorMsg = error?.response?.data?.message || error?.message || 'حدث خطأ في الاتصال بالباك إند';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20" dir="rtl">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              خطط <span className="text-yellow-400">تناسب احتياجاتك</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              اختر الخطة المناسبة لك وابدأ رحلتك مع Progzila
            </p>
          </motion.div>
        </div>

        {/* Developer Plans */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                خطط <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">المبرمجين</span>
              </h2>
              <p className="text-xl text-gray-600">اختر الخطة المناسبة لتبدأ رحلة الربح</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-8"
            >
              {developerPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 w-full max-w-[400px] ${
                    plan.recommended ? 'ring-2 ring-indigo-600 relative' : ''
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        الأكثر طلباً
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 text-center border-b border-gray-100">
                    <div className="text-5xl mb-3">{plan.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-indigo-600">{getPriceDisplay(plan)}</span>
                      {getPrice(plan) > 0 && (
                        <span className="text-gray-500 text-sm">{getPeriodText()}</span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && getPrice(plan) > 0 && (
                      <p className="text-xs text-green-600 mt-1">وفر ${Math.round(plan.price.monthly * 12 * 0.2)} سنوياً</p>
                    )}
                  </div>

                  <div className="p-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {feature.included ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-gray-300 text-xl">✕</span>
                          )}
                          <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleSelectPlan(plan, 'developer')}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        getPrice(plan) === 0
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                          : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                أسئلة <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">شائعة</span>
              </h2>
              <p className="text-xl text-gray-600">كل ما تريد معرفته عن خططنا</p>
            </motion.div>

            <div className="space-y-4">
              {[
                { q: 'هل يمكنني تغيير خطتي لاحقاً؟', a: 'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من خلال لوحة التحكم.' },
                { q: 'هل هناك رسوم إضافية؟', a: 'لا، جميع الأسعار تشمل الضرائب والرسوم. لا توجد رسوم خفية.' },
                { q: 'كيف يتم الدفع؟', a: 'نقبل الدفع عبر التحويل البنكي، فودافون كاش .' },
                { q: 'هل يمكنني إلغاء اشتراكي؟', a: 'نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية.' },
                { q: 'ما هي سياسة الاسترداد؟', a: 'نقدم ضمان استرداد الأموال لمدة 10 يوماً إذا لم تكن راضياً عن الخدمة.' }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-bold text-gray-800 text-lg mb-2">❓ {faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                لا تزال لديك أسئلة؟
              </h2>
              <p className="text-lg text-white/90 mb-8">
                فريقنا جاهز للإجابة على جميع استفساراتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="https://wa.me/201019544851" className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">
                  تواصل معنا 📞
                </Link>
                <Link to="/login" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">
                  ابدأ الآن مجاناً 🚀
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!isAuthenticated ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h3 className="text-xl font-bold">تسجيل الدخول مطلوب</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    يرجى تسجيل الدخول لاختيار خطة {selectedPlan.name}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <Link to="/login" className="flex-1">
                    <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">
                      تسجيل الدخول
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    تأكيد اشتراك {selectedPlan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    المبلغ: <span className="font-bold text-indigo-600">450 ج.م</span>
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل (للفاتورة)</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="اكتب اسمك هنا..." 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم التليفون (للتحويل)</label>
                    <input 
                      type="tel" 
                      value={senderPhone} 
                      onChange={(e) => setSenderPhone(e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="01012345678" 
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">برجاء تحويل المبلغ على الرقم التالي:</p>
                    <p className="text-lg font-bold text-indigo-700 break-all">{ACCOUNT_NUMBER}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className={`flex-1 py-3 rounded-xl font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'}`}
                  >
                    {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}