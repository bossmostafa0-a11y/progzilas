import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevProposals() {
 
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);


  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    totalValue: 0
  });

  // Form state for new proposal
  const [newProposal, setNewProposal] = useState({
    projectId: '',
    projectName: '',
    clientName: '',
    amount: '',
    duration: '',
    message: '',
    milestones: [
      { name: 'تسليم التصميم', percentage: 20 },
      { name: 'تسليم قاعدة البيانات', percentage: 30 },
      { name: 'تسليم الواجهات', percentage: 30 },
      { name: 'تسليم المشروع النهائي', percentage: 20 }
    ]
  });

  useEffect(() => {
    // Mock data for proposals
    setTimeout(() => {
      const mockProposals = [
        {
          id: 1,
          projectName: 'نظام إدارة المستشفيات الذكي',
          clientName: 'مستشفى السلام',
          clientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          clientCompany: 'مستشفى السلام',
          amount: 4999,
          duration: '30 يوم',
          status: 'accepted',
          message: 'أنا متحمس للعمل على هذا المشروع. لدي خبرة واسعة في بناء أنظمة إدارة المستشفيات.',
          submittedAt: '2024-01-01',
          respondedAt: '2024-01-03',
          milestones: [
            { name: 'تسليم التصميم', percentage: 20, status: 'completed' },
            { name: 'تسليم قاعدة البيانات', percentage: 30, status: 'completed' },
            { name: 'تسليم الواجهات', percentage: 30, status: 'in_progress' },
            { name: 'تسليم المشروع النهائي', percentage: 20, status: 'pending' }
          ],
          projectDescription: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى، المواعيد، الغرف، والموظفين',
          projectBudget: '5000 - 7000',
          projectDuration: '30-45 يوم',
          projectSkills: ['React', 'Node.js', 'MongoDB']
        },
        {
          id: 2,
          projectName: 'منصة تعليمية متكاملة',
          clientName: 'أكاديمية المستقبل',
          clientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          clientCompany: 'أكاديمية المستقبل',
          amount: 3500,
          duration: '25 يوم',
          status: 'pending',
          message: 'أستطيع بناء منصة تعليمية متكاملة مع نظام إدارة المحتوى والامتحانات.',
          submittedAt: '2024-01-10',
          respondedAt: null,
          milestones: [
            { name: 'تسليم التصميم', percentage: 20, status: 'pending' },
            { name: 'تسليم قاعدة البيانات', percentage: 30, status: 'pending' },
            { name: 'تسليم الواجهات', percentage: 30, status: 'pending' },
            { name: 'تسليم المشروع النهائي', percentage: 20, status: 'pending' }
          ],
          projectDescription: 'منصة تعليمية إلكترونية متكاملة مع نظام إدارة المحتوى والفصول الافتراضية',
          projectBudget: '3000 - 5000',
          projectDuration: '20-30 يوم',
          projectSkills: ['Next.js', 'Django', 'PostgreSQL']
        },
        {
          id: 3,
          projectName: 'متجر إلكتروني متكامل',
          clientName: 'متجر الأصالة',
          clientAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          clientCompany: 'متجر الأصالة',
          amount: 1299,
          duration: '15 يوم',
          status: 'rejected',
          message: 'متخصص في بناء المتاجر الإلكترونية مع نظام دفع متكامل.',
          submittedAt: '2024-01-05',
          respondedAt: '2024-01-08',
          milestones: [],
          projectDescription: 'متجر إلكتروني احترافي مع نظام دفع متكامل',
          projectBudget: '1000 - 2000',
          projectDuration: '10-15 يوم',
          projectSkills: ['React', 'Stripe', 'Tailwind']
        },
        {
          id: 4,
          projectName: 'لوحة تحكم تحليلات',
          clientName: 'شركة البيانات',
          clientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
          clientCompany: 'شركة البيانات',
          amount: 1999,
          duration: '20 يوم',
          status: 'pending',
          message: 'لدي خبرة في بناء لوحات التحكم التفاعلية مع رسوم بيانية متقدمة.',
          submittedAt: '2024-01-12',
          respondedAt: null,
          milestones: [
            { name: 'تسليم التصميم', percentage: 20, status: 'pending' },
            { name: 'تسليم قاعدة البيانات', percentage: 30, status: 'pending' },
            { name: 'تسليم الواجهات', percentage: 30, status: 'pending' },
            { name: 'تسليم المشروع النهائي', percentage: 20, status: 'pending' }
          ],
          projectDescription: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات مع رسوم بيانية متقدمة',
          projectBudget: '1500 - 2500',
          projectDuration: '15-20 يوم',
          projectSkills: ['React', 'D3.js', 'Firebase']
        },
        {
          id: 5,
          projectName: 'نظام إدارة المطاعم',
          clientName: 'مطعم الأندلس',
          clientAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          clientCompany: 'مطعم الأندلس',
          amount: 2499,
          duration: '20 يوم',
          status: 'accepted',
          message: 'سأقوم ببناء نظام متكامل لإدارة المطاعم يشمل كل احتياجاتكم.',
          submittedAt: '2023-12-01',
          respondedAt: '2023-12-05',
          milestones: [
            { name: 'تسليم التصميم', percentage: 20, status: 'completed' },
            { name: 'تسليم قاعدة البيانات', percentage: 30, status: 'completed' },
            { name: 'تسليم الواجهات', percentage: 30, status: 'completed' },
            { name: 'تسليم المشروع النهائي', percentage: 20, status: 'completed' }
          ],
          projectDescription: 'نظام متكامل لإدارة المطاعم يشمل إدارة الطلبات والمخزون',
          projectBudget: '2000 - 3000',
          projectDuration: '15-25 يوم',
          projectSkills: ['Vue.js', 'Laravel', 'MySQL']
        },
        {
          id: 6,
          projectName: 'تطبيق موبايل للتوصيل',
          clientName: 'شركة توصيل',
          clientAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
          clientCompany: 'شركة توصيل',
          amount: 4500,
          duration: '45 يوم',
          status: 'pending',
          message: 'أستطيع بناء تطبيق توصيل متكامل مع لوحة تحكم.',
          submittedAt: '2024-01-08',
          respondedAt: null,
          milestones: [
            { name: 'تسليم التصميم', percentage: 20, status: 'pending' },
            { name: 'تسليم قاعدة البيانات', percentage: 30, status: 'pending' },
            { name: 'تسليم الواجهات', percentage: 30, status: 'pending' },
            { name: 'تسليم المشروع النهائي', percentage: 20, status: 'pending' }
          ],
          projectDescription: 'تطبيق موبايل للتوصيل يشمل تطبيقين (عميل - كابتن) ولوحة تحكم',
          projectBudget: '4000 - 6000',
          projectDuration: '30-45 يوم',
          projectSkills: ['Flutter', 'Node.js', 'MongoDB']
        }
      ];

      setProposals(mockProposals);
      
      // Calculate stats
      const total = mockProposals.length;
      const pending = mockProposals.filter(p => p.status === 'pending').length;
      const accepted = mockProposals.filter(p => p.status === 'accepted').length;
      const rejected = mockProposals.filter(p => p.status === 'rejected').length;
      const totalValue = mockProposals.filter(p => p.status === 'accepted').reduce((sum, p) => sum + p.amount, 0);
      
      setStats({ total, pending, accepted, rejected, totalValue });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'قيد الانتظار ⏳',
      accepted: 'مقبول ✅',
      rejected: 'مرفوض ❌'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✅',
      rejected: '❌'
    };
    return icons[status] || '📌';
  };

  const filteredProposals = proposals.filter(proposal => {
    if (activeFilter !== 'all' && proposal.status !== activeFilter) return false;
    if (searchTerm && !proposal.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSubmitProposal = () => {
    const newId = proposals.length + 1;
    const proposal = {
      id: newId,
      ...newProposal,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      respondedAt: null,
      clientAvatar: `https://randomuser.me/api/portraits/men/${newId}.jpg`,
      milestones: newProposal.milestones.map(m => ({ ...m, status: 'pending' })),
      projectSkills: ['React', 'Node.js', 'MongoDB'] // Mock skills
    };
    setProposals([proposal, ...proposals]);
    setStats({
      ...stats,
      total: stats.total + 1,
      pending: stats.pending + 1
    });
    setShowSubmitModal(false);
    setNewProposal({
      projectId: '',
      projectName: '',
      clientName: '',
      amount: '',
      duration: '',
      message: '',
      milestones: [
        { name: 'تسليم التصميم', percentage: 20 },
        { name: 'تسليم قاعدة البيانات', percentage: 30 },
        { name: 'تسليم الواجهات', percentage: 30 },
        { name: 'تسليم المشروع النهائي', percentage: 20 }
      ]
    });
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
            <p className="text-gray-500">جاري تحميل العروض...</p>
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
              className="flex flex-wrap justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  عروضي 📝
                </h1>
                <p className="text-gray-500 mt-1">إدارة ومتابعة جميع عروضك المقدمة للعملاء</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>➕</span>
                <span>تقديم عرض جديد</span>
              </motion.button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-xs text-gray-500">إجمالي العروض</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">⏳</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-gray-500">قيد الانتظار</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <div className="text-xs text-gray-500">مقبولة</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">❌</div>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-xs text-gray-500">مرفوضة</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">قيمة العروض المقبولة</div>
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
                    placeholder="🔍 ابحث عن عرض (اسم المشروع أو العميل)..."
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
                    { value: 'pending', label: 'قيد الانتظار', icon: '⏳' },
                    { value: 'accepted', label: 'مقبول', icon: '✅' },
                    { value: 'rejected', label: 'مرفوض', icon: '❌' }
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

            {/* Proposals List */}
            {filteredProposals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد عروض</h3>
                <p className="text-gray-500">لم نجد أي عروض مطابقة لمعايير البحث</p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  تقديم عرض جديد
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="wait">
                  {filteredProposals.map((proposal) => (
                    <motion.div
                      key={proposal.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          {/* Proposal Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{proposal.projectName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                {getStatusIcon(proposal.status)} {getStatusText(proposal.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <img src={proposal.clientAvatar} alt={proposal.clientName} className="w-6 h-6 rounded-full" />
                              <span className="text-sm text-gray-600">{proposal.clientName}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-xs text-gray-400">تم الإرسال: {proposal.submittedAt}</span>
                              {proposal.respondedAt && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <span className="text-xs text-gray-400">تم الرد: {proposal.respondedAt}</span>
                                </>
                              )}
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{proposal.message}</p>
                            <div className="flex flex-wrap gap-1">
                              {proposal.projectSkills && proposal.projectSkills.slice(0, 4).map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg">{skill}</span>
                              ))}
                            </div>
                          </div>

                          {/* Amount & Duration */}
                          <div className="text-left min-w-[150px]">
                            <div className="mb-2">
                              <div className="text-2xl font-bold text-indigo-600">${proposal.amount}</div>
                              <div className="text-xs text-gray-400">المبلغ المقترح</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-700">{proposal.duration}</div>
                              <div className="text-xs text-gray-400">مدة التسليم</div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-left">
                            {proposal.status === 'pending' && (
                              <div className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">
                                في انتظار رد العميل
                              </div>
                            )}
                            {proposal.status === 'accepted' && (
                              <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                                تم قبول العرض 🎉
                              </div>
                            )}
                            {proposal.status === 'rejected' && (
                              <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                                لم يتم قبول العرض
                              </div>
                            )}
                          </div>
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

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProposal && (
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
                <h2 className="text-xl font-bold text-gray-800">تفاصيل العرض</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Project & Client Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img src={selectedProposal.clientAvatar} alt={selectedProposal.clientName} className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{selectedProposal.projectName}</h3>
                    <p className="text-sm text-gray-500">{selectedProposal.clientName}</p>
                    <p className="text-xs text-gray-400 mt-1">تم الإرسال: {selectedProposal.submittedAt}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProposal.status)}`}>
                    {getStatusText(selectedProposal.status)}
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">المبلغ المقترح</div>
                    <div className="text-2xl font-bold text-indigo-600">${selectedProposal.amount}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">مدة التسليم</div>
                    <div className="text-2xl font-bold text-purple-600">{selectedProposal.duration}</div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📝 رسالة المبرمج</h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700">{selectedProposal.message}</p>
                  </div>
                </div>

                {/* Project Details from Client */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📋 تفاصيل المشروع من العميل</h3>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700">{selectedProposal.projectDescription}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-400">الميزانية المتوقعة</span>
                        <div className="font-semibold">{selectedProposal.projectBudget}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">المدة المتوقعة</span>
                        <div className="font-semibold">{selectedProposal.projectDuration}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">التقنيات المطلوبة</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProposal.projectSkills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded-lg">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {selectedProposal.milestones && selectedProposal.milestones.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">📊 مراحل الدفع المقترحة</h3>
                    <div className="space-y-3">
                      {selectedProposal.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {milestone.percentage}%
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{milestone.name}</div>
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
                )}

                {/* Action Buttons for Pending Proposals */}
                {selectedProposal.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition">
                      سحب العرض
                    </button>
                    <button className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                      تعديل العرض
                    </button>
                  </div>
                )}

                {selectedProposal.status === 'accepted' && (
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-green-700">🎉 تهانينا! تم قبول عرضك. يمكنك البدء في العمل الآن.</p>
                    <Link to={`/project/${selectedProposal.id}`} className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                      ابدأ المشروع
                    </Link>
                  </div>
                )}

                {selectedProposal.status === 'rejected' && (
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-red-700">للأسف، لم يتم قبول عرضك. لا تيأس، هناك مشاريع أخرى في انتظارك!</p>
                    <button onClick={() => setShowSubmitModal(true)} className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                      تقديم عرض جديد
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Proposal Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowSubmitModal(false)}
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
                <h2 className="text-xl font-bold text-gray-800">تقديم عرض جديد</h2>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم المشروع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProposal.projectName}
                    onChange={(e) => setNewProposal({ ...newProposal, projectName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="أدخل اسم المشروع"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم العميل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProposal.clientName}
                    onChange={(e) => setNewProposal({ ...newProposal, clientName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="أدخل اسم العميل"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المبلغ المقترح ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newProposal.amount}
                      onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      مدة التسليم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProposal.duration}
                      onChange={(e) => setNewProposal({ ...newProposal, duration: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 30 يوم"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رسالتك للعميل <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={newProposal.message}
                    onChange={(e) => setNewProposal({ ...newProposal, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                    placeholder="اشرح للعميل لماذا أنت الشخص المناسب لهذا المشروع..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    مراحل الدفع المقترحة
                  </label>
                  <div className="space-y-2">
                    {newProposal.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={milestone.name}
                          onChange={(e) => {
                            const newMilestones = [...newProposal.milestones];
                            newMilestones[idx].name = e.target.value;
                            setNewProposal({ ...newProposal, milestones: newMilestones });
                          }}
                          className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          placeholder="اسم المرحلة"
                        />
                        <input
                          type="number"
                          value={milestone.percentage}
                          onChange={(e) => {
                            const newMilestones = [...newProposal.milestones];
                            newMilestones[idx].percentage = parseInt(e.target.value);
                            setNewProposal({ ...newProposal, milestones: newMilestones });
                          }}
                          className="w-20 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-center"
                          placeholder="%"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSubmitProposal}
                    className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                  >
                    إرسال العرض
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