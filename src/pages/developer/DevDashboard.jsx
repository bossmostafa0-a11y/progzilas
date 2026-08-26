/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-assignment */
// src/pages/developer/DevDashboard.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../../services/notification.service';
import { getDeveloperDashboard } from '../../services/develper.service.js';

const NOTIFICATION_SOUND = '/notification.mp3';

export default function DevDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationsRef = useRef(null);
  const hasLoadedNotifications = useRef(false);
  const audioRef = useRef(null);
  const dashboardLoadedRef = useRef(false);
    const userName = user?.name || user?.username || 'مبرمج';
  const [stats, setStats] = useState({
    totalProjects: 0, completedProjects: 0, ongoingProjects: 0,
    totalEarnings: 0, monthlyEarnings: 0, weeklyEarnings: 0, todayEarnings: 0,
    totalSales: 0, storeSales: 0, customProjects: 0,
    rating: 0, responseRate: 0, pendingAmount: 0, availableBalance: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [storeStats, setStoreStats] = useState({ totalProducts: 0, totalViews: 0, conversionRate: 0 });
  const [chartData, setChartData] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  // ✅ تعريف formatTime في البداية
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

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response?.data?.count || response?.count || 0);
    } catch (error) {
      console.error('❌ Error loading unread count:', error);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDeveloperDashboard();
      
      // ✅ استخراج البيانات من الـ response بشكل صحيح
      const data = response?.data || response || {};

      // ✅ تحديث الإحصائيات
      if (data?.statistics) {
        setStats({
          totalProjects: data.statistics.totalProjects ?? 0,
          completedProjects: data.statistics.completedProjects ?? 0,
          ongoingProjects: data.statistics.ongoingProjects ?? 0,
          totalEarnings: (data.statistics.freelanceRevenue ?? 0) + (data.statistics.marketplaceRevenue ?? 0),
          monthlyEarnings: data.earnings?.month ?? 0,
          weeklyEarnings: data.earnings?.week ?? 0,
          todayEarnings: data.earnings?.today ?? 0,
          totalSales: data.statistics.totalOrders ?? 0,
          storeSales: data.statistics.marketplaceRevenue ?? 0,
          customProjects: data.statistics.freelanceRevenue ?? 0,
          rating: data.statistics.averageRating ?? 0,
          responseRate: data.statistics.totalReviews ?? 0,
          pendingAmount: data.statistics.pendingBalance ?? 0,
          availableBalance: data.statistics.availableBalance ?? 0
        });
      }

      // ✅ تحديث إحصائيات المتجر
      if (data?.statistics) {
        setStoreStats({
          totalProducts: data.statistics.totalProducts ?? 0,
          totalViews: data.statistics.totalViews ?? 0,
          conversionRate: data.statistics.conversionRate ?? 0
        });
      }

      // ✅ تحديث بيانات الرسم البياني
      if (data?.charts?.monthlyChart?.length) {
        const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        setChartData(data.charts.monthlyChart.map(item => ({
          month: arabicMonths[(item._id?.month ?? 1) - 1],
          earnings: item.earnings ?? 0
        })));
      } else {
        setChartData([]);
      }
      
      // ✅ تحديث المشاريع الأخيرة
      if (data?.recentProjects?.length) {
        setRecentProjects(data.recentProjects.map(p => ({
          id: p._id ?? p.id,
          name: p.projectName ?? 'مشروع بدون اسم',
          client: p.owner?.username ?? p.client?.username ?? 'عميل',
          clientAvatar: p.owner?.profileImage ?? p.client?.profileImage ?? 'https://randomuser.me/api/portraits/men/1.jpg',
          status: p.status ?? 'pending',
          progress: p.progress ?? 0,
          amount: p.amount ?? p.budget ?? 0,
          lastUpdate: p.updatedAt ? formatTime(p.updatedAt) : ''
        })));
      } else {
        setRecentProjects([]);
      }
      
      // ✅ تحديث المبيعات الأخيرة
      if (data?.recentSales?.length) {
        setRecentSales(data.recentSales.map(s => ({
          id: s._id ?? s.id,
          project: s.project?.projectName ?? 'مشروع',
          buyer: s.buyer?.username ?? 'مشتري',
          buyerAvatar: s.buyer?.profileImage ?? 'https://randomuser.me/api/portraits/men/1.jpg',
          amount: s.amount ?? 0,
          date: s.date ?? s.createdAt ?? '',
          package: s.package ?? 'Basic'
        })));
      } else {
        setRecentSales([]);
      }
      
      // ✅ تحديث الرسائل الأخيرة
      if (data?.recentMessages?.length) {
        setRecentMessages(data.recentMessages.map(m => ({
          id: m._id ?? m.id,
          from: m.client?.username ?? 'مستخدم',
          avatar: m.client?.profileImage ?? 'https://randomuser.me/api/portraits/men/1.jpg',
          message: m.lastMessage?.text ?? '',
          time: m.createdAt ? formatTime(m.createdAt) : '',
          unread: m.lastMessage?.seen ?? !m.read
        })));
      } else {
        setRecentMessages([]);
      }
      
      // ✅ تحديث المشاريع الأكثر مبيعاً
      if (data?.topSellingProducts?.length) {
        setTopProjects(data.topSellingProducts.map(p => ({
          id: p._id ?? p.id,
          name: p.projectName ?? 'مشروع',
          sales: p.sales ?? 0,
          revenue: p.revenue ?? (p.sales ?? 0) * (p.price ?? 0),
          rating: p.rating ?? 0
        })));
      } else {
        setTopProjects([]);
      }
      
      // ✅ تحديث المواعيد القادمة
      if (data?.upcomingTasks?.length) {
        setUpcomingDeadlines(data.upcomingTasks.map(t => ({
          id: t._id ?? t.id,
          project: t.project?.projectName ?? 'مشروع',
          client: t.client?.username ?? 'عميل',
          dueDate: t.dueDate ?? '',
          daysLeft: t.daysLeft ?? 0,
          priority: t.priority ?? 'medium'
        })));
      } else {
        setUpcomingDeadlines([]);
      }
      
      // ✅ تحديث سجل النشاط
      if (data?.latestNotifications?.length) {
        setActivityLog(data.latestNotifications.map(n => ({
          id: n._id ?? n.id,
          action: n.message ?? n.title ?? '',
          type: n.type ?? 'system',
          date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('ar-EG') : '',
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''
        })));
      } else {
        setActivityLog([]);
      }
      
      dashboardLoadedRef.current = true;
    } catch (err) {
      console.error('❌ Error loading dashboard:', err);
      setError(err?.response?.data?.message || err?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!dashboardLoadedRef.current) {
      loadDashboardData();
      loadUnreadCount();
    }
  }, [loadDashboardData, loadUnreadCount]);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) { audioRef.current = new Audio(NOTIFICATION_SOUND); audioRef.current.volume = 0.5; }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch (error) {
      console.log(error)
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    if (notificationsLoading) return;
    try {
      setNotificationsLoading(true);
      const response = await getNotifications();
      let notificationsData = [];
      if (Array.isArray(response?.data)) notificationsData = response.data;
      else if (response?.data?.notifications) notificationsData = response.data.notifications;
      else if (Array.isArray(response?.notifications)) notificationsData = response.notifications;
      else if (response?.data && typeof response.data === 'object') notificationsData = Object.values(response.data).filter(item => item?._id);
      setNotifications(notificationsData);
    } catch (error) { console.error('❌ Error:', error); }
    finally { setNotificationsLoading(false); }
  }, [notificationsLoading]);

  const handleNewNotification = useCallback((notification) => {
    playNotificationSound();
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, [playNotificationSound]);

  const handleNotificationCount = useCallback((data) => setUnreadCount(data.count || 0), []);
  const handleNotificationReadSocket = useCallback((data) => {
    setNotifications(prev => prev.map(n => n._id === data.notificationId ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  const handleNotificationReadAllSocket = useCallback(() => { setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); setUnreadCount(0); }, []);
  const handleNotificationDeletedSocket = useCallback((data) => setNotifications(prev => prev.filter(n => n._id !== data.notificationId)), []);
  const handleNotificationClearedSocket = useCallback(() => { setNotifications([]); setUnreadCount(0); }, []);

  useEffect(() => {
    if (showNotifications && !notifications.length && !hasLoadedNotifications.current && !notificationsLoading) {
      hasLoadedNotifications.current = true; loadNotifications();
    }
  }, [showNotifications, loadNotifications, notifications.length, notificationsLoading]);

  const handleToggleNotifications = () => {
    if (showNotifications) { setShowNotifications(false); hasLoadedNotifications.current = false; }
    else setShowNotifications(true);
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit('user-online', { userId: user?._id });
    socket.emit('get-notification-count', { userId: user?._id });
    socket.on('new-notification', handleNewNotification);
    socket.on('notification-count', handleNotificationCount);
    socket.on('notification-read', handleNotificationReadSocket);
    socket.on('notification-read-all', handleNotificationReadAllSocket);
    socket.on('notification-deleted', handleNotificationDeletedSocket);
    socket.on('notification-cleared', handleNotificationClearedSocket);
    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.off('notification-count', handleNotificationCount);
      socket.off('notification-read', handleNotificationReadSocket);
      socket.off('notification-read-all', handleNotificationReadAllSocket);
      socket.off('notification-deleted', handleNotificationDeletedSocket);
      socket.off('notification-cleared', handleNotificationClearedSocket);
    };
  }, [socket, user?._id, handleNewNotification, handleNotificationCount, handleNotificationReadSocket, handleNotificationReadAllSocket, handleNotificationDeletedSocket, handleNotificationClearedSocket]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (socket) socket.emit('notification-read', { notificationId, userId: user?._id });
    } catch (error) {
            console.log(error)

    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); setUnreadCount(0);
      if (socket) socket.emit('notification-read-all', { userId: user?._id });
    } catch (error) {
            console.log(error)

    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (socket) socket.emit('notification-deleted', { notificationId, userId: user?._id });
    } catch (error) {
            console.log(error)

    }
  };

  const handleDeleteAllNotifications = async () => {
    try { await deleteAllNotifications(); setNotifications([]); setUnreadCount(0); if (socket) socket.emit('notification-cleared', { userId: user?._id }); }
    catch (error) {
            console.log(error)

    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) handleMarkAsRead(notification._id);
    const paths = { message: '/messages', project: `/dashboard/developer/projects`, task: `/project/${notification.metadata?.projectId}/tasks`, payment: `/project/${notification.metadata?.projectId}?tab=payments`, file: `/project/${notification.metadata?.projectId}?tab=files`, folder: `/project/${notification.metadata?.projectId}?tab=files` };
    setShowNotifications(false); hasLoadedNotifications.current = false;
    navigate(paths[notification.type] || notification.link || '#');
  };

  const getNotificationIcon = (type) => ({ 'message': '💬', 'project': '📁', 'task': '✅', 'member': '👤', 'folder': '📂', 'file': '📄', 'payment': '💰', 'system': '🔔' }[type] || '🔔');
  const getNotificationColor = (type) => ({ 'message': 'bg-blue-50 border-blue-200', 'project': 'bg-purple-50 border-purple-200', 'task': 'bg-green-50 border-green-200', 'member': 'bg-orange-50 border-orange-200', 'folder': 'bg-yellow-50 border-yellow-200', 'file': 'bg-cyan-50 border-cyan-200', 'payment': 'bg-emerald-50 border-emerald-200', 'system': 'bg-gray-50 border-gray-200' }[type] || 'bg-gray-50 border-gray-200');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false); hasLoadedNotifications.current = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const cardVariants = { hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } } };
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const fadeInLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };
  const fadeInRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  const handleWithdraw = () => navigate('/payment', { state: { purpose: 'withdraw', amount: stats.availableBalance } });
  const getStatusColor = (s) => ({ completed: 'bg-green-100 text-green-700', in_progress: 'bg-blue-100 text-blue-700', review: 'bg-yellow-100 text-yellow-700', pending: 'bg-orange-100 text-orange-700' }[s] || 'bg-gray-100 text-gray-700');
  const getStatusText = (s) => ({ completed: 'مكتمل ✅', in_progress: 'قيد التنفيذ 🔄', review: 'مراجعة 📋', pending: 'قيد الانتظار ⏳' }[s] || s);
  const getPriorityColor = (p) => p === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600';

  if (loading) return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => { dashboardLoadedRef.current = false; loadDashboardData(); }} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">🔄 إعادة المحاولة</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  const maxEarning = Math.max(...chartData.map(i => i.earnings || 0), 1);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20" dir="rtl">
      <Navbar />
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="dashboard" />
        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header + Notifications */}
           {/*   <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">مرحباً بك، {user?.username || 'مبرمج'} 👋</h1>
                <p className="text-gray-500 mt-1">إليك ملخص نشاطك وأرباحك لهذا الشهر</p>
              </div>
            <div className="relative" ref={notificationsRef}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleToggleNotifications} className="p-2 bg-white rounded-full shadow-lg relative">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 top-full mt-2 w-[420px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div><h3 className="font-bold">الإشعارات</h3>{unreadCount > 0 && <span className="text-xs text-gray-500">{unreadCount} غير مقروءة</span>}</div>
                        <div className="flex gap-2">
                          {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1">قراءة الكل</button>}
                          {notifications.length > 0 && <button onClick={handleDeleteAllNotifications} className="text-xs text-red-500 hover:text-red-600 px-2 py-1">حذف الكل</button>}
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-[400px]">
                        {notificationsLoading ? <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                        : notifications.length > 0 ? notifications.map(n => (
                          <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => handleNotificationClick(n)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${!n.isRead ? 'bg-indigo-50/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(n.type)} border`}><span>{getNotificationIcon(n.type)}</span></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold">{n.title || 'إشعار جديد'}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{n.message || n.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                                {!n.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1" />}
                              </div>
                              <button onClick={(e) => handleDeleteNotification(n._id, e)} className="text-gray-300 hover:text-red-500">✕</button>
                            </div>
                          </motion.div>
                        )) : <div className="text-center py-8 text-gray-400"><p className="text-4xl mb-2">🔔</p><p>لا توجد إشعارات</p></div>}
                      </div>
                      {notifications.length > 0 && <div className="p-3 border-t text-center"><button onClick={() => { setShowNotifications(false); hasLoadedNotifications.current = false; }} className="text-sm text-gray-500">إغلاق</button></div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>*/}

            {/* Main Stats */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: '💰', title: 'إجمالي الأرباح', value: `$${stats.totalEarnings.toLocaleString()}`, change: `+$${stats.monthlyEarnings.toLocaleString()}`, color: 'from-indigo-500 to-purple-500' },
                { icon: '✅', title: 'المشاريع المنجزة', value: stats.completedProjects, subtitle: `من إجمالي ${stats.totalProjects}`, color: 'from-green-500 to-emerald-500' },
                { icon: '🏆', title: 'إجمالي المبيعات', value: stats.totalSales, color: 'from-purple-500 to-pink-500' },
                { icon: '⭐', title: 'التقييم', value: stats.rating || 0, subtitle: `نسبة الاستجابة ${stats.responseRate || 0}%`, color: 'from-yellow-500 to-orange-500' }
              ].map((card, idx) => (
                <motion.div key={idx} variants={cardVariants} whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}><span className="text-2xl">{card.icon}</span></div>
                    <span className="text-xs text-gray-400">{card.title}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">{card.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-600">{card.change}</span>
                    {card.subtitle && <span className="text-xs text-gray-400">{card.subtitle}</span>}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Secondary Stats */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '📊', value: `$${stats.weeklyEarnings.toLocaleString()}`, label: 'هذا الأسبوع' },
                { icon: '📈', value: `$${stats.storeSales.toLocaleString()}`, label: 'مبيعات المتجر' },
                { icon: '💼', value: `$${stats.customProjects.toLocaleString()}`, label: 'مشاريع مخصصة' },
                { icon: '👁️', value: storeStats.totalViews.toLocaleString(), label: 'مشاهدة المنتجات' }
              ].map((item, idx) => (
                <motion.div key={idx} variants={cardVariants} whileHover={{ scale: 1.02, y: -3 }} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all">
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <div className="text-lg font-bold text-indigo-600">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Balance Card */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
              <motion.div animate={{ x: [-100, 200] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 left-0 w-32 h-full bg-white/20 skew-x-12" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-white/80 text-sm mb-1">💰 الرصيد المتاح للسحب</p>
                  <p className="text-4xl font-bold">${stats.availableBalance.toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-2">الرصيد المعلق: ${stats.pendingAmount.toLocaleString()}</p>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWithdraw} className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-semibold">سحب الأرباح 💸</motion.button>
              </div>
            </motion.div>

            {/* Chart & Top Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">📈 الأرباح الشهرية</h3>
                  <div className="flex gap-2">
                    {['week', 'month', 'year'].map(p => (
                      <motion.button key={p} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedPeriod(p)} className={`px-3 py-1 rounded-lg text-sm ${selectedPeriod === p ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{p === 'week' ? 'أسبوع' : p === 'month' ? 'شهر' : 'سنة'}</motion.button>
                    ))}
                  </div>
                </div>
                <div className="h-64 flex items-end gap-3">
                  {chartData.length > 0 ? chartData.map((item, idx) => (
                    <motion.div key={idx} className="flex-1 flex flex-col items-center gap-2 group" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${((item.earnings || 0) / maxEarning) * 100}%` }} transition={{ duration: 0.6, delay: idx * 0.1, type: "spring" }} className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg relative cursor-pointer" style={{ height: `${((item.earnings || 0) / maxEarning) * 100}%`, minHeight: '30px' }} whileHover={{ scale: 1.05 }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">${item.earnings?.toLocaleString()}</div>
                        <div className="text-center text-white text-xs font-bold absolute bottom-1 w-full">{item.earnings}</div>
                      </motion.div>
                      <span className="text-xs text-gray-500">{item.month}</span>
                    </motion.div>
                  )) : <div className="flex-1 flex items-center justify-center text-gray-400">لا توجد بيانات</div>}
                </div>
              </motion.div>
              <motion.div variants={fadeInRight} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">🏆 المشاريع الأكثر مبيعاً</h3>
                <div className="space-y-4">
                  {topProjects.length > 0 ? topProjects.map((p, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ x: -5 }} className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{idx + 1}</div><div><div className="font-semibold">{p.name}</div><div className="text-xs text-gray-500">{p.sales} عملية بيع</div></div></div>
                      <div className="text-left"><div className="font-bold text-indigo-600">${p.revenue?.toLocaleString()}</div><div className="text-xs text-gray-400">⭐ {p.rating}</div></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🏆</p><p>لا توجد مشاريع بعد</p></div>}
                </div>
              </motion.div>
            </div>

            {/* Recent Projects & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">📋 المشاريع الجارية</h3><Link to="/dashboard/developer/projects" className="text-sm text-indigo-600">عرض الكل →</Link></div>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? recentProjects.map((p, idx) => (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3 flex-1"><img src={p.clientAvatar} alt={p.client} className="w-10 h-10 rounded-full" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg'; }} /><div><div className="font-semibold">{p.name}</div><div className="text-xs text-gray-500">{p.client}</div></div></div>
                      <div className="flex-1"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${p.progress}%` }} /></div><span className="text-xs">{p.progress}%</span></div><div className="flex justify-between mt-1"><span className="text-xs text-gray-400">{p.lastUpdate}</span><span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(p.status)}`}>{getStatusText(p.status)}</span></div></div>
                      <div className="text-left min-w-[100px]"><div className="font-bold text-indigo-600">${p.amount?.toLocaleString()}</div><Link to={`/project/${p.id}`} className="text-xs text-indigo-400">إدارة →</Link></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">📋</p><p>لا توجد مشاريع جارية</p></div>}
                </div>
              </motion.div>
              <motion.div variants={fadeInRight} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">⏰ المواعيد القادمة</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((d, idx) => (
                    <motion.div key={d.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`p-3 rounded-xl cursor-pointer ${d.priority === 'high' ? 'bg-red-50' : 'bg-orange-50'}`}>
                      <div className="flex justify-between items-start mb-2"><div><div className="font-semibold">{d.project}</div><div className="text-xs text-gray-500">{d.client}</div></div><span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(d.priority)}`}>{d.priority === 'high' ? 'عاجل' : 'متوسط'}</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-gray-500">تسليم: {d.dueDate}</span><span className="text-xs font-semibold text-red-500">{d.daysLeft} أيام متبقية</span></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">⏰</p><p>لا توجد مواعيد قادمة</p></div>}
                </div>
              </motion.div>
            </div>

            {/* Sales & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">🛒 آخر المبيعات</h3><Link to="/dashboard/developer/store" className="text-sm text-indigo-600">عرض الكل →</Link></div>
                <div className="space-y-3">
                  {recentSales.length > 0 ? recentSales.map((s, idx) => (
                    <motion.div key={s.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3"><img src={s.buyerAvatar} alt={s.buyer} className="w-10 h-10 rounded-full" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg'; }} /><div><div className="font-semibold">{s.project}</div><div className="text-xs text-gray-500">{s.buyer}</div><div className="text-xs text-gray-400">{s.date}</div></div></div>
                      <div className="text-left"><div className="text-lg font-bold text-green-600">${s.amount?.toLocaleString()}</div><div className="text-xs text-gray-400">{s.package}</div></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🛒</p><p>لا توجد مبيعات بعد</p></div>}
                </div>
              </motion.div>
              <motion.div variants={fadeInRight} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">💬 آخر الرسائل</h3><Link to="/messages" className="text-sm text-indigo-600">عرض الكل →</Link></div>
                <div className="space-y-3">
                  {recentMessages.length > 0 ? recentMessages.map((m, idx) => (
                    <motion.div key={m.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`p-3 rounded-xl cursor-pointer ${m.unread ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                      <div className="flex gap-3"><img src={m.avatar} alt={m.from} className="w-10 h-10 rounded-full" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg'; }} /><div><div className="font-semibold">{m.from}</div><p className="text-sm text-gray-600">{m.message}</p><div className="text-xs text-gray-400 mt-1">{m.time}</div></div>{m.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}</div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">💬</p><p>لا توجد رسائل بعد</p></div>}
                </div>
              </motion.div>
            </div>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}