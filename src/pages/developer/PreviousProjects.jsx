// src/pages/developer/PreviousProjects.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getPreviousProjects, deletePreviousProject } from '../../services/develper.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';
import { FiPlus, FiTrash2, FiExternalLink, FiGithub, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function PreviousProjects() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // ✅ حالة الـ Toast
  const [toast, setToast] = useState({
    show: false,
    type: '', // 'success' or 'error'
    message: '',
    title: ''
  });

  // ✅ عرض الـ Toast
  const showToast = (type, message, title = '') => {
    setToast({
      show: true,
      type,
      message,
      title: title || (type === 'success' ? '✅ نجاح' : '❌ خطأ')
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: '',
        message: '',
        title: ''
      });
    }, 5000);
  };

  // ✅ إخفاء الـ Toast يدوياً
  const hideToast = () => {
    setToast({
      show: false,
      type: '',
      message: '',
      title: ''
    });
  };

  // ✅ جلب المشروعات من الباك اند
  useEffect(() => {
    if (authLoading) {
      console.log('⏳ Waiting for auth to load...');
      return;
    }

    if (!user?._id) {
      console.error('❌ No user ID found. User:', user);
      return;
    }

    const loadProjects = async () => {
      try {
        setLoading(true);
        
        const response = await getPreviousProjects(user._id);
        
        let projectsData = [];
        
        if (response?.data?.myprojects) {
          projectsData = response.data.myprojects;
        } else if (response?.data?.projects) {
          projectsData = response.data.projects;
        } else if (response?.projects) {
          projectsData = response.projects;
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (response.data.myprojects) {
            projectsData = response.data.myprojects;
          } else {
            const values = Object.values(response.data);
            if (values.length > 0 && Array.isArray(values[0])) {
              projectsData = values[0];
            }
          }
        } else if (Array.isArray(response)) {
          projectsData = response;
        }
        
        if (!Array.isArray(projectsData)) {
          console.warn('⚠️ projectsData is not an array:', projectsData);
          projectsData = [];
        }
        
        projectsData = projectsData.map(project => ({
          ...project,
          name: project.projectName || project.name || project.title || 'مشروع بدون اسم',
          _id: project._id || project.id,
        }));
        
        setProjects(projectsData);
      } catch (error) {
        console.error('❌ Error loading projects:', error);
        console.error('❌ Error details:', error.response?.data || error.message);
        showToast('error', error.response?.data?.message || 'حدث خطأ أثناء تحميل المشاريع', '❌ فشل التحميل');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, [user?._id, authLoading]);

  // ✅ حذف المشروع
  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deletePreviousProject(projectToDelete._id);
      
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
      showToast('success', 'تم حذف المشروع بنجاح', '🗑️ حذف');
      
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      showToast('error', error.response?.data?.message || 'حدث خطأ أثناء حذف المشروع', '❌ فشل الحذف');
    }
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const categories = [
    { value: 'web', label: 'تطوير ويب', icon: '🌐' },
    { value: 'mobile', label: 'تطبيق موبايل', icon: '📱' },
    { value: 'desktop', label: 'تطبيق كمبيوتر', icon: '💻' },
    { value: 'design', label: 'تصميم واجهات', icon: '🎨' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🧠' },
    { value: 'cloud', label: 'الحوسبة السحابية', icon: '☁️' }
  ];

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📦';
  };

  // ✅ عرض حالة التحميل مع authLoading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex">
          <DeveloperSidebar activePage="previous-projects" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">
                {authLoading ? 'جاري تحميل بيانات المستخدم...' : 'جاري تحميل المشاريع السابقة...'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ لو مفيش user
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex">
          <DeveloperSidebar activePage="previous-projects" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">يرجى تسجيل الدخول</h3>
              <p className="text-gray-500 mb-4">يجب تسجيل الدخول لعرض المشاريع السابقة</p>
              <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                تسجيل الدخول
              </Link>
            </div>
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
        <DeveloperSidebar activePage="previous-projects" />

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
                  مشاريعي السابقة 📂
                </h1>
                <p className="text-gray-500 mt-1">عرض وإدارة جميع المشاريع التي قمت بتنفيذها سابقاً</p>
              </div>
              <Link to="/dashboard/developer/PreviousProjects/AddPreviousProjects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>إضافة عمل سابق</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Projects Grid */}
            {!Array.isArray(projects) || projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد مشاريع سابقة</h3>
                <p className="text-gray-500 mb-6">لم تقم بإضافة أي مشاريع سابقة حتى الآن</p>
                <Link to="/dashboard/developer/PreviousProjects/AddPreviousProjects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    ➕ إضافة عمل سابق
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id || index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => openDetailsModal(project)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={project.images?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'} 
                        alt={project.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                          {getCategoryIcon(project.category)} {getCategoryLabel(project.category)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{project.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.shortDescription}</p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(project.technologies || []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">{tech}</span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">
                            +{(project.technologies || []).length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailsModal(project);
                          }}
                          className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                        >
                          عرض التفاصيل
                        </button>
                      
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(project);
                          }}
                          className="px-3 py-1.5 border border-red-300 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
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
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Images */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">🖼️ صور المشروع</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(selectedProject.images || []).length > 0 ? (
                      selectedProject.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`${selectedProject.name} ${idx + 1}`} className="w-full h-48 object-cover rounded-xl" />
                      ))
                    ) : (
                      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" alt={selectedProject.name} className="w-full h-48 object-cover rounded-xl" />
                    )}
                  </div>
                </div>

                {/* Video */}
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

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">التصنيف</div>
                    <div className="text-lg font-semibold text-indigo-600">
                      {getCategoryIcon(selectedProject.category)} {getCategoryLabel(selectedProject.category)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">التاريخ</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {selectedProject.date ? new Date(selectedProject.date).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">التقنيات</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {(selectedProject.technologies || []).length} تقنية
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📝 وصف المشروع</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProject.fullDescription || selectedProject.shortDescription}</p>
                </div>

                {/* Features */}
                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">✨ المميزات الرئيسية</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">💻 التقنيات المستخدمة</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      عرض تجريبي
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
                    >
                      <FiGithub className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openDeleteModal(selectedProject);
                    }}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-600">تأكيد الحذف</h3>
                <p className="text-gray-500 text-sm mt-2">
                  هل أنت متأكد من حذف مشروع "{projectToDelete?.name || 'غير معروف'}"؟
                  <br />
                  <span className="text-xs text-red-400">هذا الإجراء لا يمكن التراجع عنه</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                >
                  تأكيد الحذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Toast Notification - كارد جانبي جميل */}
      {toast.show && (
        <div className="fixed top-24 left-4 z-50 w-full max-w-sm animate-slide-in-left">
          <div 
            className={`rounded-2xl shadow-2xl p-5 border-r-4 ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* أيقونة */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {toast.type === 'success' ? (
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              
              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${
                  toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {toast.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  toast.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {toast.message}
                </p>
              </div>
              
              {/* زر الإغلاق */}
              <button
                onClick={hideToast}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200/50 flex items-center justify-center transition"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* شريط التقدم (يختفي بعد 5 ثواني) */}
            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-5000 ${
                  toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: '100%',
                  animation: 'shrink 5s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ إضافة الـ keyframes في نهاية الصفحة */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
      `}</style>

      <Footer />
    </div>
  );
}