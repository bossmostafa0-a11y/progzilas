import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../../hooks/useSocket'
import useNotification from '../../hooks/useNotification'
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../../services/notification.service'

export default function Navbar() {
  const { isAuthenticated, logout, isDeveloper, user } = useAuth()
  const { socket } = useSocket()
  const { playSound } = useNotification()
  const navigate = useNavigate()

  // إشعارات
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const notificationsRef = useRef(null)
  const hasLoadedNotifications = useRef(false)

  // دالة تحميل الإشعارات
  const loadNotifications = async () => {
    if (isLoadingNotifications) return
    setIsLoadingNotifications(true)
    try {
      const response = await getNotifications()
      let data = []
      if (response?.data && Array.isArray(response.data)) {
        data = response.data
      } else if (response?.data?.notifications && Array.isArray(response.data.notifications)) {
        data = response.data.notifications
      } else if (Array.isArray(response?.notifications)) {
        data = response.notifications
      } else if (response?.data && typeof response.data === 'object') {
        data = Object.values(response.data).filter(item => item && typeof item === 'object' && item._id)
      }
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  // عند فتح القائمة لأول مرة
  const toggleNotifications = () => {
    if (showNotifications) {
      setShowNotifications(false)
      hasLoadedNotifications.current = false
    } else {
      if (!hasLoadedNotifications.current && notifications.length === 0) {
        hasLoadedNotifications.current = true
        loadNotifications()
      }
      setShowNotifications(true)
    }
  }

  // ✅ الحل: الجلب فقط عند تسجيل الدخول (بدون setState في الـ Effect)
  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCount()
        setUnreadCount(response?.data?.count || response?.count || 0)
      } catch (error) {
        console.error('Error loading unread count:', error)
      }
    }

    fetchUnreadCount()
  }, [isAuthenticated])

  // استماع Socket
  useEffect(() => {
    if (!isAuthenticated || !socket) return

    socket.emit('user-online', { userId: user?._id })
    socket.emit('get-notification-count', { userId: user?._id })

    const handleNewNotification = (notification) => {
      try {
        playSound()
      } catch (error) {
        console.error('Error playing notification sound:', error)
      }
      setNotifications(prev => {
        if (prev.some(n => n._id === notification._id)) return prev
        return [notification, ...prev]
      })
      setUnreadCount(prev => prev + 1)
    }

    const handleNotificationCount = (data) => {
      setUnreadCount(data.count || 0)
    }

    const handleNotificationReadSocket = (data) => {
      setNotifications(prev => prev.map(n => n._id === data.notificationId ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const handleNotificationReadAllSocket = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    }

    const handleNotificationDeletedSocket = (data) => {
      setNotifications(prev => prev.filter(n => n._id !== data.notificationId))
    }

    const handleNotificationClearedSocket = () => {
      setNotifications([])
      setUnreadCount(0)
    }

    socket.on('new-notification', handleNewNotification)
    socket.on('notification-count', handleNotificationCount)
    socket.on('notification-read', handleNotificationReadSocket)
    socket.on('notification-read-all', handleNotificationReadAllSocket)
    socket.on('notification-deleted', handleNotificationDeletedSocket)
    socket.on('notification-cleared', handleNotificationClearedSocket)

    return () => {
      socket.off('new-notification', handleNewNotification)
      socket.off('notification-count', handleNotificationCount)
      socket.off('notification-read', handleNotificationReadSocket)
      socket.off('notification-read-all', handleNotificationReadAllSocket)
      socket.off('notification-deleted', handleNotificationDeletedSocket)
      socket.off('notification-cleared', handleNotificationClearedSocket)
    }
  }, [isAuthenticated, socket, user?._id, playSound])

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
        hasLoadedNotifications.current = false
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // إجراءات الإشعارات
  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
      if (socket) socket.emit('notification-read', { notificationId: id, userId: user?._id })
    } catch (error) {
      console.error(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      if (socket) socket.emit('notification-read-all', { userId: user?._id })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteNotif = async (id, e) => {
    e.stopPropagation()
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (socket) socket.emit('notification-deleted', { notificationId: id, userId: user?._id })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAllNotifs = async () => {
    try {
      await deleteAllNotifications()
      setNotifications([])
      setUnreadCount(0)
      if (socket) socket.emit('notification-cleared', { userId: user?._id })
    } catch (error) {
      console.error(error)
    }
  }

  // التنقل عند الضغط على إشعار
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification._id)
    setShowNotifications(false)
    hasLoadedNotifications.current = false

    if (isDeveloper) {
      const paths = {
        message: '/messages',
        project: '/dashboard/developer/projects',
        task: `/project/${notification.metadata?.projectId}/tasks`,
        payment: `/project/${notification.metadata?.projectId}?tab=payments`,
        file: `/project/${notification.metadata?.projectId}?tab=files`,
        folder: `/project/${notification.metadata?.projectId}?tab=files`
      }
      const devPath = paths[notification.type] || notification.link || '#'
      if (devPath !== '#') {
        navigate(devPath)
      }
    } else {
      const paths = {
        message: '/messages',
        project: `/project/${notification.metadata?.projectId || notification.link}`,
        proposal: '/dashboard/client/proposals',
        payment: '/dashboard/client/purchases',
        milestone: `/project/${notification.metadata?.projectId}`
      }
      const clientPath = paths[notification.type] || notification.link || '#'
      if (clientPath !== '#') {
        navigate(clientPath)
      }
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'الآن'
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000)
    if (diff < 60) return 'الآن'
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
    if (diff < 172800) return 'أمس'
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`
    return new Date(timestamp).toLocaleDateString('ar-EG')
  }

  const getNotificationIcon = (type) => {
    const icons = { message: '💬', project: '📁', task: '✅', member: '👤', folder: '📂', file: '📄', payment: '💰', proposal: '📝', milestone: '🎯', system: '🔔' }
    return icons[type] || '🔔'
  }

  const getNotificationColor = (type) => {
    const colors = { message: 'bg-blue-50 border-blue-200', project: 'bg-purple-50 border-purple-200', task: 'bg-green-50 border-green-200', member: 'bg-orange-50 border-orange-200', folder: 'bg-yellow-50 border-yellow-200', file: 'bg-cyan-50 border-cyan-200', payment: 'bg-emerald-50 border-emerald-200', proposal: 'bg-indigo-50 border-indigo-200', milestone: 'bg-pink-50 border-pink-200', system: 'bg-gray-50 border-gray-200' }
    return colors[type] || 'bg-gray-50 border-gray-200'
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Progzila</Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/developers" className="text-gray-700 hover:text-indigo-600">المبرمجين</Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-indigo-600">المتجر</Link>
            <Link to="/Projects" className="text-gray-700 hover:text-indigo-600">الاعمال</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-indigo-600">كيف يعمل</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600">الأسعار</Link>
            <Link to="/privacy" className="text-gray-700 hover:text-indigo-600">سياسة الخصوصية</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                
                {/* ✏️ [1] زر الإشعارات */}
                {/* ملاحظة: حجم الزر يختلف حسب حجم الشاشة (موبايل/كمبيوتر) */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="p-1.5 md:p-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all duration-200 relative border border-gray-200 hover:border-indigo-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 md:min-w-[18px] md:h-[18px] bg-red-500 text-white text-[9px] md:text-[10px] rounded-full flex items-center justify-center px-1 font-bold shadow-sm">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* قائمة الإشعارات المنسدلة */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-3 w-[90vw] max-w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* رأس القائمة */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base">الإشعارات</h3>
                            {unreadCount > 0 && <span className="text-xs text-gray-500 mt-0.5 block">{unreadCount} إشعار غير مقروء</span>}
                          </div>
                          <div className="flex gap-2">
                            {unreadCount > 0 && (
                              <button onClick={markAllAsRead} className="text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-3 py-1.5 rounded-lg font-medium transition">
                                قراءة الكل
                              </button>
                            )}
                            {notifications.length > 0 && (
                              <button onClick={deleteAllNotifs} className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition">
                                حذف الكل
                              </button>
                            )}
                          </div>
                        </div>

                        {/* محتوى الإشعارات */}
                        <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
                          {isLoadingNotifications ? (
                            <div className="flex items-center justify-center py-10">
                              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <div
                                key={notif._id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-all duration-200 hover:bg-gray-50 group ${
                                  !notif.isRead ? 'bg-indigo-50/30 border-r-4 border-r-indigo-500' : ''
                                }`}
                              >
                                <div className="flex gap-3 items-start">
                                  {/* أيقونة الإشعار */}
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notif.type)} border shadow-sm`}>
                                    <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                                          {notif.title || 'إشعار جديد'}
                                        </p>
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                                          {notif.message || notif.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                          {formatTime(notif.createdAt)}
                                        </p>
                                      </div>
                                      {!notif.isRead && (
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* زر الحذف */}
                                  <button 
                                    onClick={(e) => deleteNotif(notif._id, e)} 
                                    className="text-gray-300 hover:text-red-500 transition text-sm opacity-0 group-hover:opacity-100"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-gray-400">
                              <div className="text-5xl mb-3">🔔</div>
                              <p className="text-base font-medium">لا توجد إشعارات</p>
                              <p className="text-sm mt-1">ستظهر هنا الإشعارات الجديدة</p>
                            </div>
                          )}
                        </div>

                        {/* تذييل القائمة */}
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50">
                            <button 
                              onClick={() => setShowNotifications(false)} 
                              className="text-sm text-gray-500 hover:text-gray-700 transition font-medium"
                            >
                              إغلاق القائمة
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ✏️ [2] رابط Dashboard */}
                {/* ملاحظة: الحجم يختلف (صغير للموبايل - كبير للكمبيوتر) */}
                <Link to={isDeveloper ? '/dashboard/developer' : '/dashboard/client'} className="text-xs md:text-sm text-gray-700 hover:text-indigo-600 font-medium transition">
                  Dashboard
                </Link>

                {/* ✏️ [3] زر تسجيل الخروج */}
                {/* ملاحظة: الحجم يختلف (صغير للموبايل - كبير للكمبيوتر) */}
                <button onClick={logout} className="text-xs md:text-sm text-red-600 hover:text-red-700 font-medium transition">تسجيل خروج</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-xs md:text-sm text-gray-700 hover:text-indigo-600 font-medium transition">تسجيل الدخول</Link>
                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-medium transition">ابدأ مجاناً</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}