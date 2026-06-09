import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Pricing() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Developer Plans
  const developerPlans = [
    {
      id: 'starter',
      name: 'المبتدئ',
      icon: '🌟',
      price: {
        monthly: 0,
        yearly: 0
      },
      description: 'ممتاز للمبتدئين لاستكشاف المنصة',
      features: [
        { included: true, text: 'حساب مجاني مدى الحياة' },
        { included: true, text: 'نشر 3 مشاريع في المتجر' },
        { included: true, text: 'استقبال عروض المشاريع' },
        { included: true, text: 'عمولة المنصة 15%' },
        { included: false, text: 'دعم فني 24/7' },
        { included: false, text: 'إحصائيات متقدمة' },
        { included: false, text: 'تحديد أولوية في البحث' }
      ],
      recommended: false,
      buttonText: 'ابدأ مجاناً',
      buttonLink: '/login'
    },
    {
      id: 'pro',
      name: 'المحترف',
      icon: '💎',
      price: {
        monthly: 29,
        yearly: 290
      },
      description: 'للراغبين في التوسع وزيادة الأرباح',
      features: [
        { included: true, text: 'نشر غير محدود للمشاريع' },
        { included: true, text: 'عمولة المنصة 10%' },
        { included: true, text: 'دعم فني 24/7' },
        { included: true, text: 'إحصائيات وتحليلات متقدمة' },
        { included: true, text: 'تحديد أولوية في البحث' },
        { included: true, text: 'الوصول للعملاء المميزين' },
        { included: true, text: 'إشعارات فورية' }
      ],
      recommended: true,
      buttonText: 'اختر الخطة',
      buttonLink: '/login'
    },
    {
      id: 'business',
      name: 'الأعمال',
      icon: '👑',
      price: {
        monthly: 99,
        yearly: 990
      },
      description: 'للشركات والمكاتب التقنية',
      features: [
        { included: true, text: 'جميع مميزات الخطة المحترف' },
        { included: true, text: 'عمولة المنصة 5%' },
        { included: true, text: 'حسابات فرعية لأعضاء الفريق' },
        { included: true, text: 'استشارات تسويقية مجانية' },
        { included: true, text: 'عرض مميز في الصفحة الرئيسية' },
        { included: true, text: 'دعم فني أولوية VIP' },
        { included: true, text: 'تقرير شهري مخصص' }
      ],
      recommended: false,
      buttonText: 'اختر الخطة',
      buttonLink: '/login'
    }
  ];

  // Client Plans
  const clientPlans = [
    {
      id: 'basic',
      name: 'الأساسية',
      icon: '📋',
      price: {
        monthly: 0,
        yearly: 0
      },
      description: 'للاستخدام الأساسي للمنصة',
      features: [
        { included: true, text: 'نشر مشروع واحد شهرياً' },
        { included: true, text: 'استقبال 5 عروض لكل مشروع' },
        { included: true, text: 'دعم فني عادي' },
        { included: false, text: 'مشاريع غير محدودة' },
        { included: false, text: 'عروض غير محدودة' },
        { included: false, text: 'دعم فني VIP' }
      ],
      recommended: false,
      buttonText: 'ابدأ مجاناً',
      buttonLink: '/login'
    },
    {
      id: 'business',
      name: 'الأعمال',
      icon: '🏢',
      price: {
        monthly: 49,
        yearly: 490
      },
      description: 'للشركات والمؤسسات',
      features: [
        { included: true, text: 'مشاريع غير محدودة' },
        { included: true, text: 'عروض غير محدودة' },
        { included: true, text: 'دعم فني 24/7' },
        { included: true, text: 'إدارة مشاريع متكاملة' },
        { included: true, text: 'تقارير وإحصائيات' },
        { included: true, text: 'أولوية في البحث' }
      ],
      recommended: true,
      buttonText: 'اختر الخطة',
      buttonLink: '/login'
    },
    {
      id: 'enterprise',
      name: 'الشركات',
      icon: '👑',
      price: {
        monthly: 199,
        yearly: 1990
      },
      description: 'للشركات الكبرى والمؤسسات الحكومية',
      features: [
        { included: true, text: 'جميع مميزات خطة الأعمال' },
        { included: true, text: 'حسابات فرعية للموظفين' },
        { included: true, text: 'تكامل مع أنظمتك' },
        { included: true, text: 'مدير حساب مخصص' },
        { included: true, text: 'تدريب فريق العمل' },
        { included: true, text: 'تقرير شهري مخصص' },
        { included: true, text: 'خصم خاص على المشاريع الجاهزة' }
      ],
      recommended: false,
      buttonText: 'اتصل بنا',
      buttonLink: '/contact'
    }
  ];

  const handleSelectPlan = (plan, type) => {
    if (!user) {
      setSelectedPlan({ ...plan, type });
      setShowModal(true);
    } else {
      // Logged in user
      alert(`جاري التوجه لصفحة الدفع للخطة ${plan.name}`);
    }
  };

  const getPrice = (plan) => {
    if (billingCycle === 'monthly') {
      return plan.price.monthly;
    } else {
      return plan.price.yearly;
    }
  };

  const getPriceDisplay = (plan) => {
    const price = getPrice(plan);
    if (price === 0) return 'مجاني';
    return `$${price}`;
  };

  const getPeriodText = () => {
    return billingCycle === 'monthly' ? '/شهر' : '/سنة';
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
    <div className="min-h-screen flex flex-col" dir="rtl">
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
              اختر الخطة المناسبة لك وابدأ رحلتك مع DevHire
            </p>
          </motion.div>
        </div>

        {/* Billing Toggle */}
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center gap-4">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-gray-500'}`}>
                شهرية
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 bg-gray-200 rounded-full transition-colors duration-300 focus:outline-none"
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-indigo-600 rounded-full transition-transform duration-300 ${
                    billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-gray-500'}`}>
                سنوية
                <span className="mr-2 text-xs text-green-600 bg-green-100 px-1 rounded">وفر 20%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Developer Plans */}
        <div className="py-16 bg-gray-50">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {developerPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
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

        {/* Client Plans */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                خطط <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">العملاء</span>
              </h2>
              <p className="text-xl text-gray-600">اختر الخطة المناسبة لتحصل على أفضل المبرمجين</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {clientPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
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
                      onClick={() => handleSelectPlan(plan, 'client')}
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
                { q: 'كيف يتم الدفع؟', a: 'نقبل الدفع عبر البطاقات الائتمانية، التحويل البنكي، فودافون كاش، و Binance Pay.' },
                { q: 'هل يمكنني إلغاء اشتراكي؟', a: 'نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية.' },
                { q: 'ما هي سياسة الاسترداد؟', a: 'نقدم ضمان استرداد الأموال لمدة 30 يوماً إذا لم تكن راضياً عن الخدمة.' }
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
                <Link to="/contact" className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">
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

      {/* Login Modal */}
      
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
            </motion.div>
          </motion.div>
        )}


      <Footer />
    </div>
  );
}