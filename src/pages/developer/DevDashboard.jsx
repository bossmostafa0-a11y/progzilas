import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // إضافة حالة الإشعارات
  const [notifications, setNotifications] = useState([]);
  
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

  // حساب عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(n => !n.read).length;

  // دالة السحب - تنتقل لصفحة الدفع
  const handleWithdraw = () => {
    navigate('/payment', { state: { purpose: 'withdraw', amount: stats.availableBalance } });
  };

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

      // إضافة بيانات الإشعارات
      setNotifications([
        { id: 1, type: 'payment', title: 'تم استلام دفعة جديدة', message: 'تم استلام مبلغ $499 من مشتري نظام إدارة المستشفيات', time: 'منذ 2 ساعة', read: false, link: '/dashboard/developer/earnings' },
        { id: 2, type: 'milestone', title: 'تم إنجاز مرحلة جديدة', message: 'تم إنجاز مرحلة تصميم قاعدة البيانات في مشروع المنصة التعليمية', time: 'منذ 5 ساعات', read: false, link: '/project/2' },
        { id: 3, type: 'sale', title: 'بيع جديد في متجرك', message: 'تم شراء مشروع نظام إدارة المطاعم من قبل مطعم الأندلس', time: 'منذ يوم', read: true, link: '/dashboard/developer/store' },
        { id: 4, type: 'review', title: 'تقييم جديد', message: 'قام مستخدم بتقييم مشروعك بـ 5 نجوم', time: 'منذ يومين', read: true, link: '/marketplace/1' }
      ]);

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
            {/* Welcome Header with Animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  مرحباً بك، {user?.name || 'مبرمج'} 👋
                </h1>
                <p className="text-gray-500 mt-1">إليك ملخص نشاطك وأرباحك لهذا الشهر</p>
              </div>
              
              {/* زر الإشعارات */}
              <Link to="/notifications" className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
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

            {/* Balance Card - زر السحب يودي لصفحة الدفع */}
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

            {/* باقي الكود كما هو (Chart, Top Projects, Recent Projects, etc.) */}
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