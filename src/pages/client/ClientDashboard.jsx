import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    budget: '',
    duration: '',
    category: ''
  });

  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    savedAmount: 0,
    activeDevelopers: 0,
    pendingProposals: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [featuredDevelopers, setFeaturedDevelopers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingProposals, setPendingProposals] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activeProjects: 4,
        completedProjects: 12,
        totalSpent: 28450,
        savedAmount: 12500,
        activeDevelopers: 3,
        pendingProposals: 5
      });

      setRecentProjects([
        { id: 1, name: 'نظام إدارة المستشفيات الذكي', developer: 'أحمد المنصوري', status: 'in_progress', progress: 75, dueDate: '2024-02-15', amount: 4999 },
        { id: 2, name: 'منصة تعليمية متكاملة', developer: 'يوسف إبراهيم', status: 'review', progress: 90, dueDate: '2024-02-10', amount: 3500 },
        { id: 3, name: 'متجر إلكتروني متكامل', developer: 'نورة خالد', status: 'completed', progress: 100, dueDate: '2024-02-01', amount: 1299 },
        { id: 4, name: 'لوحة تحكم تحليلات', developer: 'عبدالله السالم', status: 'pending', progress: 30, dueDate: '2024-02-28', amount: 1999 }
      ]);

      setFeaturedDevelopers([
        { id: 1, name: 'أحمد المنصوري', title: 'Full Stack Architect', rating: 4.9, projects: 47, hourlyRate: 75, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 2, name: 'سارة القحطاني', title: 'Frontend Expert', rating: 4.8, projects: 38, hourlyRate: 65, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
        { id: 3, name: 'يوسف إبراهيم', title: 'Mobile Dev Expert', rating: 4.9, projects: 52, hourlyRate: 70, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }
      ]);

      setNotifications([
        { id: 1, type: 'proposal', title: 'عرض جديد على مشروعك', message: 'قام أحمد المنصوري بتقديم عرض على مشروع نظام المستشفيات', time: 'منذ ساعة', read: false, link: '/dashboard/client/proposals' },
        { id: 2, type: 'milestone', title: 'تم إنجاز مرحلة جديدة', message: 'تم إنجاز مرحلة تصميم قاعدة البيانات في مشروع المنصة التعليمية', time: 'منذ 3 ساعات', read: false, link: '/project/2' },
        { id: 3, type: 'payment', title: 'تم استلام دفعتك', message: 'تم استلام مبلغ $1500 بنجاح', time: 'منذ يوم', read: true, link: '/dashboard/client/purchases' },
        { id: 4, type: 'message', title: 'رسالة جديدة', message: 'استلمت رسالة جديدة من المبرمج أحمد المنصوري', time: 'منذ يومين', read: true, link: '/messages' }
      ]);

      setPendingProposals([
        { id: 1, project: 'نظام إدارة المستشفيات', developer: 'أحمد المنصوري', amount: 4999, duration: '30 يوم', submittedAt: '2024-02-01' },
        { id: 2, project: 'منصة تعليمية', developer: 'يوسف إبراهيم', amount: 3500, duration: '25 يوم', submittedAt: '2024-01-30' },
        { id: 3, project: 'تطبيق موبايل', developer: 'هند العتيبي', amount: 4500, duration: '45 يوم', submittedAt: '2024-01-28' }
      ]);

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

  const getNotificationIcon = (type) => {
    const icons = {
      proposal: '📝',
      milestone: '🎯',
      payment: '💰',
      message: '💬'
    };
    return icons[type] || '📌';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handlePostProject = () => {
    alert('تم نشر مشروعك بنجاح! سيتم إشعار المبرمجين');
    setShowProjectModal(false);
    setNewProject({ name: '', description: '', budget: '', duration: '', category: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل لوحة التحكم...</p>
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
        <ClientSidebar activePage="dashboard" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  مرحباً بك، {user?.name || 'عميل'} 👋
                </h1>
                <p className="text-gray-500 mt-1">إليك ملخص مشاريعك ونشاطك</p>
              </div>
              <div className="flex gap-3">
                <Link to="/notifications" className="relative">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition">
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </Link>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>نشر مشروع جديد</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-2xl font-bold text-indigo-600">{stats.activeProjects}</div>
                <div className="text-xs text-gray-500">مشاريع نشطة</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                <div className="text-xs text-gray-500">مشاريع مكتملة</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-2xl font-bold text-purple-600">${stats.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">إجمالي المصروف</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">🏷️</div>
                <div className="text-2xl font-bold text-green-600">${stats.savedAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">وفرتها</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">👨‍💻</div>
                <div className="text-2xl font-bold text-orange-600">{stats.activeDevelopers}</div>
                <div className="text-xs text-gray-500">مبرمجين نشطين</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-2xl font-bold text-red-600">{stats.pendingProposals}</div>
                <div className="text-xs text-gray-500">عروض قيد الانتظار</div>
              </div>
            </div>

            {/* Recent Projects and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Projects */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">📋 أحدث المشاريع</h3>
                  <Link to="/dashboard/client/projects" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.developer}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-indigo-600">${project.amount}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">🔔 الإشعارات</h3>
                  <Link to="/notifications" className="text-xs text-indigo-600 hover:text-indigo-700">
                    عرض الكل
                  </Link>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <Link to={notif.link} key={notif.id}>
                      <div className={`p-3 rounded-xl transition ${!notif.read ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex gap-3">
                          <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Developers and Pending Proposals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Developers */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">⭐ مبرمجون مميزون</h3>
                  <Link to="/developers" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {featuredDevelopers.map((dev) => (
                    <div key={dev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={dev.avatar} alt={dev.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-800">{dev.name}</h4>
                          <p className="text-xs text-gray-500">{dev.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-xs">{dev.rating}</span>
                            <span className="text-gray-300 text-xs">|</span>
                            <span className="text-xs text-gray-500">{dev.projects} مشروع</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-indigo-600">${dev.hourlyRate}</div>
                        <div className="text-xs text-gray-500">/ ساعة</div>
                        <Link to={`/dev/${dev.name}`} className="text-xs text-indigo-400 hover:text-indigo-600 block mt-1">
                          عرض البروفايل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Proposals */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">📝 عروض قيد الانتظار</h3>
                  <Link to="/dashboard/client/proposals" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {pendingProposals.map((proposal) => (
                    <div key={proposal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-800">{proposal.project}</h4>
                        <p className="text-xs text-gray-500">من: {proposal.developer}</p>
                        <p className="text-xs text-gray-400 mt-0.5">تم الإرسال: {proposal.submittedAt}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-indigo-600">${proposal.amount}</div>
                        <div className="text-xs text-gray-500">{proposal.duration}</div>
                        <Link to={`/dashboard/client/project/${proposal.id}/proposals`} className="text-xs text-indigo-400 hover:text-indigo-600 block mt-1">
                          مراجعة →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">نشر مشروع جديد</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المشروع</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="مثال: نظام إدارة متكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">وصف المشروع</label>
                  <textarea
                    rows="4"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                    placeholder="وصف تفصيلي للمشروع..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الميزانية ($)</label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">المدة المتوقعة</label>
                    <input
                      type="text"
                      value={newProject.duration}
                      onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: 30 يوم"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التصنيف</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">اختر التصنيف</option>
                    <option value="web">تطوير ويب</option>
                    <option value="mobile">تطبيق موبايل</option>
                    <option value="design">تصميم واجهات</option>
                    <option value="ai">الذكاء الاصطناعي</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handlePostProject}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  نشر المشروع
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}