// src/pages/developer/DevStore.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getStoreProjects, 
  toggleProjectStatus,
  deleteStoreProject 
} from '../../services/develper.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevStore() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalSales: 0,
    totalRevenue: 0,
    avgRating: 0
  });

  const transformProjectData = (project) => {
    const avgRating = project.rating || 0;
    const status = project.public === true ? 'published' : 'draft';
    
    const packages = [];
    if (project.basic) {
      packages.push({
        name: 'Basic',
        price: project.basic.price || 0,
        deliveryTime: project.basic.deliveryTime || 3,
        features: project.basic.features || [],
        sales: project.basic.sales || 0
      });
    }
    if (project.pro) {
      packages.push({
        name: 'Pro',
        price: project.pro.price || 0,
        deliveryTime: project.pro.deliveryTime || 7,
        features: project.pro.features || [],
        sales: project.pro.sales || 0
      });
    }
    if (project.enterprise) {
      packages.push({
        name: 'Enterprise',
        price: project.enterprise.price || 0,
        deliveryTime: project.enterprise.deliveryTime || 30,
        features: project.enterprise.features || [],
        sales: project.enterprise.sales || 0
      });
    }

    return {
      id: project._id || project.id,
      name: project.projectName || project.name || 'مشروع بدون اسم',
      description: project.shortDescription || project.description || '',
      fullDescription: project.fullDescription || '',
      category: project.category || 'other',
      price: project.price || packages[0]?.price || 0,
      salesCount: project.salesCount,
      rating: avgRating,
      views: project.views || 0,
      image: project.images?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
      images: project.images || [],
      tech: project.technologies || [],
      mainFeatures: project.mainFeatures || [],
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      license: project.license || 'Commercial',
      videoUrl: project.videoUrl || '',
      supportPeriod: project.supportPeriod || '',
      updatesPeriod: project.updatesPeriod || '',
      status: status,
      public: project.public || false,
      createdAt: project.createdAt || new Date().toISOString(),
      lastUpdated: project.updatedAt || project.lastUpdated || new Date().toISOString(),
      packages: packages,
      reviews: project.reviews || [],
      basic: project.basic || null,
      pro: project.pro || null,
      enterprise: project.enterprise || null
    };
  };

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await getStoreProjects();
        
        const projectsData = response?.data?.myprojects || response?.myprojects || response?.data || [];
        
        if (projectsData.length > 0) {
          const transformedProjects = projectsData.map(transformProjectData);
          setProjects(transformedProjects);
          
          const total = transformedProjects.length;
          const totalSales = transformedProjects.reduce((sum, p) => sum + (p.salesCount || 0), 0);
          const totalRevenue = transformedProjects.reduce((sum, p) => sum + ((p.price || 0) * (p.salesCount || 0)), 0);
          const avgRating = transformedProjects.reduce((sum, p) => sum + (p.rating || 0), 0) / total;
          
          setStats({ 
            total, 
            totalSales, 
            totalRevenue, 
            avgRating: avgRating || 0 
          });
        } else {
          setProjects([]);
          setStats({ total: 0, totalSales: 0, totalRevenue: 0, avgRating: 0 });
        }
      } catch (error) {
        console.error('❌ Error loading store projects:', error);
        setProjects([]);
        setStats({ total: 0, totalSales: 0, totalRevenue: 0, avgRating: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  const handleToggleStatus = async (id) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    const actionText = project.public ? 'إيقاف' : 'نشر';
    
    if (window.confirm(`هل أنت متأكد من ${actionText} هذا المشروع؟`)) {
      setLoading(true);
      try {
        await toggleProjectStatus(id);
        
        const newStatus = !project.public;
        const newStatusText = newStatus ? 'published' : 'draft';
        
        setProjects(projects.map(p => 
          p.id === id ? { ...p, public: newStatus, status: newStatusText } : p
        ));
        setShowDetailsModal(false);
        
        alert(`✅ تم ${actionText} المشروع بنجاح`);
      } catch (error) {
        console.error('❌ Error updating project status:', error);
        alert(error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة المشروع');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setLoading(true);
      try {
        await deleteStoreProject(id);
        setProjects(projects.filter(p => p.id !== id));
        setShowDetailsModal(false);
        alert('✅ تم حذف المشروع بنجاح');
      } catch (error) {
        console.error('❌ Error deleting project:', error);
        alert(error.response?.data?.message || 'حدث خطأ أثناء حذف المشروع');
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = [
    { value: 'all', label: 'الكل', icon: '🌐' },
    { value: 'management', label: 'نظم إدارة', icon: '📊' },
    { value: 'ecommerce', label: 'متاجر إلكترونية', icon: '🛒' },
    { value: 'education', label: 'منصات تعليمية', icon: '📚' },
    { value: 'dashboard', label: 'لوحات تحكم', icon: '📈' },
    { value: 'mobile', label: 'تطبيقات موبايل', icon: '📱' }
  ];

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📦';
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter !== 'all' && project.category !== activeFilter) return false;
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500">جاري تحميل المتجر...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="store" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  متجري 🛒
                </h1>
                <p className="text-gray-500 mt-1">إدارة وبيع مشاريعك البرمجية للعملاء</p>
              </div>
              <Link to="/Messagesupport">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>رسائل الدعم الفني</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Cards */}
            {stats.total > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                  <div className="text-xs text-gray-500">إجمالي المشاريع</div>
                </motion.div>
                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalSales}</div>
                  <div className="text-xs text-gray-500">إجمالي المبيعات</div>
                </motion.div>
                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">إجمالي الأرباح</div>
                </motion.div>
                <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-2xl font-bold text-yellow-500">{stats.avgRating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">متوسط التقييم</div>
                </motion.div>
              </motion.div>
            )}

            {/* Search and Filters */}
            {projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 mb-8"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="🔍 ابحث عن مشروع..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(cat.value)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                          activeFilter === cat.value
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects Grid or Empty State */}
            {projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد مشاريع حتى الآن</h3>
                <p className="text-gray-500 mb-6">لم تقم بإضافة أي مشاريع إلى متجرك بعد</p>
                <Link to="/dashboard/developer/add-project">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    ➕ إضافة مشروع جديد
                  </motion.button>
                </Link>
              </motion.div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد نتائج</h3>
                <p className="text-gray-500">لم نجد أي مشاريع مطابقة لمعايير البحث</p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  إعادة ضبط البحث
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="wait">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={project.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'} 
                          alt={project.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            project.public === true ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {project.public === true ? 'منشور ✓' : 'مسودة 📝'}
                          </span>
                        </div>
                        
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                            {getCategoryIcon(project.category)} {getCategoryLabel(project.category)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{project.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(project.tech || []).slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">{tech}</span>
                          ))}
                          {(project.tech || []).length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">+{(project.tech || []).length - 3}</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">★</span>
                              <span className="text-sm font-semibold">{project.rating || 0}</span>
                            </div>
                            <div className="text-gray-300 text-xs">|</div>
                            <div className="text-xs text-gray-500">🏆 {project.salesCount || 0} مبيعات</div>
                          </div>
                          <div className="text-lg font-bold text-indigo-600">${project.price || 0}</div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          {(project.packages || []).map((pkg, idx) => (
                            <div key={idx} className="flex-1 text-center p-1 bg-gray-50 rounded-lg">
                              <div className="text-xs font-semibold text-gray-600">{pkg.name}</div>
                              <div className="text-xs text-indigo-600">${pkg.price}</div>
                              <div className="text-[10px] text-gray-400">{pkg.sales || 0} مبيعات</div>
                            </div>
                          ))}
                        </div>

                        {/* ✅ زر تعديل - بينقل لصفحة التعديل */}
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/dashboard/developer/edit-project', { 
                                state: { project: project }
                              });
                            }}
                            className="flex-1 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
                          >
                            تعديل
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(project.id);
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${
                              project.public === true
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {project.public === true ? 'إيقاف' : 'نشر'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{selectedProject.name}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* فيديو */}
                {selectedProject.videoUrl && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">🎬 فيديو توضيحي</h3>
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        src={selectedProject.videoUrl}
                        controls
                        className="w-full max-h-[400px] object-contain"
                      >
                        متصفحك لا يدعم تشغيل الفيديو
                      </video>
                    </div>
                  </div>
                )}

                {/* صور */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">🖼️ صور المشروع</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(selectedProject.images || []).length > 0 ? selectedProject.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${selectedProject.name} ${idx + 1}`} className="w-full h-48 object-cover rounded-xl" />
                    )) : (
                      <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-48 object-cover rounded-xl" />
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">السعر</div>
                    <div className="text-xl font-bold text-indigo-600">${selectedProject.price}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">إجمالي المبيعات</div>
                    <div className="text-xl font-bold text-green-600">{selectedProject.salesCount}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">التقييم</div>
                    <div className="text-xl font-bold text-yellow-500">{selectedProject.rating}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">المشاهدات</div>
                    <div className="text-xl font-bold text-purple-600">{selectedProject.views || 0}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📝 وصف المشروع</h3>
                  <p className="text-gray-600">{selectedProject.fullDescription || selectedProject.description}</p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">💻 التقنيات المستخدمة</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.tech || []).map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Packages */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">💰 الباقات والأسعار</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(selectedProject.packages || []).map((pkg, idx) => (
                      <div key={idx} className="p-4 border-2 border-gray-200 rounded-xl">
                        <h4 className="font-bold text-gray-800">{pkg.name}</h4>
                        <div className="text-2xl font-bold text-indigo-600 mt-2">${pkg.price}</div>
                        <div className="text-sm text-gray-500 mt-1">{pkg.sales || 0} عملية بيع</div>
                        <div className="text-xs text-gray-400 mt-2">تسليم: {pkg.deliveryTime} أيام</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                {(selectedProject.reviews || []).length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">⭐ تقييمات العملاء</h3>
                    <div className="space-y-3">
                      {selectedProject.reviews.map((review, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.user}</span>
                            <span className="text-yellow-500">★ {review.rating}</span>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/dashboard/developer/edit-project', { 
                        state: { project: selectedProject }
                      });
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition"
                  >
                    تعديل المشروع
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedProject.id)}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${
                      selectedProject.public === true
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {selectedProject.public === true ? 'إيقاف المشروع' : 'نشر المشروع'}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                  >
                    حذف المشروع
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}