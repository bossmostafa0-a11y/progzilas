import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';
import { getDeveloperProject } from '../../services/develper.service';
import { Link } from 'react-router-dom';
export default function DevProjects() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    review: 0,
    pending: 0,
    totalEarnings: 0,
    pendingAmount: 0
  });

  // ✅ جلب المشاريع من الباك اند
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const response = await getDeveloperProject();
        console.log('📥 Developer projects:', response);

        // ✅ استخراج البيانات من الـ Response
        const projectsData = response?.data?.projects || response?.projects || response?.data || [];
        
        // ✅ تحويل البيانات للشكل المطلوب
        const formattedProjects = projectsData.map(project => ({
          id: project._id || project.id,
          name: project.projectName || project.name || 'مشروع بدون اسم',
          client: project.client?.username || project.clientName || 'عميل',
          clientAvatar: project.client?.profileImage || project.clientAvatar || 'https://randomuser.me/api/portraits/men/1.jpg',
          clientCompany: project.client?.company || project.clientCompany || '',
          status: project.status || 'pending',
          progress: project.progress || 0,
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString('ar-EG') : 'غير محدد',
          dueDate: project.dueDate ? new Date(project.dueDate).toLocaleDateString('ar-EG') : 'غير محدد',
          actualDeliveryDate: project.completedAt ? new Date(project.completedAt).toLocaleDateString('ar-EG') : null,
          amount: parseInt(project.budget) || project.amount || 0,
          paidAmount: project.paidAmount || 0,
          remainingAmount: (parseInt(project.budget) || project.amount || 0) - (project.paidAmount || 0),
          description: project.description || '',
          techStack: project.skills || project.techStack || [],
          tasks: project.tasks || [], // ✅ المهام = المراحل
          payments: project.payments || [],
          rating: project.rating || null,
          review: project.review || null
        }));

        setProjects(formattedProjects);

        // ✅ حساب الإحصائيات
        const total = formattedProjects.length;
        const completed = formattedProjects.filter(p => p.status === 'completed').length;
        const inProgress = formattedProjects.filter(p => p.status === 'in_progress').length;
        const review = formattedProjects.filter(p => p.status === 'review').length;
        const pending = formattedProjects.filter(p => p.status === 'pending').length;
        const totalEarnings = formattedProjects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const pendingAmount = formattedProjects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

        setStats({ total, completed, inProgress, review, pending, totalEarnings, pendingAmount });

      } catch (error) {
        console.error('❌ Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    const texts = {
      completed: 'مكتمل ✅',
      in_progress: 'قيد التنفيذ 🔄',
      review: 'مراجعة 📋',
      pending: 'قيد الانتظار ⏳'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: '✅',
      in_progress: '🔄',
      review: '📋',
      pending: '⏳'
    };
    return icons[status] || '📌';
  };

  // ✅ تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ✅ حالة المهمة
  const getTaskStatusColor = (status) => {
    const map = {
      'completed': 'bg-green-100 text-green-600',
      'in_progress': 'bg-blue-100 text-blue-600',
      'pending': 'bg-yellow-100 text-yellow-600',
      'todo': 'bg-gray-100 text-gray-500'
    };
    return map[status] || 'bg-gray-100 text-gray-500';
  };

  const getTaskStatusText = (status) => {
    const map = {
      'completed': 'مكتمل',
      'in_progress': 'قيد التنفيذ',
      'pending': 'قيد الانتظار',
      'todo': 'قيد الانتظار'
    };
    return map[status] || status;
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter !== 'all' && project.status !== activeFilter) return false;
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.client.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Animation variants
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
            <p className="text-gray-500">جاري تحميل المشاريع...</p>
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
        <DeveloperSidebar activePage="projects" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                مشاريعي 📋
              </h1>
              <p className="text-gray-500 mt-1">إدارة ومتابعة جميع مشاريعك مع العملاء</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-xs text-gray-500">إجمالي المشاريع</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-500">مكتملة</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-2xl font-bold text-purple-600">${stats.totalEarnings.toLocaleString()}</div>
                <div className="text-xs text-gray-500">إجمالي الأرباح</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">⏳</div>
                <div className="text-2xl font-bold text-orange-600">${stats.pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">مبالغ معلقة</div>
              </motion.div>
            </motion.div>

            {/* Search and Filters */}
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
                  {[
                    { value: 'all', label: 'الكل', icon: '📋' },
                    { value: 'in_progress', label: 'قيد التنفيذ', icon: '🔄' },
                    { value: 'review', label: 'مراجعة', icon: '📋' },
                    { value: 'pending', label: 'قيد الانتظار', icon: '⏳' },
                    { value: 'completed', label: 'مكتمل', icon: '✅' }
                  ].map((filter) => (
                    <motion.button
                      key={filter.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                        activeFilter === filter.value
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد مشاريع</h3>
                <p className="text-gray-500">لم نجد أي مشاريع مطابقة لمعايير البحث</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="wait">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          {/* Project Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {getStatusIcon(project.status)} {getStatusText(project.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <img src={project.clientAvatar} alt={project.client} className="w-6 h-6 rounded-full" />
                              <span className="text-sm text-gray-600">{project.client}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-xs text-gray-400">تسليم: {project.dueDate}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.techStack.slice(0, 4).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg">{tech}</span>
                              ))}
                            </div>
                          </div>

                          {/* Progress & Amount */}
                          <div className="text-left min-w-[150px]">
                            <div className="mb-3">
                              <div className="text-sm text-gray-500 mb-1">التقدم</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${
                                      project.status === 'completed' ? 'bg-green-500' :
                                      project.status === 'in_progress' ? 'bg-blue-500' :
                                      'bg-yellow-500'
                                    }`}
                                  />
                                </div>
                                <span className="text-xs font-semibold">{project.progress}%</span>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="text-sm text-gray-500 mb-1">المدفوع</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(project.paidAmount / project.amount) * 100}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-green-500 rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-semibold">{Math.round((project.paidAmount / project.amount) * 100)}%</span>
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="text-lg font-bold text-indigo-600">${project.amount}</div>
                              <div className="text-xs text-gray-400">المتبقي: ${project.remainingAmount}</div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                          >
                            إدارة المشروع
                          </motion.button>
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
                {/* Client Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img src={selectedProject.clientAvatar} alt={selectedProject.client} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedProject.client}</h3>
                    <p className="text-sm text-gray-500">{selectedProject.clientCompany}</p>
                    <p className="text-xs text-gray-400 mt-1">تاريخ البدء: {selectedProject.startDate}</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">📈 تقدم المشروع</h3>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">إنجاز المشروع</span>
                      <span className="text-sm font-semibold">{selectedProject.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedProject.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${
                          selectedProject.status === 'completed' ? 'bg-green-500' :
                          selectedProject.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* ✅ المهام = المراحل */}
                  <div className="space-y-3 mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">📋 المهام</h4>
                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                      selectedProject.tasks.map((task, idx) => (
                        <div key={task._id || idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            task.status === 'completed' ? 'bg-green-100 text-green-600' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {task.status === 'completed' ? '✓' : task.status === 'in_progress' ? '🔄' : '○'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{task.title}</div>
                            {task.description && <div className="text-xs text-gray-500">{task.description}</div>}
                            {task.dueDate && <div className="text-xs text-gray-400">📅 {formatDate(task.dueDate)}</div>}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTaskStatusColor(task.status)}`}>
                            {getTaskStatusText(task.status)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">لا توجد مهام</p>
                    )}
                  </div>
                </div>

                {/* Payments */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">💰 المدفوعات</h3>
                  <div className="space-y-3">
                    {selectedProject.payments && selectedProject.payments.length > 0 ? (
                      selectedProject.payments.map((payment, idx) => (
                        <div key={payment._id || idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-800">{payment.namePayment || payment.type || 'دفعة'}</div>
                            <div className="text-xs text-gray-400">{payment.createdAt ? formatDate(payment.createdAt) : 'غير محدد'}</div>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-indigo-600">${payment.amount}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {payment.status === 'paid' ? 'تم الدفع ✓' : 'معلق'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">لا توجد مدفوعات</p>
                    )}
                  </div>
                </div>

                {/* Review */}
                {selectedProject.review && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{selectedProject.rating}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-sm text-gray-600">تقييم العميل</span>
                    </div>
                    <p className="text-gray-700">"{selectedProject.review}"</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Link 
  to={`/project/${selectedProject.id}`}
  className="flex-1"
>
  <button className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
    🚀 فتح لوحة التحكم
  </button>
</Link>

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