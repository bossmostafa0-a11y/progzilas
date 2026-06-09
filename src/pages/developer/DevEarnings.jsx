import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevEarnings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingAmount: 0,
    withdrawnAmount: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    todayEarnings: 0,
    averagePerProject: 0
  });

  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalEarnings: 48750,
        availableBalance: 28450,
        pendingAmount: 1250,
        withdrawnAmount: 20300,
        monthlyEarnings: 4250,
        weeklyEarnings: 1250,
        todayEarnings: 350,
        averagePerProject: 1245
      });

      setChartData([
        { month: 'يناير', earnings: 3500, sales: 12, projects: 8 },
        { month: 'فبراير', earnings: 4200, sales: 15, projects: 10 },
        { month: 'مارس', earnings: 3800, sales: 10, projects: 7 },
        { month: 'أبريل', earnings: 5100, sales: 18, projects: 12 },
        { month: 'مايو', earnings: 4800, sales: 14, projects: 9 },
        { month: 'يونيو', earnings: 4250, sales: 13, projects: 8 }
      ]);

      setTransactions([
        { id: 1, type: 'sale', project: 'نظام إدارة المستشفيات', amount: 499, date: '2024-02-01', status: 'completed', buyer: 'مستشفى السلام', package: 'Basic' },
        { id: 2, type: 'sale', project: 'متجر إلكتروني', amount: 399, date: '2024-01-28', status: 'completed', buyer: 'متجر الأصالة', package: 'Basic' },
        { id: 3, type: 'sale', project: 'نظام إدارة المطاعم', amount: 449, date: '2024-01-25', status: 'completed', buyer: 'مطعم الأندلس', package: 'Pro' },
        { id: 4, type: 'project', project: 'منصة تعليمية', amount: 3500, date: '2024-01-20', status: 'completed', buyer: 'أكاديمية المستقبل', typeLabel: 'دفعة مشروع' },
        { id: 5, type: 'sale', project: 'لوحة تحكم تحليلات', amount: 699, date: '2024-01-18', status: 'completed', buyer: 'شركة البيانات', package: 'Basic' },
        { id: 6, type: 'project', project: 'نظام إدارة المستشفيات', amount: 4999, date: '2024-01-15', status: 'completed', buyer: 'مستشفى السلام', typeLabel: 'دفعة مشروع' }
      ]);

      setWithdrawals([
        { id: 1, amount: 5000, date: '2024-01-10', method: 'تحويل بنكي', status: 'completed', reference: 'WD-001' },
        { id: 2, amount: 3000, date: '2023-12-15', method: 'فودافون كاش', status: 'completed', reference: 'WD-002' },
        { id: 3, amount: 2000, date: '2023-11-20', method: 'Binance Pay', status: 'completed', reference: 'WD-003' }
      ]);

      setTopProjects([
        { id: 1, name: 'نظام إدارة المستشفيات', sales: 156, revenue: 77844, rating: 4.9, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100' },
        { id: 2, name: 'متجر إلكتروني', sales: 289, revenue: 115311, rating: 4.9, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100' },
        { id: 3, name: 'منصة تعليمية', sales: 134, revenue: 80266, rating: 4.8, image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=100' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  // دالة السحب - تنتقل لصفحة الدفع
  const handleWithdraw = () => {
    navigate('/payment', { state: { purpose: 'withdraw', amount: stats.availableBalance } });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
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
            <p className="text-gray-500">جاري تحميل الأرباح...</p>
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
        <DeveloperSidebar activePage="earnings" />

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
                  أرباحي 💰
                </h1>
                <p className="text-gray-500 mt-1">إدارة وإحصائيات أرباحك من المشاريع والمبيعات</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWithdraw}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>💸</span>
                <span>سحب الأرباح</span>
              </motion.button>
            </motion.div>

            {/* Main Balance Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                animate={{ x: [-100, 200] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                className="absolute top-0 left-0 w-32 h-full bg-white/20 skew-x-12"
              />
              <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-white/80 text-sm flex items-center gap-1 mb-2">
                    <span>💰</span> الرصيد المتاح للسحب
                  </p>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="text-4xl md:text-5xl font-bold"
                  >
                    ${stats.availableBalance.toLocaleString()}
                  </motion.p>
                  <p className="text-white/70 text-sm mt-2">
                    الرصيد المعلق: ${stats.pendingAmount.toLocaleString()} | إجمالي المسحوب: ${stats.withdrawnAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/80 mb-1">إجمالي الأرباح</div>
                  <div className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                  <div className="text-xs text-white/70 mt-1">متوسط لكل مشروع: ${stats.averagePerProject}</div>
                </div>
              </div>
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
                <div className="text-2xl font-bold text-indigo-600">${stats.monthlyEarnings.toLocaleString()}</div>
                <div className="text-xs text-gray-500">أرباح هذا الشهر</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-2xl font-bold text-green-600">${stats.weeklyEarnings.toLocaleString()}</div>
                <div className="text-xs text-gray-500">أرباح هذا الأسبوع</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">⏰</div>
                <div className="text-2xl font-bold text-orange-600">${stats.todayEarnings.toLocaleString()}</div>
                <div className="text-xs text-gray-500">أرباح اليوم</div>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalEarnings > 0 ? '⭐' : '📦'}</div>
                <div className="text-xs text-gray-500">معدل النمو +15%</div>
              </motion.div>
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
                <h3 className="font-bold text-gray-800 mb-4">🏆 المشاريع الأعلى ربحاً</h3>
                <div className="space-y-4">
                  {topProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: -5 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.sales} عملية بيع</div>
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

            {/* Transactions and Withdrawals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Transactions */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="font-bold text-gray-800 mb-4">🔄 آخر المعاملات</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((transaction, idx) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                          {transaction.type === 'sale' ? '🛒' : '📁'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{transaction.project}</div>
                          <div className="text-xs text-gray-500">{transaction.buyer}</div>
                          <div className="text-xs text-gray-400">{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-green-600">+${transaction.amount}</div>
                        <div className="text-xs text-gray-400">{transaction.package || transaction.typeLabel}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Withdrawals History */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="font-bold text-gray-800 mb-4">🏧 سجل السحوبات</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {withdrawals.map((withdrawal, idx) => (
                    <motion.div
                      key={withdrawal.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                          💸
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{withdrawal.method}</div>
                          <div className="text-xs text-gray-500">{formatDate(withdrawal.date)}</div>
                          <div className="text-xs text-gray-400">المرجع: {withdrawal.reference}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-orange-600">-${withdrawal.amount}</div>
                        <div className="text-xs text-green-600">✓ مكتمل</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Earnings Summary */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-800 mb-4">📊 ملخص الأرباح</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-green-50">
                  <div className="text-sm text-gray-500 mb-1">مبيعات المتجر</div>
                  <div className="text-xl font-bold text-green-600">${Math.round(stats.totalEarnings * 0.4).toLocaleString()}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50">
                  <div className="text-sm text-gray-500 mb-1">مشاريع مخصصة</div>
                  <div className="text-xl font-bold text-blue-600">${Math.round(stats.totalEarnings * 0.6).toLocaleString()}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50">
                  <div className="text-sm text-gray-500 mb-1">عمولة المنصة</div>
                  <div className="text-xl font-bold text-purple-600">${Math.round(stats.totalEarnings * 0.1).toLocaleString()}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-orange-50">
                  <div className="text-sm text-gray-500 mb-1">صافي الأرباح</div>
                  <div className="text-xl font-bold text-orange-600">${Math.round(stats.totalEarnings * 0.9).toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}