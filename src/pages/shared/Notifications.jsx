import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Notifications() {

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          type: 'proposal',
          title: 'عرض جديد على مشروعك',
          message: 'قام أحمد المنصوري بتقديم عرض على مشروع نظام إدارة المستشفيات الذكي',
          time: '2024-02-01T10:30:00',
          read: false,
          link: '/dashboard/client/proposals',
          icon: '📝',
          color: 'blue',
          actionText: 'مراجعة العرض',
          sender: 'أحمد المنصوري',
          senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          projectName: 'نظام إدارة المستشفيات الذكي'
        },
        {
          id: 2,
          type: 'milestone',
          title: 'تم إنجاز مرحلة جديدة',
          message: 'تم إنجاز مرحلة تصميم قاعدة البيانات في مشروع المنصة التعليمية',
          time: '2024-01-31T15:20:00',
          read: false,
          link: '/project/2',
          icon: '🎯',
          color: 'green',
          actionText: 'متابعة المشروع',
          sender: 'يوسف إبراهيم',
          senderAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          projectName: 'منصة تعليمية متكاملة'
        },
        {
          id: 3,
          type: 'payment',
          title: 'تم استلام دفعتك',
          message: 'تم استلام مبلغ $1500 بنجاح من مشروع متجر إلكتروني',
          time: '2024-01-30T09:15:00',
          read: true,
          link: '/dashboard/developer/earnings',
          icon: '💰',
          color: 'green',
          actionText: 'عرض التفاصيل',
          sender: 'نظام الدفع',
          senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          amount: 1500
        },
        {
          id: 4,
          type: 'review',
          title: 'تقييم جديد على مشروعك',
          message: 'قام مستخدم بتقييم مشروع متجر إلكتروني بـ 5 نجوم',
          time: '2024-01-29T14:45:00',
          read: true,
          link: '/marketplace/3',
          icon: '⭐',
          color: 'yellow',
          actionText: 'عرض التقييم',
          sender: 'متجر الأصالة',
          senderAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          projectName: 'متجر إلكتروني متكامل',
          rating: 5
        },
        {
          id: 5,
          type: 'message',
          title: 'رسالة جديدة من عميل',
          message: 'استلمت رسالة جديدة من مستشفى السلام بخصوص مشروع نظام المستشفيات',
          time: '2024-01-28T11:00:00',
          read: true,
          link: '/messages',
          icon: '💬',
          color: 'purple',
          actionText: 'قراءة الرسالة',
          sender: 'مستشفى السلام',
          senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          projectName: 'نظام إدارة المستشفيات الذكي'
        },
        {
          id: 6,
          type: 'sale',
          title: 'بيع جديد في متجرك',
          message: 'تم شراء مشروع نظام إدارة المطاعم من قبل مطعم الأندلس',
          time: '2024-01-27T16:30:00',
          read: true,
          link: '/dashboard/developer/store',
          icon: '🛒',
          color: 'blue',
          actionText: 'عرض التفاصيل',
          sender: 'مطعم الأندلس',
          senderAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          projectName: 'نظام إدارة المطاعم',
          amount: 449
        },
        {
          id: 7,
          type: 'system',
          title: 'تحديث النظام',
          message: 'تم تحديث المنصة بإضافة ميزات جديدة. يمكنك الآن تصدير التقارير بصيغة PDF',
          time: '2024-01-26T08:00:00',
          read: true,
          link: '/how-it-works',
          icon: '🔧',
          color: 'gray',
          actionText: 'معرفة المزيد',
          sender: 'فريق DevHire',
          senderAvatar: 'https://randomuser.me/api/portraits/men/10.jpg'
        },
        {
          id: 8,
          type: 'reminder',
          title: 'تذكير: موعد تسليم المشروع',
          message: 'باقي 3 أيام على تسليم مشروع لوحة تحكم تحليلات',
          time: '2024-01-25T10:00:00',
          read: true,
          link: '/project/4',
          icon: '⏰',
          color: 'red',
          actionText: 'متابعة المشروع',
          sender: 'نظام التذكيرات',
          senderAvatar: 'https://randomuser.me/api/portraits/men/8.jpg',
          projectName: 'لوحة تحكم تحليلات متقدمة',
          daysLeft: 3
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      setNotifications([]);
    }
  };

  const getNotificationColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else if (days < 7) {
      return `منذ ${days} يوم`;
    } else {
      return date.toLocaleDateString('ar-EG');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
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
            <p className="text-gray-500">جاري تحميل الإشعارات...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                الإشعارات 🔔
              </h1>
              <p className="text-gray-500 mt-1">
                لديك {unreadCount} إشعار غير مقروء
              </p>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                >
                  تحديد الكل كمقروء ✓
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  حذف الكل 🗑️
                </button>
              )}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 mb-6"
          >
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'الكل', icon: '📋' },
                { value: 'unread', label: 'غير مقروء', icon: '🔴' },
                { value: 'read', label: 'مقروء', icon: '✅' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
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
          </motion.div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد إشعارات</h3>
              <p className="text-gray-500">ليس لديك أي إشعارات في الوقت الحالي</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence mode="wait">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      !notification.read ? 'border-r-4 border-indigo-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedNotification(notification);
                      setShowDetailsModal(true);
                    }}
                  >
                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${getNotificationColor(notification.color)}`}>
                          {notification.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {notification.title}
                                {!notification.read && (
                                  <span className="mr-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-400">{formatTime(notification.time)}</span>
                                {notification.sender && (
                                  <>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-xs text-gray-500">من: {notification.sender}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-700"
                                >
                                  تحديد كمقروء
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                className="text-xs text-red-500 hover:text-red-600"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
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

      {/* Notification Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedNotification && (
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
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto ${getNotificationColor(selectedNotification.color)}`}>
                  {selectedNotification.icon}
                </div>
                <h3 className="text-xl font-bold mt-3">{selectedNotification.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{formatTime(selectedNotification.time)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700">{selectedNotification.message}</p>
                {selectedNotification.sender && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                    <img src={selectedNotification.senderAvatar} alt={selectedNotification.sender} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-500">من: {selectedNotification.sender}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إغلاق
                </button>
                <Link to={selectedNotification.link} className="flex-1">
                  <button
                    onClick={() => {
                      if (!selectedNotification.read) {
                        handleMarkAsRead(selectedNotification.id);
                      }
                      setShowDetailsModal(false);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                  >
                    {selectedNotification.actionText || 'عرض التفاصيل'}
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