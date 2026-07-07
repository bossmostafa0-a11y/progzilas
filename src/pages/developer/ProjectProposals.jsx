// src/pages/developer/ProjectProposals.jsx

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOpenProjects, createProposal } from '../../services/develper.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

// ✅ دوال مساعدة للميزانية
const getBudgetValue = (budget) => {
  if (!budget) return 0;
  if (typeof budget === 'number') return budget;
  
  const budgetMap = {
    'under1000': 500,
    '1000-5000': 3000,
    '5000-10000': 7500,
    '10000-50000': 30000,
    'above50000': 75000
  };
  
  if (budgetMap[budget] !== undefined) return budgetMap[budget];
  
  const parsed = parseFloat(budget);
  return isNaN(parsed) ? 0 : parsed;
};

const formatBudget = (budget) => {
  if (!budget) return 'غير محدد';
  if (typeof budget === 'number') return `$${budget.toLocaleString()}`;
  
  const budgetMap = {
    'under1000': 'أقل من $1000',
    '1000-5000': '$1,000 - $5,000',
    '5000-10000': '$5,000 - $10,000',
    '10000-50000': '$10,000 - $50,000',
    'above50000': 'أكثر من $50,000'
  };
  
  return budgetMap[budget] || budget;
};

// ✅ التحقق من انتهاء المدة
const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return deadlineDate < today;
};

const formatDeadline = (deadline) => {
  if (!deadline) return 'غير محدد';
  const date = new Date(deadline);
  return date.toLocaleDateString('ar-EG', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function ProjectProposals() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    budget: '',
    duration: ''
  });
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const hasFetched = useRef(false);

  // ✅ جلب المشاريع من الباك اند
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOpenProjects();
      console.log('📥 Projects from API:', response);
      
      const projectsData = response?.data?.projects || response?.projects || response?.data || [];
      setProjects(projectsData);
      
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProjects();
    }
  }, [fetchProjects]);

  const categories = [
    { value: 'all', label: 'الكل', icon: '🌐' },
    { value: 'web', label: 'تطوير ويب', icon: '🌐' },
    { value: 'mobile', label: 'تطبيق موبايل', icon: '📱' },
    { value: 'desktop', label: 'تطبيق كمبيوتر', icon: '💻' },
    { value: 'cross-platform', label: 'كمبيوتر وموبيل', icon: '🔄' },
    { value: 'design', label: 'تصميم واجهات', icon: '🎨' },
    { value: 'ai', label: 'الذكاء الاصطناعي', icon: '🧠' },
    { value: 'cloud', label: 'الحوسبة السحابية', icon: '☁️' }
  ];

  

  // ✅ فلترة المشاريع
  const filteredProjects = useMemo(() => {
    let result = projects.filter(project => {
      if (activeFilter !== 'all' && project.category !== activeFilter) return false;
      if (searchTerm && !project.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !project.client?.username?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'mostProposals':
        result.sort((a, b) => (b.proposals || 0) - (a.proposals || 0));
        break;
      case 'budget':
        result.sort((a, b) => getBudgetValue(b.budget) - getBudgetValue(a.budget));
        break;
      default:
        break;
    }

    return result;
  }, [projects, activeFilter, searchTerm, sortBy]);

  // ✅ تقديم عرض
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    
    // ✅ التحقق من انتهاء المدة
    if (isDeadlinePassed(selectedProject.deadline)) {
      setErrorMessage('⛔ عذراً، انتهت مدة التقديم على هذا المشروع');
      setSubmitting(false);
      return;
    }
    
    try {
      const submitData = {
        projectId: selectedProject._id,
        coverLetter: proposalData.coverLetter,
        budget: proposalData.budget,
        duration: proposalData.duration
      };
      
      console.log('📤 Sending proposal:', submitData);
      
      const response = await createProposal(submitData);
      console.log('📥 Proposal response:', response);
      
      setSuccessMessage('✅ تم تقديم العرض بنجاح!');
      
      setProjects(prev => prev.map(p => 
        p._id === selectedProject._id ? { ...p, proposals: (p.proposals || 0) + 1 } : p
      ));
      
      setSubmittedProjects(prev => [...prev, selectedProject._id]);
      
      setTimeout(() => {
        setShowProposalModal(false);
        setProposalData({ coverLetter: '', budget: '', duration: '' });
        setSuccessMessage('');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error submitting proposal:', error);
      
      // ✅ التحقق من رسالة الخطأ من الباك اند
      const errorMsg = error.response?.data?.message || error.message || 'حدث خطأ أثناء تقديم العرض';
      
      // ✅ إذا كانت رسالة "تم التقديم بالفعل"
      if (errorMsg.includes('already') || errorMsg.includes('سبق') || errorMsg.includes('مسبقاً') || errorMsg.includes('قمت بالتقديم')) {
        setErrorMessage('⚠️ لقد قمت بالتقديم على هذا المشروع بالفعل');
        // إضافة المشروع لقائمة المقدم عليها
        setSubmittedProjects(prev => [...prev, selectedProject._id]);
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleProposalChange = (e) => {
    setProposalData({
      ...proposalData,
      [e.target.name]: e.target.value
    });
  };

  const hasSubmitted = (projectId) => {
    return submittedProjects.includes(projectId);
  };

  const handleRetry = () => {
    hasFetched.current = false;
    fetchProjects();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 100 } }
  };

  // ✅ Skeleton Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex">
          <DeveloperSidebar activePage="proposals" />
          <div className="flex-1 p-6 lg:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="flex gap-1 mb-3">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded-xl w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex">
          <DeveloperSidebar activePage="proposals" />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                إعادة المحاولة 🔄
              </button>
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
        <DeveloperSidebar activePage="proposals" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-between items-center mb-6"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  التقديم على المشاريع 📝
                </h1>
                <p className="text-gray-500 mt-1">استعرض المشاريع المتاحة وقدم عروضك</p>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm">
                  🏆 {projects.filter(p => p.status !== 'closed').length} مشروع متاح
                </span>
              </div>
            </motion.div>

            {/* ✅ Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <motion.div variants={cardVariants} className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl shadow-md p-4 text-center border border-indigo-200/50 hover:shadow-lg transition-all">
                <div className="text-3xl mb-1">📋</div>
                <div className="text-2xl font-bold text-indigo-600">{projects.length}</div>
                <div className="text-xs text-gray-500 font-medium">إجمالي المشاريع</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl shadow-md p-4 text-center border border-green-200/50 hover:shadow-lg transition-all">
                <div className="text-3xl mb-1">🟢</div>
                <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.status !== 'closed' && !isDeadlinePassed(p.deadline)).length}</div>
                <div className="text-xs text-gray-500 font-medium">متاحة للتقديم</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl shadow-md p-4 text-center border border-purple-200/50 hover:shadow-lg transition-all">
                <div className="text-3xl mb-1">💼</div>
                <div className="text-2xl font-bold text-purple-600">
                  ${projects.reduce((sum, p) => sum + getBudgetValue(p.budget), 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium">إجمالي الميزانيات</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl shadow-md p-4 text-center border border-yellow-200/50 hover:shadow-lg transition-all">
                <div className="text-3xl mb-1">📝</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {projects.reduce((sum, p) => sum + (p.proposals || 0), 0)}
                </div>
                <div className="text-xs text-gray-500 font-medium">إجمالي العروض</div>
              </motion.div>
            </motion.div>

            {/* ✅ Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 mb-4"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveFilter(cat.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm ${
                      activeFilter === cat.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    {activeFilter === cat.value && (
                      <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ✅ Search and Sort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن مشروع..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm bg-white"
                  >
                    <option value="newest">📅 الأحدث</option>
                    <option value="mostProposals">📝 الأكثر عروضاً</option>
                    <option value="budget">💰 الأعلى ميزانية</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مشاريع</h3>
                <p className="text-gray-500">لم نجد أي مشاريع مطابقة لمعايير البحث</p>
                {(searchTerm || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    إعادة ضبط البحث
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="wait">
                  {filteredProjects.map((project) => {
                    const alreadySubmitted = hasSubmitted(project._id);
                    const expired = isDeadlinePassed(project.deadline);
                    
                    return (
                      <motion.div
                        key={project._id}
                        variants={cardVariants}
                        whileHover={{ y: -8 }}
                        className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border ${
                          expired ? 'border-red-200 opacity-75' : 'border-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDetailsModal(true);
                        }}
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={project.client?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                                alt={project.client?.username || 'عميل'} 
                                className="w-10 h-10 rounded-full object-cover" 
                              />
                              <div>
                                <h3 className="font-semibold text-gray-800">{project.client?.username || 'عميل'}</h3>
                                <span className="text-xs text-gray-400">{project.createdAt ? new Date(project.createdAt).toLocaleDateString('ar-EG') : ''}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {project.featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">⭐ مميز</span>
                              )}
                              {expired && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">⛔ منتهي</span>
                              )}
                              {alreadySubmitted && !expired && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✅ مقدم</span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h4>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.skills?.map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-lg">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Details */}
                          <div className="flex flex-wrap gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">💰</span>
                              <span className="font-semibold">{formatBudget(project.budget)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">⏱️</span>
                              <span>{project.duration || 'غير محدد'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">📝</span>
                              <span>{project.proposals || 0} عرض</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">📅</span>
                              <span className={expired ? 'text-red-500 font-bold' : 'text-gray-500'}>
                                {expired ? '⛔ انتهى التقديم' : `آخر موعد: ${formatDeadline(project.deadline)}`}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (expired) {
                                  setErrorMessage('⛔ عذراً، انتهت مدة التقديم على هذا المشروع');
                                  setTimeout(() => setErrorMessage(''), 3000);
                                  return;
                                }
                                if (alreadySubmitted) {
                                  setErrorMessage('⚠️ لقد قمت بالتقديم على هذا المشروع بالفعل');
                                  setTimeout(() => setErrorMessage(''), 3000);
                                  return;
                                }
                                setSelectedProject(project);
                                setShowProposalModal(true);
                              }}
                              disabled={expired || alreadySubmitted}
                              className={`flex-1 py-2 rounded-xl font-medium transition ${
                                expired || alreadySubmitted
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                              }`}
                            >
                              {expired ? '⛔ منتهي' : alreadySubmitted ? '✅ تم التقديم' : 'تقديم عرض 📩'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                              تفاصيل
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">تفاصيل المشروع</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedProject.client?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                    alt={selectedProject.client?.username || 'عميل'} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <h3 className="font-semibold">{selectedProject.client?.username || 'عميل'}</h3>
                    <p className="text-sm text-gray-500">نشر في: {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString('ar-EG') : ''}</p>
                  </div>
                  {selectedProject.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">⭐ مميز</span>
                  )}
                  {isDeadlinePassed(selectedProject.deadline) && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">⛔ منتهي</span>
                  )}
                  {hasSubmitted(selectedProject._id) && !isDeadlinePassed(selectedProject.deadline) && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✅ مقدم</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800">{selectedProject.title}</h3>
                <p className="text-gray-600">{selectedProject.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">الميزانية</div>
                    <div className="text-xl font-bold text-indigo-600">{formatBudget(selectedProject.budget)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">المدة</div>
                    <div className="text-xl font-bold text-gray-800">{selectedProject.duration || 'غير محدد'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">آخر موعد</div>
                    <div className={`text-xl font-bold ${isDeadlinePassed(selectedProject.deadline) ? 'text-red-500' : 'text-gray-800'}`}>
                      {formatDeadline(selectedProject.deadline)}
                      {isDeadlinePassed(selectedProject.deadline) && ' ⛔ منتهي'}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">العروض المقدمة</div>
                    <div className="text-xl font-bold text-purple-600">{selectedProject.proposals || 0}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">المهارات المطلوبة</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ✅ رسالة الخطأ داخل المودال */}
                {errorMessage && (
                  <div className={`p-3 rounded-xl text-center font-medium ${
                    errorMessage.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      if (isDeadlinePassed(selectedProject.deadline)) {
                        setErrorMessage('⛔ عذراً، انتهت مدة التقديم على هذا المشروع');
                        setTimeout(() => setErrorMessage(''), 3000);
                        return;
                      }
                      if (hasSubmitted(selectedProject._id)) {
                        setErrorMessage('⚠️ لقد قمت بالتقديم على هذا المشروع بالفعل');
                        setTimeout(() => setErrorMessage(''), 3000);
                        return;
                      }
                      setShowDetailsModal(false);
                      setShowProposalModal(true);
                    }}
                    disabled={isDeadlinePassed(selectedProject.deadline) || hasSubmitted(selectedProject._id)}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${
                      isDeadlinePassed(selectedProject.deadline) || hasSubmitted(selectedProject._id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isDeadlinePassed(selectedProject.deadline) ? '⛔ منتهي' : 
                     hasSubmitted(selectedProject._id) ? '✅ تم التقديم' : 'تقديم عرض 📩'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setErrorMessage('');
                    }}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposal Modal */}
      <AnimatePresence>
        {showProposalModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => !submitting && setShowProposalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">تقديم عرض</h2>
                <button
                  onClick={() => !submitting && setShowProposalModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleProposalSubmit} className="p-6 space-y-4">
                {/* ✅ رسالة النجاح */}
                {successMessage && (
                  <div className="p-3 bg-green-100 text-green-700 rounded-xl text-center font-medium">
                    {successMessage}
                  </div>
                )}

                {/* ✅ رسالة الخطأ */}
                {errorMessage && (
                  <div className={`p-3 rounded-xl text-center font-medium ${
                    errorMessage.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {errorMessage}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-800">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-500">عميل: {selectedProject.client?.username || 'عميل'}</p>
                  <p className="text-sm text-gray-500">الميزانية المقترحة: {formatBudget(selectedProject.budget)}</p>
                  <div className="mt-2 p-2 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">📅 آخر موعد للتقديم: <span className="font-bold">{formatDeadline(selectedProject.deadline)}</span></p>
                    {isDeadlinePassed(selectedProject.deadline) && (
                      <p className="text-sm text-red-500 font-bold mt-1">⛔ انتهت مدة التقديم</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رسالة الغلاف <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="coverLetter"
                    rows="6"
                    value={proposalData.coverLetter}
                    onChange={handleProposalChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                    placeholder="اشرح لماذا أنت مناسب لهذا المشروع، خبراتك السابقة، وكيف ستقوم بتنفيذه..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الميزانية المطلوبة ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={proposalData.budget}
                      onChange={handleProposalChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="ميزانيتك"
                      required
                      min="0"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المدة المتوقعة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={proposalData.duration}
                      onChange={handleProposalChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 30 يوم"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProposalModal(false);
                      setErrorMessage('');
                    }}
                    disabled={submitting}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || isDeadlinePassed(selectedProject.deadline)}
                    className={`flex-1 py-2 rounded-xl font-medium transition ${
                      isDeadlinePassed(selectedProject.deadline)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {submitting ? 'جاري التقديم...' : 
                     isDeadlinePassed(selectedProject.deadline) ? '⛔ منتهي' : 'تقديم العرض 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}