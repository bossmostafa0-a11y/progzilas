import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function HowItWorks() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const steps = [
    {
      number: '01',
      title: 'سجل مجاناً',
      description: 'أنشئ حسابك كمبرمج أو عميل في دقيقة واحدة فقط',
      icon: '📝',
      color: 'from-blue-500 to-cyan-500',
      details: 'اختر نوع حسابك (مبرمج أو عميل)، املأ بياناتك الأساسية، وابدأ رحلتك مع DevHire.'
    },
    {
      number: '02',
      title: 'اعرض مشروعك أو ابحث عن مبرمج',
      description: 'مبرمج: ارفع مشروعك للبيع | عميل: انشر متطلباتك',
      icon: '🔍',
      color: 'from-purple-500 to-pink-500',
      details: 'المبرمجون يعرضون مشاريعهم للبيع، والعملاء ينشرون متطلباتهم ويستلمون عروضاً فورية.'
    },
    {
      number: '03',
      title: 'احصل على عروض وابدأ العمل',
      description: 'استلم العروض، وافق على العرض، وابدأ رحلة النجاح',
      icon: '🚀',
      color: 'from-green-500 to-emerald-500',
      details: 'تواصل مع العميل أو المبرمج، واتفق على التفاصيل، وابدأ العمل على مشروعك.'
    }
  ];

  const developerSteps = [
    { icon: '💼', title: 'اعمل مرة واحدة', desc: 'قم ببناء مشروعك البرمجي مرة واحدة فقط' },
    { icon: '🔄', title: 'بعه عدة مرات', desc: 'باع نسخ متعددة من مشروعك لعملاء مختلفين' },
    { icon: '💰', title: 'دخل سلبي', desc: 'حقق أرباحاً مستمرة بدون عمل إضافي' },
    { icon: '📈', title: 'توسع في مشاريعك', desc: 'زد أرباحك بإضافة مشاريع جديدة للمتجر' }
  ];

  const clientSteps = [
    { icon: '🛒', title: 'وفر وقتك', desc: 'اشترِ مشاريع جاهزة بدل بناءها من الصفر' },
    { icon: '💵', title: 'وفر مالك', desc: 'المشاريع الجاهزة أرخص بكثير من التطوير المخصص' },
    { icon: '🔧', title: 'تخصيص كامل', desc: 'يمكن تخصيص المشروع حسب احتياجاتك' },
    { icon: '⚡', title: 'تنفيذ سريع', desc: 'استلم مشروعك في غضون أيام وليس أشهر' }
  ];

  const benefits = [
    { icon: '🎯', title: 'منصة متخصصة', desc: '100% للمبرمجين العرب' },
    { icon: '🛡️', title: 'ضمان وحماية', desc: 'نظام مراحل دفع آمن' },
    { icon: '🤝', title: 'دعم فني', desc: 'فريق دعم متواصل' },
    { icon: '🌍', title: 'مجتمع', desc: 'شبكة تواصل احترافية' }
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              كيف يعمل <span className="text-yellow-400">DevHire</span>؟
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              منصة متكاملة تجمع بين المبرمجين والعملاء في مكان واحد
            </p>
          </motion.div>
        </div>

        {/* Steps Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                ثلاث خطوات بسيطة <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">للبدء</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600">
                ابدأ رحلتك مع DevHire في 3 خطوات فقط
              </motion.p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 -translate-y-1/2"></div>
              
              <div className="grid md:grid-cols-3 gap-8 relative">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={controls}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group"
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-black text-xl shadow-lg rotate-45 group-hover:rotate-0 transition-all duration-300`}>
                        <span className="-rotate-45 group-hover:rotate-0 transition-all duration-300">{step.number}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-5xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{step.description}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">{step.details}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* For Developers Section */}
        <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">للمبرمجين</span>
              </h2>
              <p className="text-xl text-gray-600">كيف تستفيد من DevHire كمبرمج؟</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {developerSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all hover:scale-105">
                سجل كمبرمج الآن 🚀
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* For Clients Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">لأصحاب المشاريع</span>
              </h2>
              <p className="text-xl text-gray-600">كيف تستفيد من DevHire كعميل؟</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {clientSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all hover:scale-105">
                سجل كعميل الآن 🏢
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                مميزات <span className="text-yellow-400">DevHire</span>
              </h2>
              <p className="text-xl text-white/90">لماذا تختار DevHire؟</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white border border-white/20"
                >
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-white/80 text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                جاهز تبدأ رحلتك؟
              </h3>
              <p className="text-lg opacity-90 mb-8">
                انضم إلى آلاف المبرمجين والعملاء الذين يثقون في DevHire
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">
                  ابدأ مجاناً الآن ✨
                </Link>
                <Link to="/pricing" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">
                  اطلب الخطة المناسبة 📋
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}