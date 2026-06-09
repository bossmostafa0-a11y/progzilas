import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevProjects() {

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      const mockProjects = [
        {
          id: 1,
          name: 'نظام إدارة المستشفيات الذكي',
          client: 'مستشفى السلام',
          clientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          clientCompany: 'مستشفى السلام',
          status: 'completed',
          progress: 100,
          startDate: '2024-01-01',
          dueDate: '2024-02-01',
          actualDeliveryDate: '2024-01-28',
          amount: 4999,
          paidAmount: 4999,
          remainingAmount: 0,
          description: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى، المواعيد، الغرف، والموظفين مع لوحة تحكم متقدمة.',
          techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2024-01-10' },
            { name: 'تسليم قاعدة البيانات', status: 'completed', date: '2024-01-15' },
            { name: 'تسليم الواجهات', status: 'completed', date: '2024-01-20' },
            { name: 'تسليم المشروع النهائي', status: 'completed', date: '2024-01-28' }
          ],
          payments: [
            { amount: 1500, date: '2024-01-05', status: 'paid', type: 'دفعة أولى' },
            { amount: 2000, date: '2024-01-20', status: 'paid', type: 'دفعة ثانية' },
            { amount: 1499, date: '2024-01-28', status: 'paid', type: 'دفعة نهائية' }
          ],
          rating: 5,
          review: 'عمل رائع جداً، أنجز المشروع قبل الموعد المحدد بدقة عالية'
        },
        {
          id: 2,
          name: 'منصة تعليمية متكاملة',
          client: 'أكاديمية المستقبل',
          clientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          clientCompany: 'أكاديمية المستقبل',
          status: 'in_progress',
          progress: 75,
          startDate: '2024-01-15',
          dueDate: '2024-02-15',
          amount: 3500,
          paidAmount: 2000,
          remainingAmount: 1500,
          description: 'منصة تعليمية إلكترونية متكاملة مع نظام إدارة المحتوى والامتحانات والفصول الافتراضية.',
          techStack: ['Next.js', 'Django', 'PostgreSQL', 'Redis'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2024-01-20' },
            { name: 'تسليم قاعدة البيانات', status: 'completed', date: '2024-01-25' },
            { name: 'تسليم الواجهات', status: 'in_progress', date: null },
            { name: 'تسليم المشروع النهائي', status: 'pending', date: null }
          ],
          payments: [
            { amount: 1000, date: '2024-01-15', status: 'paid', type: 'دفعة أولى' },
            { amount: 1000, date: '2024-01-25', status: 'paid', type: 'دفعة ثانية' },
            { amount: 1500, date: null, status: 'pending', type: 'دفعة نهائية' }
          ],
          rating: null,
          review: null
        },
        {
          id: 3,
          name: 'متجر إلكتروني متكامل',
          client: 'متجر الأصالة',
          clientAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          clientCompany: 'متجر الأصالة',
          status: 'review',
          progress: 90,
          startDate: '2024-01-20',
          dueDate: '2024-02-10',
          amount: 1299,
          paidAmount: 899,
          remainingAmount: 400,
          description: 'متجر إلكتروني احترافي مع نظام دفع متكامل وإدارة منتجات وعملاء.',
          techStack: ['React', 'Stripe', 'Tailwind', 'Prisma'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2024-01-22' },
            { name: 'تسليم قاعدة البيانات', status: 'completed', date: '2024-01-27' },
            { name: 'تسليم الواجهات', status: 'completed', date: '2024-02-01' },
            { name: 'تسليم المشروع النهائي', status: 'in_progress', date: null }
          ],
          payments: [
            { amount: 500, date: '2024-01-20', status: 'paid', type: 'دفعة أولى' },
            { amount: 399, date: '2024-02-01', status: 'paid', type: 'دفعة ثانية' },
            { amount: 400, date: null, status: 'pending', type: 'دفعة نهائية' }
          ],
          rating: null,
          review: null
        },
        {
          id: 4,
          name: 'لوحة تحكم تحليلات متقدمة',
          client: 'شركة البيانات',
          clientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
          clientCompany: 'شركة البيانات',
          status: 'pending',
          progress: 30,
          startDate: '2024-01-25',
          dueDate: '2024-02-28',
          amount: 1999,
          paidAmount: 500,
          remainingAmount: 1499,
          description: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات مع رسوم بيانية متقدمة.',
          techStack: ['React', 'D3.js', 'Firebase', 'Chart.js'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2024-01-28' },
            { name: 'تسليم قاعدة البيانات', status: 'pending', date: null },
            { name: 'تسليم الواجهات', status: 'pending', date: null },
            { name: 'تسليم المشروع النهائي', status: 'pending', date: null }
          ],
          payments: [
            { amount: 500, date: '2024-01-25', status: 'paid', type: 'دفعة أولى' },
            { amount: 700, date: null, status: 'pending', type: 'دفعة ثانية' },
            { amount: 799, date: null, status: 'pending', type: 'دفعة نهائية' }
          ],
          rating: null,
          review: null
        },
        {
          id: 5,
          name: 'نظام إدارة المطاعم',
          client: 'مطعم الأندلس',
          clientAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          clientCompany: 'مطعم الأندلس',
          status: 'completed',
          progress: 100,
          startDate: '2023-12-01',
          dueDate: '2024-01-15',
          actualDeliveryDate: '2024-01-10',
          amount: 2499,
          paidAmount: 2499,
          remainingAmount: 0,
          description: 'نظام متكامل لإدارة المطاعم يشمل إدارة الطلبات والمخزون والموظفين.',
          techStack: ['Vue.js', 'Laravel', 'MySQL', 'Bootstrap'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2023-12-10' },
            { name: 'تسليم قاعدة البيانات', status: 'completed', date: '2023-12-20' },
            { name: 'تسليم الواجهات', status: 'completed', date: '2024-01-05' },
            { name: 'تسليم المشروع النهائي', status: 'completed', date: '2024-01-10' }
          ],
          payments: [
            { amount: 800, date: '2023-12-01', status: 'paid', type: 'دفعة أولى' },
            { amount: 800, date: '2023-12-25', status: 'paid', type: 'دفعة ثانية' },
            { amount: 899, date: '2024-01-10', status: 'paid', type: 'دفعة نهائية' }
          ],
          rating: 4.8,
          review: 'نظام ممتاز وسهل الاستخدام، التعامل مع المطور كان احترافياً'
        },
        {
          id: 6,
          name: 'تطبيق موبايل للتوصيل',
          client: 'شركة توصيل',
          clientAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
          clientCompany: 'شركة توصيل',
          status: 'in_progress',
          progress: 60,
          startDate: '2024-01-10',
          dueDate: '2024-02-20',
          amount: 4500,
          paidAmount: 2000,
          remainingAmount: 2500,
          description: 'تطبيق موبايل للتوصيل يشمل تطبيقين (عميل - كابتن) ولوحة تحكم.',
          techStack: ['Flutter', 'Node.js', 'MongoDB', 'Firebase'],
          milestones: [
            { name: 'تسليم التصميم', status: 'completed', date: '2024-01-15' },
            { name: 'تسليم قاعدة البيانات', status: 'completed', date: '2024-01-20' },
            { name: 'تسليم الواجهات', status: 'in_progress', date: null },
            { name: 'تسليم المشروع النهائي', status: 'pending', date: null }
          ],
          payments: [
            { amount: 1000, date: '2024-01-10', status: 'paid', type: 'دفعة أولى' },
            { amount: 1000, date: '2024-01-25', status: 'paid', type: 'دفعة ثانية' },
            { amount: 2500, date: null, status: 'pending', type: 'دفعة نهائية' }
          ],
          rating: null,
          review: null
        }
      ];

      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
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

  const filteredProjects = projects.filter(project => {
    if (activeFilter !== 'all' && project.status !== activeFilter) return false;
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.client.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    review: projects.filter(p => p.status === 'review').length,
    pending: projects.filter(p => p.status === 'pending').length,
    totalEarnings: projects.reduce((sum, p) => sum + p.paidAmount, 0),
    pendingAmount: projects.reduce((sum, p) => sum + p.remainingAmount, 0)
  };

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
                {/* Search Bar */}
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

                {/* Filter Buttons */}
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

                  {/* Milestones */}
                  <div className="space-y-3 mt-4">
                    {selectedProject.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                          milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {milestone.status === 'completed' ? '✓' : milestone.status === 'in_progress' ? '🔄' : '○'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{milestone.name}</div>
                          {milestone.date && <div className="text-xs text-gray-400">{milestone.date}</div>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                          milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {milestone.status === 'completed' ? 'مكتمل' : milestone.status === 'in_progress' ? 'قيد التنفيذ' : 'قادم'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payments */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">💰 المدفوعات</h3>
                  <div className="space-y-3">
                    {selectedProject.payments.map((payment, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-800">{payment.type}</div>
                          <div className="text-xs text-gray-400">{payment.date || 'لم يتم الدفع بعد'}</div>
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
                    ))}
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
                  <button className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                    إرسال تحديث
                  </button>
                  <button className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition">
                    طلب تعديل
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