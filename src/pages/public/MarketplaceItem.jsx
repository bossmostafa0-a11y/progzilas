/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getMarketplaceProjectById } from '../../services/cliecnt.service.js';

export default function MarketplaceItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoPreview, setVideoPreview] = useState(true);

  // ✅ تعريف الدالة قبل useEffect
  const getCategoryLabel = (category) => {
    const labels = {
      'management': 'نظم إدارة',
      'ecommerce': 'متاجر إلكترونية',
      'education': 'منصات تعليمية',
      'dashboard': 'لوحات تحكم',
      'mobile': 'تطبيقات موبايل',
      'ai': 'الذكاء الاصطناعي'
    };
    return labels[category] || category || 'أخرى';
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await getMarketplaceProjectById(id);
        
        let data = response;
        if (typeof data === 'string') data = JSON.parse(data);
        
        const projectData = data?.data?.project || data?.project || data?.data;
        
        if (!projectData) {
          setError('المشروع غير موجود');
          return;
        }
        
        // تحويل الباقات
        const packages = [];
        if (projectData.basic) {
          packages.push({
            name: 'Basic',
            price: projectData.basic.price || 0,
            delivery: `${projectData.basic.deliveryTime || 3} أيام`,
            features: projectData.basic.features || ['كود المصدر', 'التثبيت', 'شرح بالفيديو'],
            recommended: false
          });
        }
        if (projectData.pro) {
          packages.push({
            name: 'Pro',
            price: projectData.pro.price || 0,
            delivery: `${projectData.pro.deliveryTime || 7} أيام`,
            features: projectData.pro.features || [],
            recommended: true
          });
        }
        if (projectData.enterprise) {
          packages.push({
            name: 'Enterprise',
            price: projectData.enterprise.price || 0,
            delivery: `${projectData.enterprise.deliveryTime || 30} يوم`,
            features: projectData.enterprise.features || [],
            recommended: false
          });
        }
        
        if (packages.length === 1) {
          packages[0].recommended = true;
          setSelectedPackage(0);
        } else if (packages.length === 2) {
          setSelectedPackage(1);
        }
        
        const mappedProject = {
          id: projectData._id,
          name: projectData.projectName || '',
          description: projectData.shortDescription || '',
          fullDescription: projectData.fullDescription || projectData.shortDescription || '',
          developer: projectData.owner?.username || 'مطور',
          developerAvatar: projectData.owner?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          developerBio: projectData.owner?.bio || '',
          developerRating: projectData.owner?.rating || 0,
          developerProjects: data.data.countprojects || 0,
          category: getCategoryLabel(projectData.category),
          price: packages[selectedPackage]?.price || packages[0]?.price || 0,
          salesCount: projectData.salesCount || 0,
          rating: projectData.rating || 0,
          reviews: [],
          images: projectData.images || [],
          videoUrl: projectData.videoUrl || '',
          demoUrl: projectData.demoUrl || '',
          tech: projectData.technologies || [],
          features: projectData.mainFeatures || [],
          packages: packages,
          faq: [],
          license: projectData.license || '',
          supportPeriod: projectData.supportPeriod || '',
          updatesPeriod: projectData.updatesPeriod || ''
        };
        
        setProject(mappedProject);
      } catch (err) {
        console.error('❌ Error loading project:', err);
        setError('حدث خطأ في تحميل المشروع');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadProject();
  }, [id]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
        setVideoPreview(false);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setVideoPreview(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
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

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{error || 'المشروع غير موجود'}</h3>
            <Link to="/marketplace" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              العودة للمتجر
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              {/* Main Image/Video */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                {project.videoUrl && selectedImage === 0 ? (
                  <div className="relative w-full h-80 md:h-96 bg-black">
                    <video
                      ref={videoRef}
                      src={project.videoUrl}
                      className="w-full h-full object-contain"
                      onEnded={handleVideoEnded}
                      controls={!videoPreview}
                    />
                    {videoPreview && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={handlePlayVideo}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                    {!videoPreview && !isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={handlePlayVideo}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                      <span>🎬</span>
                      <span>فيديو توضيحي</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={project.images[project.videoUrl ? selectedImage - 1 : selectedImage] || project.images[0]}
                    alt={project.name}
                    className="w-full h-80 md:h-96 object-cover"
                  />
                )}
              </motion.div>

              {/* Thumbnails - فيديو + صور */}
              <motion.div variants={fadeInUp} className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {project.videoUrl && (
                  <button
                    onClick={() => { setSelectedImage(0); setVideoPreview(true); setIsVideoPlaying(false); }}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === 0 ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] px-1 rounded">🎬</div>
                  </button>
                )}
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { 
                      setSelectedImage(project.videoUrl ? idx + 1 : idx); 
                      setVideoPreview(false); 
                      setIsVideoPlaying(false); 
                    }}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === (project.videoUrl ? idx + 1 : idx) ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${project.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>

              {/* Tabs */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'details', label: 'تفاصيل المشروع', icon: '📋' },
                    { id: 'features', label: 'المميزات', icon: '⭐' },
                    { id: 'packages', label: 'الباقات', icon: '💰' },
                    { id: 'reviews', label: 'التقييمات', icon: '💬' },
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
                      <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-line text-gray-600 leading-relaxed">{project.fullDescription}</div>
                      </motion.div>
                    )}

                    {activeTab === 'features' && (
                      <motion.div key="features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.features.length > 0 ? project.features.map((feature, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-green-600">✓</span></div>
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        )) : <p className="text-gray-500 text-center py-8 col-span-2">لا توجد مميزات مضافة بعد</p>}
                      </motion.div>
                    )}

                    {activeTab === 'packages' && (
                      <motion.div key="packages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {project.packages.map((pkg, idx) => (
                            <motion.div key={idx} whileHover={{ y: -5 }} onClick={() => setSelectedPackage(idx)}
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
                              <h3 className={`text-xl font-bold mb-2 ${selectedPackage === idx ? 'text-white' : 'text-gray-800'}`}>{pkg.name}</h3>
                              <div className={`text-3xl font-bold mb-2 ${selectedPackage === idx ? 'text-white' : 'text-indigo-600'}`}>${pkg.price}</div>
                              <div className={`text-sm mb-4 ${selectedPackage === idx ? 'text-white/80' : 'text-gray-500'}`}>تسليم في {pkg.delivery}</div>
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
                      <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <p className="text-gray-500 text-center py-8">لا توجد تقييمات بعد. كن أول من يقيم!</p>
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
                      ${project.packages[selectedPackage]?.price || project.packages[0]?.price || 0}
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

                
                </div>

                {/* Developer Card */}
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={project.developerAvatar} alt={project.developer} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg'; }} />
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
                  <Link to={`/dev/${project.owner}`} className="block text-center py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    عرض بروفايل المطور
                  </Link>
                </motion.div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">معلومات سريعة</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">التصنيف</span><span className="font-semibold">{project.category}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">عدد المبيعات</span><span className="font-semibold">🏆 {project.salesCount}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">التقييم</span><span className="font-semibold">⭐ {project.rating}</span></div>
                    {project.demoUrl && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">رابط العرض التجريبي</span>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">عرض تجريبي</a>
                      </div>
                    )}
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-2xl">🛒</span></div>
                <h3 className="text-xl font-bold">تأكيد الشراء</h3>
                <p className="text-gray-500 text-sm mt-1">أنت على وشك شراء هذا المشروع</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2"><span className="text-gray-600">المشروع</span><span className="font-semibold">{project.name}</span></div>
                <div className="flex justify-between mb-2"><span className="text-gray-600">الباقة</span><span className="font-semibold">{project.packages[selectedPackage]?.name}</span></div>
                <div className="flex justify-between pt-2 border-t"><span className="text-gray-600">السعر الإجمالي</span><span className="text-xl font-bold text-indigo-600">${project.packages[selectedPackage]?.price}</span></div>
              </div>

              <button onClick={() => { setShowPurchaseModal(false); alert('تم إتمام عملية الشراء بنجاح!'); }} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300">
                تأكيد الشراء
              </button>

              <button onClick={() => setShowPurchaseModal(false)} className="w-full py-2 mt-3 text-gray-500 hover:text-gray-700 transition text-sm">إلغاء</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}