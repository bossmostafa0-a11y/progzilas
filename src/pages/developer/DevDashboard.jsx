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

// ✅ صوت الإشعار
const NOTIFICATION_SOUND = '/notification.mp3';

export default function DevDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // ✅ حالة الإشعارات
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationsRef = useRef(null);
  const hasLoadedNotifications = useRef(false);
  const audioRef = useRef(null);
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    todayEarnings: 0,
    totalSales: 0,
    storeSales: 0,
    customProjects: 0,
    rating: 0,
    responseRate: 0,
    pendingAmount: 0,
    availableBalance: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  
  const [topProjects, setTopProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [storeStats, setStoreStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  // ✅ تشغيل صوت الإشعار
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND);
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('🔇 Sound play failed:', err);
      });
    } catch (error) {
      console.log('🔇 Audio error:', error);
    }
  }, []);

  // ✅ جلب الإشعارات
 const loadNotifications = useCallback(async () => {
  if (notificationsLoading) return;
  
  try {
    setNotificationsLoading(true);
    const response = await getNotifications();
    console.log('📥 Notifications full response:', response);
    
    // ✅ استخراج الإشعارات بالشكل الصحيح
    let notificationsData = [];
    
    if (Array.isArray(response?.data)) {
      // لو data عبارة عن array مباشرة
      notificationsData = response.data;
    } else if (response?.data?.notifications && Array.isArray(response.data.notifications)) {
      // لو data فيها notifications array
      notificationsData = response.data.notifications;
    } else if (Array.isArray(response?.notifications)) {
      // لو الـ response نفسه فيه notifications
      notificationsData = response.notifications;
    } else if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // ✅ الحالة بتاعتك: data عبارة عن object فيه keys أرقام
      // تحويل الـ object إلى array
      notificationsData = Object.values(response.data).filter(item => 
        item && typeof item === 'object' && item._id
      );
    }
    
    console.log('📥 Processed notifications:', notificationsData);
    setNotifications(notificationsData);
  } catch (error) {
    console.error('❌ Error loading notifications:', error);
  } finally {
    setNotificationsLoading(false);
  }
}, [notificationsLoading]);

  // ✅ جلب عدد الإشعارات غير المقروءة
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      console.log('📥 Unread count:', response);
      
      const count = response?.data?.count || response?.count || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Error loading unread count:', error);
    }
  }, []);

  // ✅ Socket Events Handlers - معرفة قبل الاستخدام
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 New notification:', notification);
    
    // ✅ تشغيل الصوت
    playNotificationSound();
    
    // ✅ إضافة الإشعار في أول القائمة
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, [playNotificationSound]);

  const handleNotificationCount = useCallback((data) => {
    console.log('📊 Notification count:', data);
    setUnreadCount(data.count || 0);
  }, []);

  const handleNotificationReadSocket = useCallback((data) => {
    console.log('📖 Notification read:', data);
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === data.notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleNotificationReadAllSocket = useCallback(() => {
    console.log('📖 All notifications read');
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  const handleNotificationDeletedSocket = useCallback((data) => {
    console.log('🗑️ Notification deleted:', data);
    setNotifications(prev => 
      prev.filter(notif => notif._id !== data.notificationId)
    );
  }, []);

  const handleNotificationClearedSocket = useCallback(() => {
    console.log('🗑️ All notifications cleared');
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // ✅ عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      await loadUnreadCount();
      // ... باقي تحميل البيانات
      setLoading(false);
    };
    loadData();
  }, [loadUnreadCount]);

  // ✅ عند فتح القائمة - مع منع التحميل المتكرر
  useEffect(() => {
    if (showNotifications && notifications.length === 0 && !hasLoadedNotifications.current && !notificationsLoading) {
      hasLoadedNotifications.current = true;
      loadNotifications();
    }
  }, [showNotifications, loadNotifications, notifications.length, notificationsLoading]);

  // ✅ إعادة تعيين الـ ref عند إغلاق القائمة
  const handleToggleNotifications = () => {
    if (showNotifications) {
      setShowNotifications(false);
      hasLoadedNotifications.current = false;
    } else {
      setShowNotifications(true);
    }
  };

  // ✅ Socket Events
  useEffect(() => {
    if (!socket) return;

    // ✅ عند الاتصال بالسوكت
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

  // ✅ قراءة إشعار واحد
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (socket) {
        socket.emit('notification-read', { notificationId, userId: user?._id });
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  // ✅ قراءة جميع الإشعارات
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      
      if (socket) {
        socket.emit('notification-read-all', { userId: user?._id });
      }
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };

  // ✅ حذف إشعار واحد
  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
      
      if (socket) {
        socket.emit('notification-deleted', { notificationId, userId: user?._id });
      }
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
    }
  };

  // ✅ حذف جميع الإشعارات
  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      
      if (socket) {
        socket.emit('notification-cleared', { userId: user?._id });
      }
    } catch (error) {
      console.error('❌ Error deleting all notifications:', error);
    }
  };

  // ✅ الضغط على إشعار
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    let path = '#';
    switch (notification.type) {
      case 'message':
        path = `/messages`;
        break;
      case 'project':
        path = `/project-room/${notification.metadata?.projectId || notification.link}`;
        break;
      case 'task':
        path = `/project/${notification.metadata?.projectId}/tasks`;
        break;
      case 'payment':
        path = `/project-room/${notification.metadata?.projectId}?tab=payments`;
        break;
      case 'file':
        path = `/project-room/${notification.metadata?.projectId}?tab=files`;
        break;
      case 'folder':
        path = `/project-room/${notification.metadata?.projectId}?tab=files`;
        break;
      default:
        path = notification.link || '#';
    }
    
    setShowNotifications(false);
    hasLoadedNotifications.current = false;
    navigate(path);
  };

  // ✅ الحصول على أيقونة الإشعار
  const getNotificationIcon = (type) => {
    const icons = {
      'message': '💬',
      'project': '📁',
      'task': '✅',
      'member': '👤',
      'folder': '📂',
      'file': '📄',
      'payment': '💰',
      'system': '🔔'
    };
    return icons[type] || '🔔';
  };

  // ✅ الحصول على لون الإشعار
  const getNotificationColor = (type) => {
    const colors = {
      'message': 'bg-blue-50 border-blue-200',
      'project': 'bg-purple-50 border-purple-200',
      'task': 'bg-green-50 border-green-200',
      'member': 'bg-orange-50 border-orange-200',
      'folder': 'bg-yellow-50 border-yellow-200',
      'file': 'bg-cyan-50 border-cyan-200',
      'payment': 'bg-emerald-50 border-emerald-200',
      'system': 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  // ✅ تنسيق الوقت
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

  // ✅ إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
        hasLoadedNotifications.current = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // دالة السحب
  const handleWithdraw = () => {
    navigate('/payment', { state: { purpose: 'withdraw', amount: stats.availableBalance } });
  };

  // ✅ تحميل البيانات الوهمية
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalProjects: 47,
        completedProjects: 42,
        ongoingProjects: 5,
        totalEarnings: 28450,
        monthlyEarnings: 4250,
        weeklyEarnings: 1250,
        todayEarnings: 350,
        totalSales: 156,
        storeSales: 89,
        customProjects: 67,
        rating: 4.9,
        responseRate: 98,
        pendingAmount: 1250,
        availableBalance: 27200
      });

      setStoreStats({
        totalProducts: 4,
        totalViews: 2847,
        conversionRate: 5.5
      });

      setRecentProjects([
        { id: 1, name: 'نظام إدارة المستشفيات الذكي', client: 'مستشفى السلام', clientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'completed', progress: 100, dueDate: '2024-02-01', amount: 4999, lastUpdate: 'منذ يومين' },
        { id: 2, name: 'منصة تعليمية متكاملة', client: 'أكاديمية المستقبل', clientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'in_progress', progress: 75, dueDate: '2024-02-15', amount: 3500, lastUpdate: 'منذ 5 ساعات' },
        { id: 3, name: 'متجر إلكتروني متكامل', client: 'متجر الأصالة', clientAvatar: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'review', progress: 90, dueDate: '2024-02-10', amount: 1299, lastUpdate: 'منذ يوم' },
        { id: 4, name: 'لوحة تحكم تحليلات', client: 'شركة البيانات', clientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'pending', progress: 30, dueDate: '2024-02-28', amount: 1999, lastUpdate: 'منذ 3 أيام' }
      ]);

      setRecentSales([
        { id: 1, project: 'نظام إدارة المستشفيات', buyer: 'مستشفى السلام', buyerAvatar: 'https://randomuser.me/api/portraits/men/1.jpg', amount: 499, date: '2024-02-01', status: 'completed', package: 'Basic' },
        { id: 2, project: 'متجر إلكتروني', buyer: 'متجر الأصالة', buyerAvatar: 'https://randomuser.me/api/portraits/men/3.jpg', amount: 399, date: '2024-01-28', status: 'completed', package: 'Basic' },
        { id: 3, project: 'نظام إدارة المطاعم', buyer: 'مطعم الأندلس', buyerAvatar: 'https://randomuser.me/api/portraits/men/5.jpg', amount: 449, date: '2024-01-25', status: 'completed', package: 'Pro' },
        { id: 4, project: 'منصة تعليمية', buyer: 'أكاديمية المستقبل', buyerAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', amount: 599, date: '2024-01-20', status: 'completed', package: 'Pro' }
      ]);

      setRecentMessages([
        { id: 1, from: 'مستشفى السلام', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', message: 'شكراً على المشروع الرائع! نود استكمال العمل معك', time: 'منذ ساعة', unread: true },
        { id: 2, from: 'أكاديمية المستقبل', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', message: 'هل يمكن إضافة بعض التعديلات على المنصة؟', time: 'منذ 3 ساعات', unread: true },
        { id: 3, from: 'متجر الأصالة', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', message: 'تم استلام المشروع، شكراً جزيلاً', time: 'منذ يوم', unread: false }
      ]);

      setTopProjects([
        { id: 1, name: 'نظام إدارة المستشفيات', sales: 156, revenue: 77844, rating: 4.9 },
        { id: 2, name: 'متجر إلكتروني', sales: 289, revenue: 115311, rating: 4.9 },
        { id: 3, name: 'منصة تعليمية', sales: 134, revenue: 80266, rating: 4.8 },
        { id: 4, name: 'لوحة تحكم', sales: 89, revenue: 62211, rating: 4.9 }
      ]);

      setUpcomingDeadlines([
        { id: 1, project: 'منصة تعليمية متكاملة', client: 'أكاديمية المستقبل', dueDate: '2024-02-15', daysLeft: 5, priority: 'high' },
        { id: 2, project: 'لوحة تحكم تحليلات', client: 'شركة البيانات', dueDate: '2024-02-28', daysLeft: 18, priority: 'medium' },
        { id: 3, project: 'نظام إدارة المخزون', client: 'شركة التوزيع', dueDate: '2024-02-20', daysLeft: 10, priority: 'high' }
      ]);

      setChartData([
        { month: 'يناير', earnings: 3500, sales: 12, projects: 8 },
        { month: 'فبراير', earnings: 4200, sales: 15, projects: 10 },
        { month: 'مارس', earnings: 3800, sales: 10, projects: 7 },
        { month: 'أبريل', earnings: 5100, sales: 18, projects: 12 },
        { month: 'مايو', earnings: 4800, sales: 14, projects: 9 },
        { month: 'يونيو', earnings: 4250, sales: 13, projects: 8 }
      ]);

      setActivityLog([
        { id: 1, action: 'تم إضافة مشروع جديد للمتجر', type: 'store', date: '2024-02-01', time: '10:30' },
        { id: 2, action: 'تم استلام دفعة بقيمة $499', type: 'payment', date: '2024-01-31', time: '14:20' },
        { id: 3, action: 'تم تحديث بروفايلك', type: 'profile', date: '2024-01-30', time: '09:15' },
        { id: 4, action: 'تم إكمال مشروع نظام المستشفيات', type: 'project', date: '2024-01-29', time: '16:45' }
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
      completed: 'مكتمل ✅',
      in_progress: 'قيد التنفيذ 🔄',
      review: 'مراجعة 📋',
      pending: 'قيد الانتظار ⏳'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600';
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="text-gray-500"
            >
              جاري تحميل لوحة التحكم...
            </motion.p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="dashboard" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Welcome Header with Notifications */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  مرحباً بك، {user?.username || user?.name || 'مبرمج'} 👋
                </h1>
                <p className="text-gray-500 mt-1">إليك ملخص نشاطك وأرباحك لهذا الشهر</p>
              </div>
              
              {/* ✅ زر الإشعارات */}
              <div className="relative" ref={notificationsRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleNotifications}
                  className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* ✅ Dropdown الإشعارات */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-[420px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div>
                          <h3 className="font-bold text-gray-800">الإشعارات</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs text-gray-500">{unreadCount} غير مقروءة</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-indigo-600 hover:text-indigo-700 transition px-2 py-1 rounded-lg hover:bg-indigo-50"
                            >
                              قراءة الكل
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={handleDeleteAllNotifications}
                              className="text-xs text-red-500 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50"
                            >
                              حذف الكل
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ✅ قائمة الإشعارات */}
                      <div className="overflow-y-auto max-h-[400px]">
                        {notificationsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <motion.div
                              key={notification._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                !notification.isRead ? 'bg-indigo-50/50' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                {/* أيقونة */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)} border`}>
                                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                </div>
                                
                                {/* المحتوى */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-800">
                                        {notification.title || 'إشعار جديد'}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2">
                                        {notification.message || notification.description}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {formatTime(notification.createdAt)}
                                      </p>
                                    </div>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                </div>

                                {/* زر حذف */}
                                <button
                                  onClick={(e) => handleDeleteNotification(notification._id, e)}
                                  className="text-gray-300 hover:text-red-500 transition text-sm flex-shrink-0"
                                >
                                  ✕
                                </button>
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

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              hasLoadedNotifications.current = false;
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 transition"
                          >
                            إغلاق
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Main Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                { icon: '💰', title: 'إجمالي الأرباح', value: `$${stats.totalEarnings.toLocaleString()}`, change: `+$${stats.monthlyEarnings}`, color: 'from-indigo-500 to-purple-500', delay: 0.1 },
                { icon: '✅', title: 'المشاريع المنجزة', value: stats.completedProjects, subtitle: `من إجمالي ${stats.totalProjects}`, color: 'from-green-500 to-emerald-500', delay: 0.2 },
                { icon: '🏆', title: 'إجمالي المبيعات', value: stats.totalSales, subtitle: 'منتج تم بيعه', color: 'from-purple-500 to-pink-500', delay: 0.3 },
                { icon: '⭐', title: 'التقييم', value: stats.rating, subtitle: `نسبة الاستجابة ${stats.responseRate}%`, color: 'from-yellow-500 to-orange-500', delay: 0.4 }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onHoverStart={() => setHoveredCard(idx)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                    <motion.div
                      animate={hoveredCard === idx ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-gray-400"
                    >
                      {card.title}
                    </motion.div>
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { icon: '📊', value: `$${stats.weeklyEarnings}`, label: 'هذا الأسبوع', color: 'blue' },
                { icon: '📈', value: stats.storeSales, label: 'مبيعات المتجر', color: 'green' },
                { icon: '💼', value: stats.customProjects, label: 'مشاريع مخصصة', color: 'orange' },
                { icon: '👁️', value: storeStats.totalViews.toLocaleString(), label: 'مشاهدة المنتجات', color: 'purple' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    className="text-2xl block mb-1"
                  >
                    {item.icon}
                  </motion.span>
                  <div className="text-lg font-bold text-indigo-600">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Balance Card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                animate={{ x: [-100, 200] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                className="absolute top-0 left-0 w-32 h-full bg-white/20 skew-x-12"
              />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-white/80 text-sm mb-1 flex items-center gap-1">
                    <span>💰</span> الرصيد المتاح للسحب
                  </p>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="text-4xl font-bold"
                  >
                    ${stats.availableBalance.toLocaleString()}
                  </motion.p>
                  <p className="text-white/70 text-xs mt-2">الرصيد المعلق: ${stats.pendingAmount}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWithdraw}
                  className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>سحب الأرباح</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-lg"
                  >
                    💸
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>

            {/* Chart and Top Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Earnings Chart */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">📈 الأرباح الشهرية</h3>
                  <div className="flex gap-2">
                    {['week', 'month', 'year'].map((period) => (
                      <motion.button
                        key={period}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                          selectedPeriod === period
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : 'سنة'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="h-64 flex items-end gap-3">
                  {chartData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 group"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.earnings / 6000) * 100}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg relative cursor-pointer"
                        style={{ height: `${(item.earnings / 6000) * 100}%`, minHeight: '30px' }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          ${item.earnings}
                        </div>
                        <div className="text-center text-white text-xs font-bold absolute bottom-1 w-full">{item.earnings}</div>
                      </motion.div>
                      <span className="text-xs text-gray-500">{item.month}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Top Projects */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="font-bold text-gray-800 mb-4">🏆 المشاريع الأكثر مبيعاً</h3>
                <div className="space-y-4">
                  {topProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: -5, backgroundColor: "#f3f4f6" }}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                        >
                          {idx + 1}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-gray-800">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.sales} عملية بيع</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-indigo-600">${project.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">⭐ {project.rating}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Projects and Upcoming Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Projects */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">📋 المشاريع الجارية</h3>
                  <motion.div whileHover={{ x: -5 }}>
                    <Link to="/dashboard/developer/projects" className="text-sm text-indigo-600 hover:text-indigo-700">
                      عرض الكل →
                    </Link>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  {recentProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <motion.img
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          src={project.clientAvatar}
                          alt={project.client}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.client}</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">{project.lastUpdate}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-left min-w-[100px]">
                        <div className="font-bold text-indigo-600">${project.amount}</div>
                        <motion.div whileHover={{ x: -3 }}>
                          <Link to={`/project/${project.id}`} className="text-xs text-indigo-400 hover:text-indigo-600">
                            إدارة →
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Deadlines */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="font-bold text-gray-800 mb-4">⏰ المواعيد القادمة</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, idx) => (
                    <motion.div
                      key={deadline.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        deadline.priority === 'high' ? 'bg-red-50' : 'bg-orange-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-800">{deadline.project}</div>
                          <div className="text-xs text-gray-500">{deadline.client}</div>
                        </div>
                        <motion.span
                          animate={deadline.priority === 'high' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(deadline.priority)}`}
                        >
                          {deadline.priority === 'high' ? 'عاجل' : 'متوسط'}
                        </motion.span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">تسليم: {deadline.dueDate}</span>
                        <motion.span
                          animate={deadline.daysLeft <= 3 ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-xs font-semibold text-red-500"
                        >
                          {deadline.daysLeft} أيام متبقية
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Sales and Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Sales */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">🛒 آخر المبيعات</h3>
                  <motion.div whileHover={{ x: -5 }}>
                    <Link to="/dashboard/developer/store" className="text-sm text-indigo-600 hover:text-indigo-700">
                      عرض الكل →
                    </Link>
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {recentSales.map((sale, idx) => (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <motion.img
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          src={sale.buyerAvatar}
                          alt={sale.buyer}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{sale.project}</div>
                          <div className="text-xs text-gray-500">{sale.buyer}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{sale.date}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.3, type: "spring" }}
                          className="text-lg font-bold text-green-600"
                        >
                          ${sale.amount}
                        </motion.div>
                        <div className="text-xs text-gray-400">{sale.package}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Messages */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">💬 آخر الرسائل</h3>
                  <motion.div whileHover={{ x: -5 }}>
                    <Link to="/messages" className="text-sm text-indigo-600 hover:text-indigo-700">
                      عرض الكل →
                    </Link>
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {recentMessages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: -5 }}
                      className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${msg.unread ? 'bg-indigo-50' : 'bg-gray-50'}`}
                    >
                      <div className="flex gap-3">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={msg.avatar}
                          alt={msg.from}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-gray-800">{msg.from}</div>
                              <p className="text-sm text-gray-600 mt-0.5">{msg.message}</p>
                            </div>
                            {msg.unread && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-indigo-600 rounded-full"
                              />
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Activity Log */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-800 mb-4">📝 سجل النشاطات</h3>
              <div className="space-y-3">
                {activityLog.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ backgroundColor: "#f9fafb", x: 5 }}
                    className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-xl"
                      >
                        {activity.type === 'store' && '🛒'}
                        {activity.type === 'payment' && '💰'}
                        {activity.type === 'profile' && '👤'}
                        {activity.type === 'project' && '📁'}
                      </motion.span>
                      <span className="text-gray-700">{activity.action}</span>
                    </div>
                    <div className="text-left text-xs text-gray-400">
                      {activity.date} {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}