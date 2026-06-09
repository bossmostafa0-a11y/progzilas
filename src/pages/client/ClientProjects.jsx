import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

export default function ClientProjects() {
  
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const mockProjects = [
        {
          id: 1,
          name: 'نظام إدارة المستشفيات الذكي',
          developer: 'أحمد المنصوري',
          developerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          developerId: 1,
          status: 'in_progress',
          progress: 75,
          startDate: '2024-01-01',
          dueDate: '2024-02-15',
          amount: 4999,
          paidAmount: 3000,
          remainingAmount: 1999,
          description: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى، المواعيد، الغرف، والموظفين',
          lastUpdate: 'منذ ساعة',
          messages: 3,
          unreadMessages: 1
        },
        {
          id: 2,
          name: 'منصة تعليمية متكاملة',
          developer: 'يوسف إبراهيم',
          developerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          developerId: 2,
          status: 'review',
          progress: 90,
          startDate: '2024-01-10',
          dueDate: '2024-02-10',
          amount: 3500,
          paidAmount: 2000,
          remainingAmount: 1500,
          description: 'منصة تعليمية إلكترونية متكاملة مع نظام إدارة المحتوى والامتحانات',
          lastUpdate: 'منذ 3 ساعات',
          messages: 5,
          unreadMessages: 2
        },
        {
          id: 3,
          name: 'متجر إلكتروني متكامل',
          developer: 'نورة خالد',
          developerAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
          developerId: 3,
          status: 'completed',
          progress: 100,
          startDate: '2024-01-15',
          dueDate: '2024-02-01',
          amount: 1299,
          paidAmount: 1299,
          remainingAmount: 0,
          description: 'متجر إلكتروني احترافي مع نظام دفع متكامل',
          lastUpdate: 'منذ يوم',
          messages: 8,
          unreadMessages: 0
        },
        {
          id: 4,
          name: 'لوحة تحكم تحليلات',
          developer: 'عبدالله السالم',
          developerAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
          developerId: 4,
          status: 'pending',
          progress: 30,
          startDate: '2024-01-20',
          dueDate: '2024-02-28',
          amount: 1999,
          paidAmount: 500,
          remainingAmount: 1499,
          description: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات',
          lastUpdate: 'منذ 3 أيام',
          messages: 2,
          unreadMessages: 0
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
      completed: 'مكتمل',
      in_progress: 'قيد التنفيذ',
      review: 'مراجعة',
      pending: 'قيد الانتظار'
    };
    return texts[status] || status;
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter !== 'all' && project.status !== activeFilter) return false;
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.developer.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalSpent: projects.reduce((sum, p) => sum + p.paidAmount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <ClientSidebar activePage="projects" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                مشاريعي 📋
              </h1>
              <p className="text-gray-500 mt-1">إدارة ومتابعة جميع مشاريعك مع المبرمجين</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-xs text-gray-500">إجمالي المشاريع</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">🔄</div>
                <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
                <div className="text-xs text-gray-500">قيد التنفيذ</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-500">مكتملة</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-2xl font-bold text-purple-600">${stats.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">إجمالي المدفوع</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن مشروع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'الكل', icon: '📋' },
                    { value: 'in_progress', label: 'قيد التنفيذ', icon: '🔄' },
                    { value: 'review', label: 'مراجعة', icon: '📋' },
                    { value: 'pending', label: 'قيد الانتظار', icon: '⏳' },
                    { value: 'completed', label: 'مكتمل', icon: '✅' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                        activeFilter === filter.value
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد مشاريع</h3>
                <p className="text-gray-500">لم نجد أي مشاريع مطابقة لمعايير البحث</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusText(project.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={project.developerAvatar} alt={project.developer} className="w-6 h-6 rounded-full" />
                            <span className="text-sm text-gray-600">{project.developer}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-xs text-gray-400">تسليم: {project.dueDate}</span>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                        </div>
                        <div className="text-left min-w-[150px]">
                          <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">التقدم</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-semibold">{project.progress}%</span>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-bold text-indigo-600">${project.amount}</div>
                            <div className="text-xs text-gray-400">المتبقي: ${project.remainingAmount}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/messages?chat=${project.developerId}`}>
                            <button className="relative px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition">
                              💬 رسائل
                              {project.unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                  {project.unreadMessages}
                                </span>
                              )}
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setShowDetailsModal(true);
                            }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                          >
                            تفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">{selectedProject.name}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={selectedProject.developerAvatar} alt={selectedProject.developer} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold">المطور: {selectedProject.developer}</div>
                    <div className="text-sm text-gray-500">مشروع #{selectedProject.id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">تاريخ البدء</div>
                    <div className="font-semibold">{selectedProject.startDate}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500">تاريخ التسليم</div>
                    <div className="font-semibold">{selectedProject.dueDate}</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500">المبلغ</div>
                  <div className="font-bold text-indigo-600">${selectedProject.amount}</div>
                  <div className="text-xs text-gray-400">المدفوع: ${selectedProject.paidAmount} | المتبقي: ${selectedProject.remainingAmount}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إغلاق
                </button>
                <Link to={`/messages?chat=${selectedProject.developerId}`} className="flex-1">
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                    إرسال رسالة
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}