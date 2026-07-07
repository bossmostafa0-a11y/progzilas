/* eslint-disable no-useless-assignment */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';
import useNotification from '../../hooks/useNotification';
import { useSocket } from '../../hooks/useSocket';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../../services/notification.service';
import { getClientDashboard } from '../../services/cliecnt.service.js';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { playSound } = useNotification();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  // ✅ نظام الإشعارات
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

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
  const [pendingProposals, setPendingProposals] = useState([]);

  // ✅ تحميل كل البيانات من الباك إند
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [dashboardData, notifResponse, countResponse] = await Promise.all([
          getClientDashboard(),
          getNotifications(),
          getUnreadCount()
        ]);
      // ✅ طباعة البيانات للتحقق
      console.log('📊 Dashboard Data:', dashboardData);
      console.log('📊 Stats:', dashboardData?.stats);
      console.log('📊 Recent Projects:', dashboardData?.recentProjects);
      console.log('📊 Featured Developers:', dashboardData?.featuredDevelopers);
      console.log('📊 Pending Proposals:', dashboardData?.pendingProposals);
        // ✅ ربط stats
        if (dashboardData?.stats) {
          setStats({
            activeProjects: dashboardData.stats.activeProjects || 0,
            completedProjects: dashboardData.stats.completedProjects || 0,
            totalSpent: dashboardData.stats.totalSpent || 0,
            savedAmount: dashboardData.stats.savedAmount || 0,
            activeDevelopers: 0,
            pendingProposals: dashboardData.stats.pendingOffers || 0
          });
        }

        // ✅ ربط recentProjects
        if (dashboardData?.recentProjects) {
          const mappedProjects = dashboardData.recentProjects.map(project => ({
            id: project._id,
            name: project.projectName || '',
            developer: project.developer?.username || '',
            status: project.status || 'pending',
            progress: project.progress || 0,
            amount: project.budget || 0,
            dueDate: project.createdAt || '',
            developerAvatar: project.developer?.profileImage || ''
          }));
          setRecentProjects(mappedProjects);
        } else {
          setRecentProjects([]);
        }

        // ✅ ربط featuredDevelopers
        if (dashboardData?.featuredDevelopers) {
          const mappedDevelopers = dashboardData.featuredDevelopers.map(dev => ({
            id: dev._id,
            name: dev.username || '',
            avatar: dev.profileImage || '',
            rating: dev.rate || 0,
            hourlyRate: dev.hourlyRate,
            projects: 0,
            title: dev.plan || '',
completedProjects: dev.completedProjects,
track: dev.track

          }));
          setFeaturedDevelopers(mappedDevelopers);
        } else {
          setFeaturedDevelopers([]);
        }

        // ✅ ربط pendingProposals
        if (dashboardData?.pendingProposals) {
          const mappedProposals = dashboardData.pendingProposals.map(proposal => ({
            id: proposal._id,
            project: proposal.project?.projectName || '',
            developer: proposal.developer?.username || '',
            amount: proposal.budget || 0,
            duration: proposal.duration || '',
            submittedAt: proposal.createdAt || '',
            status: proposal.status || 'pending'
          }));
          setPendingProposals(mappedProposals);
        } else {
          setPendingProposals([]);
        }

        // ✅ معالجة الإشعارات
        let notificationsData = [];
        if (notifResponse?.data && typeof notifResponse.data === 'object') {
          if (Array.isArray(notifResponse.data)) {
            notificationsData = notifResponse.data;
          } else {
            notificationsData = Object.values(notifResponse.data);
          }
        } else if (notifResponse?.notifications) {
          notificationsData = notifResponse.notifications;
        }
        notificationsData = notificationsData.filter(item => item && typeof item === 'object' && item._id);
        setNotifications(notificationsData);

        // ✅ معالجة العداد
        const count = countResponse?.data?.count || countResponse?.count || 0;
        setUnreadCount(count);

      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ✅ Socket Events
  useEffect(() => {
    if (!socket) return;
    socket.emit('get-notification-count', { userId: user?._id });

    const handleNewNotification = (notification) => {
      playSound();
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleNotificationCount = (data) => {
      setUnreadCount(data.count || 0);
    };

    socket.on('new-notification', handleNewNotification);
    socket.on('notification-count', handleNotificationCount);

    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.off('notification-count', handleNotificationCount);
    };
  }, [socket, user?._id, playSound]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(notif => notif._id === notificationId ? { ...notif, isRead: true } : notif));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (socket) socket.emit('notification-read', { notificationId, userId: user?._id });
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      if (socket) socket.emit('notification-read-all', { userId: user?._id });
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      if (socket) socket.emit('notification-deleted', { notificationId, userId: user?._id });
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      if (socket) socket.emit('notification-cleared', { userId: user?._id });
    } catch (error) {
      console.error('❌ Error deleting all notifications:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) handleMarkAsRead(notification._id);
    let path = '#';
    switch (notification.type) {
      case 'message': path = `/messages`; break;
      case 'project': path = `/project-room/${notification.metadata?.projectId || notification.link}`; break;
      case 'proposal': path = `/dashboard/client/proposals`; break;
      case 'payment': path = `/dashboard/client/purchases`; break;
      case 'milestone': path = `/project/${notification.metadata?.projectId}`; break;
      default: path = notification.link || '#';
    }
    setShowNotifications(false);
    navigate(path);
  };

  const getNotificationIcon = (type) => {
    const icons = { 'message': '💬', 'project': '📁', 'task': '✅', 'member': '👤', 'folder': '📂', 'file': '📄', 'payment': '💰', 'proposal': '📝', 'milestone': '🎯', 'system': '🔔' };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = { 'message': 'bg-blue-50 border-blue-200', 'project': 'bg-purple-50 border-purple-200', 'task': 'bg-green-50 border-green-200', 'member': 'bg-orange-50 border-orange-200', 'folder': 'bg-yellow-50 border-yellow-200', 'file': 'bg-cyan-50 border-cyan-200', 'payment': 'bg-emerald-50 border-emerald-200', 'proposal': 'bg-indigo-50 border-indigo-200', 'milestone': 'bg-pink-50 border-pink-200', 'system': 'bg-gray-50 border-gray-200' };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'الآن';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 172800) return 'أمس';
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleToggleNotifications}
                    className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition relative"
                  >
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-[420px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                          <div>
                            <h3 className="font-bold text-gray-800">الإشعارات</h3>
                            {unreadCount > 0 && <span className="text-xs text-gray-500">{unreadCount} غير مقروءة</span>}
                          </div>
                          <div className="flex gap-2">
                            {unreadCount > 0 && (
                              <button onClick={handleMarkAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 transition px-2 py-1 rounded-lg hover:bg-indigo-50">
                                قراءة الكل
                              </button>
                            )}
                            {notifications.length > 0 && (
                              <button onClick={handleDeleteAllNotifications} className="text-xs text-red-500 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50">
                                حذف الكل
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="overflow-y-auto max-h-[400px]">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <motion.div
                                key={notification._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${!notification.isRead ? 'bg-indigo-50/50' : ''}`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)} border`}>
                                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">{notification.title || 'إشعار جديد'}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{notification.message || notification.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
                                      </div>
                                      {!notification.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />}
                                    </div>
                                  </div>
                                  <button onClick={(e) => handleDeleteNotification(notification._id, e)} className="text-gray-300 hover:text-red-500 transition text-sm flex-shrink-0">✕</button>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <p className="text-4xl mb-2">🔔</p>
                              <p>لا توجد إشعارات</p>
                            </div>
                          )}
                        </div>

                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-200 text-center">
                            <button onClick={() => setShowNotifications(false)} className="text-sm text-gray-500 hover:text-gray-700 transition">
                              إغلاق
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

               
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
                <div className="text-2xl font-bold text-orange-600">{stats.activeProjects}</div>
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
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">📋 أحدث المشاريع</h3>
                  <Link to="/dashboard/client/projects" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? recentProjects.map((project) => (
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
                  )) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-3xl mb-2">📋</p>
                      <p className="text-sm">لا توجد مشاريع حالياً</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">🔔 آخر الإشعارات</h3>
                  <button onClick={handleToggleNotifications} className="text-xs text-indigo-600 hover:text-indigo-700">
                    عرض الكل
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 rounded-xl transition cursor-pointer ${!notif.isRead ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex gap-3">
                          <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{notif.title || 'إشعار جديد'}</h4>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.message || notif.description}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{formatTime(notif.createdAt)}</span>
                          </div>
                          {!notif.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <p className="text-3xl mb-2">🔔</p>
                      <p className="text-sm">لا توجد إشعارات</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Developers and Pending Proposals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">⭐ مبرمجون مميزون</h3>
                  <Link to="/developers" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {featuredDevelopers.length > 0 ? featuredDevelopers.map((dev) => (
                    <div key={dev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={dev.avatar} alt={dev.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-800">{dev.name}</h4>
                          <p className="text-xs text-gray-500">{dev.track}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-xs">{dev.rating}</span>
                            <span className="text-gray-300 text-xs">|</span>
                            <span className="text-xs text-gray-500">{dev.completedProjects} مشروع</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-indigo-600">${dev.hourlyRate}</div>
                        <div className="text-xs text-gray-500">/ ساعة</div>
                        <Link to={`/dev/${dev.id}`} className="text-xs text-indigo-400 hover:text-indigo-600 block mt-1">
                          عرض البروفايل
                        </Link>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-3xl mb-2">⭐</p>
                      <p className="text-sm">لا يوجد مبرمجون مميزون حالياً</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">📝 عروض قيد الانتظار</h3>
                  <Link to="/dashboard/client/proposals" className="text-sm text-indigo-600 hover:text-indigo-700">
                    عرض الكل →
                  </Link>
                </div>
                <div className="space-y-4">
                  {pendingProposals.length > 0 ? pendingProposals.map((proposal) => (
                    <div key={proposal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-800">{proposal.project}</h4>
                        <p className="text-xs text-gray-500">من: {proposal.developer}</p>
                        <p className="text-xs text-gray-400 mt-0.5">تم الإرسال: {formatTime(proposal.submittedAt)}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-indigo-600">${proposal.amount}</div>
                        <div className="text-xs text-gray-500">{`${proposal.duration}يوم`}</div>
                        <Link to={`/dashboard/client/project/${proposal.id}/proposals`} className="text-xs text-indigo-400 hover:text-indigo-600 block mt-1">
                          مراجعة →
                        </Link>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-3xl mb-2">📝</p>
                      <p className="text-sm">لا توجد عروض قيد الانتظار</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <Footer />
    </div>
  );
}