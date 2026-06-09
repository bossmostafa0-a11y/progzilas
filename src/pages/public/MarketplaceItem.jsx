import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function MarketplaceItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - All projects from marketplace
  const allProjects = {
    1: {
      id: 1,
      name: 'نظام إدارة المستشفيات الذكي',
      description: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى، المواعيد، الغرف، والموظفين مع لوحة تحكم متقدمة وتقارير لحظية.',
      fullDescription: `نظام إدارة المستشفيات الذكي هو حل متكامل لإدارة جميع جوانب المستشفى رقمياً. تم بناء النظام باستخدام أحدث التقنيات لضمان أعلى مستويات الأداء والأمان.

المميزات الرئيسية للنظام:
• إدارة كاملة للمرضى (تسجيل، متابعة، ملفات طبية)
• جدولة المواعيد مع إشعارات تلقائية
• إدارة الغرف والأسرة بالمستشفى
• إدارة الموظفين والأطباء والممرضين
• نظام الفواتير والمدفوعات المتكامل
• تقارير وإحصائيات متقدمة مع رسوم بيانية
• لوحة تحكم تفاعلية للمدير
• نظام أدوار وصلاحيات متكامل
• API مفتوحة للتكامل مع أنظمة أخرى
• دعم اللغة العربية والإنجليزية
• تصميم متجاوب مع جميع الأجهزة

التقنيات المستخدمة:
• React 18 مع Hooks و Context API
• Node.js مع Express
• MongoDB لقاعدة البيانات
• TailwindCSS للتصميم
• JWT للمصادقة
• Socket.io للإشعارات الفورية`,
      developer: 'أحمد المنصوري',
      developerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      developerBio: 'مبرمج Full Stack محترف مع أكثر من 8 سنوات خبرة. عملت على أكثر من 50 مشروع ناجح. متخصص في React و Node.js.',
      developerRating: 4.9,
      developerProjects: 47,
      category: 'نظم إدارة',
      price: 499,
      salesCount: 156,
      rating: 4.9,
      reviews: [
        { user: 'محمد العتيبي', rating: 5, comment: 'نظام رائع جداً، ساعدنا في تنظيم المستشفى بشكل كامل', date: '2024-01-15' },
        { user: 'سارة القحطاني', rating: 4.8, comment: 'الدعم الفني ممتاز والنظام متكامل', date: '2024-01-10' },
        { user: 'عبدالله السالم', rating: 5, comment: 'أفضل نظام إدارة مستشفيات اشتريته', date: '2024-01-05' }
      ],
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800',
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800'
      ],
      demoUrl: 'https://demo.devhire.com/hospital',
      tech: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'Socket.io'],
      features: [
        'إدارة المرضى والملفات الطبية',
        'جدولة المواعيد التلقائية',
        'إدارة الغرف والأسرة',
        'إدارة الموظفين والأطباء',
        'نظام فواتير متكامل',
        'تقارير وإحصائيات متقدمة',
        'لوحة تحكم تفاعلية',
        'نظام أدوار وصلاحيات',
        'API مفتوحة للتكامل',
        'إشعارات فورية'
      ],
      packages: [
        { 
          name: 'Basic', 
          price: 499, 
          delivery: '3 أيام', 
          features: [
            'كود المصدر الكامل',
            'تثبيت على السيرفر',
            'شرح بالفيديو',
            'دعم فني لمدة شهر',
            'تحديثات الأمان لمدة 6 أشهر'
          ],
          recommended: false
        },
        { 
          name: 'Pro', 
          price: 1499, 
          delivery: '7 أيام', 
          features: [
            'كل ما في باقة Basic',
            'تعديل الألوان والشعار',
            'إضافة ميزة واحدة من اختيارك',
            'دعم فني لمدة 3 أشهر',
            'تحديثات مجانية لمدة سنة',
            'تخصيص لوحة التحكم'
          ],
          recommended: true
        },
        { 
          name: 'Enterprise', 
          price: 4999, 
          delivery: '30 يوم', 
          features: [
            'كل ما في باقة Pro',
            'بناء مخصص كامل حسب احتياجاتك',
            'دعم فني لمدة سنة',
            'استضافة مجانية لمدة 6 أشهر',
            'تطبيق موبايل (اختياري)',
            'تدريب فريقك'
          ],
          recommended: false
        }
      ],
      faq: [
        { question: 'هل يمكنني تجربة النظام قبل الشراء؟', answer: 'نعم، يمكنك طلب عرض تجريبي مجاني لمدة 7 أيام' },
        { question: 'هل يتطلب النظام استضافة خاصة؟', answer: 'يمكن تثبيته على أي استضافة تدعم Node.js و MongoDB' },
        { question: 'هل يوجد ضمان على المنتج؟', answer: 'نعم، ضمان لمدة 30 يوماً لاسترداد المبلغ' }
      ]
    },
    2: {
      id: 2,
      name: 'منصة تعليمية متكاملة',
      description: 'منصة تعليمية إلكترونية متكاملة تشمل نظام إدارة المحتوى، نظام الفصول الافتراضية، ونظام الامتحانات.',
      fullDescription: `منصة تعليمية متكاملة تتيح إنشاء دورات تعليمية، إدارة الطلاب، وإنشاء امتحانات متقدمة مع نظام تصحيح آلي.

المميزات الرئيسية:
• نظام إدارة المحتوى التعليمي
• دروس فيديو متعددة الجودة
• نظام امتحانات مع تصحيح آلي
• شهادات إلكترونية قابلة للتحميل
• منتدى نقاش للطلاب
• تتبع تقدم الطلاب
• إشعارات فورية
• نظام دفع متكامل`,
      developer: 'يوسف إبراهيم',
      developerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      developerBio: 'مطور تطبيقات ويب وتطبيقات موبايل محترف. خبرة في بناء منصات تعليمية لأكثر من 5 سنوات',
      developerRating: 4.8,
      developerProjects: 38,
      category: 'منصات تعليمية',
      price: 599,
      salesCount: 134,
      rating: 4.8,
      reviews: [
        { user: 'نورة القحطاني', rating: 5, comment: 'منصة رائعة جداً، ساعدتني في إنشاء دوراتي التعليمية', date: '2024-01-12' }
      ],
      images: [
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
      ],
      demoUrl: 'https://demo.devhire.com/education',
      tech: ['Flutter', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
      features: [
        'دروس فيديو متعددة الجودة',
        'نظام امتحانات متقدم',
        'شهادات إلكترونية',
        'منتدى نقاش',
        'تتبع تقدم الطلاب',
        'إشعارات فورية',
        'نظام دفع متكامل',
        'تقارير متقدمة'
      ],
      packages: [
        { name: 'Basic', price: 599, delivery: '3 أيام', features: ['كود المصدر الكامل', 'تثبيت', 'شرح بالفيديو', 'دعم شهر'], recommended: false },
        { name: 'Pro', price: 1799, delivery: '7 أيام', features: ['كل ما في Basic', 'تعديل الشعار', 'إضافة نظام الدفع', 'دعم 3 شهور'], recommended: true },
        { name: 'Enterprise', price: 3999, delivery: '21 يوم', features: ['كل ما في Pro', 'بناء مخصص', 'دعم سنة', 'استضافة'], recommended: false }
      ],
      faq: [
        { question: 'هل يمكنني إضافة دورات غير محدودة؟', answer: 'نعم، يمكنك إضافة عدد غير محدود من الدورات' },
        { question: 'هل يدعم اللغة العربية؟', answer: 'نعم، يدعم اللغة العربية والإنجليزية بالكامل' }
      ]
    },
    3: {
      id: 3,
      name: 'متجر إلكتروني متكامل',
      description: 'متجر إلكتروني احترافي مع نظام دفع متكامل، إدارة منتجات، وعملاء، وتقارير مبيعات متقدمة.',
      fullDescription: `متجر إلكتروني متكامل يوفر لك كل ما تحتاجه لبدء متجرك الإلكتروني بنجاح.

المميزات الرئيسية:
• واجهة مستخدم جذابة وسهلة الاستخدام
• نظام إدارة منتجات متكامل
• سلة مشتريات متطورة
• بوابات دفع متعددة (Stripe, PayPal)
• إدارة العملاء والمستخدمين
• نظام خصومات وكوبونات
• تقارير مبيعات متقدمة
• نظام شحن متكامل
• تصميم متجاوب مع جميع الأجهزة
• SEO مُحسن لمحركات البحث`,
      developer: 'نورة خالد',
      developerAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      developerBio: 'مصممة ومطورة Frontend محترفة، خبرة في بناء المتاجر الإلكترونية',
      developerRating: 4.9,
      developerProjects: 82,
      category: 'متاجر إلكترونية',
      price: 399,
      salesCount: 289,
      rating: 4.9,
      reviews: [],
      images: [
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
      ],
      demoUrl: 'https://demo.devhire.com/ecommerce',
      tech: ['Next.js', 'Stripe', 'Tailwind', 'Prisma', 'PostgreSQL'],
      features: [
        'واجهة مستخدم جذابة',
        'إدارة منتجات',
        'سلة مشتريات',
        'بوابات دفع متعددة',
        'إدارة العملاء',
        'نظام خصومات',
        'تقارير مبيعات',
        'نظام شحن'
      ],
      packages: [
        { name: 'Basic', price: 399, delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'], recommended: false },
        { name: 'Pro', price: 1299, delivery: '7 أيام', features: ['كل ما في Basic', 'إضافة وحدة الدفع', 'تعديل التصميم'], recommended: true }
      ],
      faq: []
    },
    4: {
      id: 4,
      name: 'لوحة تحكم تحليلات متقدمة',
      description: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات مع رسوم بيانية متقدمة وتقارير قابلة للتخصيص.',
      fullDescription: `لوحة تحكم تحليلات متقدمة تعرض بياناتك بشكل تفاعلي وجذاب.

المميزات الرئيسية:
• رسوم بيانية تفاعلية متعددة الأنواع
• إحصائيات فورية
• تقارير قابلة للتخصيص
• تصدير البيانات بصيغ متعددة
• لوحات مخصصة حسب احتياجك
• تحديث فوري للبيانات
• تصميم عصري ومتجاوب`,
      developer: 'عبدالله السالم',
      developerAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      developerBio: 'مهندس DevOps ومطور Full Stack، خبير في تحليل البيانات',
      developerRating: 4.9,
      developerProjects: 108,
      category: 'لوحات تحكم',
      price: 699,
      salesCount: 89,
      rating: 4.9,
      reviews: [],
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800'
      ],
      demoUrl: 'https://demo.devhire.com/dashboard',
      tech: ['React', 'D3.js', 'Firebase', 'Chart.js', 'Tailwind'],
      features: [
        'رسوم بيانية تفاعلية',
        'إحصائيات فورية',
        'تصدير تقارير',
        'لوحات مخصصة',
        'تحديث لحظي',
        'تصميم متجاوب'
      ],
      packages: [
        { name: 'Basic', price: 699, delivery: '5 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'], recommended: false },
        { name: 'Pro', price: 1999, delivery: '14 يوم', features: ['كل ما في Basic', 'API مخصصة', 'دعم فني'], recommended: true }
      ],
      faq: []
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundProject = allProjects[id];
      if (foundProject) {
        setProject(foundProject);
      } else {
        // If project not found, redirect to marketplace
        navigate('/marketplace');
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل المشروع...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow relative">
        {/* Hero Section with Breadcrumb */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
              <Link to="/" className="hover:text-white transition">الرئيسية</Link>
              <span>/</span>
              <Link to="/marketplace" className="hover:text-white transition">المتجر</Link>
              <span>/</span>
              <span className="text-white">{project.name}</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {project.name}
            </motion.h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-2"
            >
              {/* Main Image */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                <img
                  src={project.images[selectedImage]}
                  alt={project.name}
                  className="w-full h-80 md:h-96 object-cover"
                />
              </motion.div>

              {/* Thumbnail Images */}
              {project.images.length > 1 && (
                <motion.div variants={fadeInUp} className="flex gap-3 mb-8 overflow-x-auto pb-2">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${project.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Tabs */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'details', label: 'تفاصيل المشروع', icon: '📋' },
                    { id: 'features', label: 'المميزات', icon: '⭐' },
                    { id: 'packages', label: 'الباقات', icon: '💰' },
                    { id: 'reviews', label: 'التقييمات', icon: '💬' },
                    { id: 'faq', label: 'الأسئلة الشائعة', icon: '❓' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                          : 'text-gray-500 hover:text-indigo-500'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="prose prose-lg max-w-none"
                      >
                        <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                          {project.fullDescription}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'features' && (
                      <motion.div
                        key="features"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        {project.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600">✓</span>
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'packages' && (
                      <motion.div
                        key="packages"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {project.packages.map((pkg, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ y: -5 }}
                              onClick={() => setSelectedPackage(idx)}
                              className={`relative cursor-pointer rounded-2xl p-5 transition-all duration-300 ${
                                selectedPackage === idx
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                                  : 'bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              {pkg.recommended && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                  <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">موصى به</span>
                                </div>
                              )}
                              <h3 className={`text-xl font-bold mb-2 ${selectedPackage === idx ? 'text-white' : 'text-gray-800'}`}>
                                {pkg.name}
                              </h3>
                              <div className={`text-3xl font-bold mb-2 ${selectedPackage === idx ? 'text-white' : 'text-indigo-600'}`}>
                                ${pkg.price}
                              </div>
                              <div className={`text-sm mb-4 ${selectedPackage === idx ? 'text-white/80' : 'text-gray-500'}`}>
                                تسليم في {pkg.delivery}
                              </div>
                              <ul className="space-y-2 text-sm">
                                {pkg.features.slice(0, 4).map((feature, i) => (
                                  <li key={i} className={`flex items-center gap-2 ${selectedPackage === idx ? 'text-white/90' : 'text-gray-600'}`}>
                                    <span>✓</span> {feature}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {project.reviews.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">لا توجد تقييمات بعد. كن أول من يقيم!</p>
                        ) : (
                          project.reviews.map((review, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="border-b border-gray-100 pb-4 last:border-0"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {review.user.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold">{review.user}</div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-sm">{review.rating}</span>
                                    <span className="text-gray-400 text-xs mx-2">|</span>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'faq' && (
                      <motion.div
                        key="faq"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {project.faq.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">لا توجد أسئلة شائعة بعد</p>
                        ) : (
                          project.faq.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="border rounded-xl p-4"
                            >
                              <h4 className="font-bold text-gray-800 mb-2">❓ {item.question}</h4>
                              <p className="text-gray-600 text-sm">📌 {item.answer}</p>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                {/* Price Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-indigo-600">
                      ${project.packages[selectedPackage].price}
                    </div>
                    <div className="text-sm text-gray-500">شامل الضريبة</div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                  >
                    شراء المشروع الآن
                  </motion.button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    أو <Link to="/login" className="text-indigo-600">سجل دخولك</Link> للشراء
                  </div>
                </div>

                {/* Developer Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={project.developerAvatar} alt={project.developer} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                    <div>
                      <h3 className="font-bold text-gray-800">{project.developer}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span>{project.developerRating}</span>
                        <span className="text-gray-400">|</span>
                        <span>{project.developerProjects} مشروع</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{project.developerBio}</p>
                  <Link
                    to={`/dev/${project.developer}`}
                    className="block text-center py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  >
                    عرض بروفايل المطور
                  </Link>
                </motion.div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">معلومات سريعة</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">التصنيف</span>
                      <span className="font-semibold">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">عدد المبيعات</span>
                      <span className="font-semibold">🏆 {project.salesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">التقييم</span>
                      <span className="font-semibold">⭐ {project.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">رابط العرض التجريبي</span>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">عرض تجريبي</a>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold">تأكيد الشراء</h3>
                <p className="text-gray-500 text-sm mt-1">أنت على وشك شراء هذا المشروع</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">المشروع</span>
                  <span className="font-semibold">{project.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">الباقة</span>
                  <span className="font-semibold">{project.packages[selectedPackage].name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">السعر الإجمالي</span>
                  <span className="text-xl font-bold text-indigo-600">${project.packages[selectedPackage].price}</span>
                </div>
              </div>

              <button                onClick={() => {
                  setShowPurchaseModal(false);
                  alert('تم إتمام عملية الشراء بنجاح!');
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                تأكيد الشراء
              </button>

              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-full py-2 mt-3 text-gray-500 hover:text-gray-700 transition text-sm"
              >
                إلغاء
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}