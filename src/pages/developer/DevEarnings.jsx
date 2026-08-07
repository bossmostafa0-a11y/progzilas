import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';
import { getDeveloperEarnings } from '../../services/develper.service.js';

export default function DevEarnings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const loadedRef = useRef(false);

  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingAmount: 0,
    withdrawnAmount: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    todayEarnings: 0,
    averagePerProject: 0,
    storesales: 0,
    custmisprojects: 0
  });

  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

  const loadEarningsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDeveloperEarnings();
      
      // ✅ الباك إند بيرجع { message, data: { stats, chartData, ... } }
      const data = response?.data || response;
      
      
      // ✅ إحصائيات
      if (data?.stats) {
        setStats({
          totalEarnings: data.stats.totalEarnings ?? 0,
          availableBalance: data.stats.availableBalance ?? 0,
          pendingAmount: data.stats.pendingAmount ?? 0,
          withdrawnAmount: data.stats.withdrawnAmount ?? 0,
          monthlyEarnings: data.stats.monthlyEarnings ?? 0,
          weeklyEarnings: data.stats.weeklyEarnings ?? 0,
          todayEarnings: data.stats.todayEarnings ?? 0,
          averagePerProject: data.stats.averagePerProject ?? 0,
          custmisprojects : data.custmisprojects ?? 0,
          storesales : data.storesales ?? 0
        });
      }
      
      // ✅ الرسم البياني - الشهور جاهزة من الباك إند
      if (data?.chartData?.length) {
        setChartData(data.chartData);
      } else {
        setChartData([]);
      }
      
      // ✅ المعاملات - جاهزة من الباك إند
      if (data?.transactions?.length) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
      
      // ✅ السحوبات - جاهزة من الباك إند
      if (data?.withdrawals?.length) {
        setWithdrawals(data.withdrawals);
      } else {
        setWithdrawals([]);
      }
      
      // ✅ أفضل المشاريع - جاهزة من الباك إند
      if (data?.topProjects?.length) {
        setTopProjects(data.topProjects.map(p => ({
          ...p,
          image: p.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100'
        })));
      } else {
        setTopProjects([]);
      }
      
      loadedRef.current = true;
      
    } catch (err) {
      console.error('❌ Error loading earnings:', err);
      
      // ✅ التعامل مع token expired
      if (err?.response?.status === 401) {
        setError('انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      setError(err?.response?.data?.message || 'حدث خطأ أثناء تحميل الأرباح');
      loadedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadedRef.current) {
      loadEarningsData();
    }
  }, []);

  const handleRetry = () => {
    loadedRef.current = false;
    loadEarningsData();
  };

  const handleWithdraw = () => {
    navigate('/payment', { state: { purpose: 'withdraw', amount: stats.availableBalance } });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-EG', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount ?? 0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 100 } }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const fadeInLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };
  const fadeInRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل الأرباح...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={handleRetry} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">🔄 إعادة المحاولة</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const maxEarning = Math.max(...chartData.map(item => item.earnings || 0), 1);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="earnings" />
        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">أرباحي 💰</h1>
                <p className="text-gray-500 mt-1">إدارة وإحصائيات أرباحك من المشاريع والمبيعات</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWithdraw} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <span>💸</span><span>سحب الأرباح</span>
              </motion.button>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
              <motion.div animate={{ x: [-100, 200] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }} className="absolute top-0 left-0 w-32 h-full bg-white/20 skew-x-12" />
              <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">💰 الرصيد المتاح للسحب</p>
                  <p className="text-4xl md:text-5xl font-bold">${formatCurrency(stats.availableBalance)}</p>
                  <p className="text-white/70 text-sm mt-2">الرصيد المعلق: ${formatCurrency(stats.pendingAmount)} | إجمالي المسحوب: ${formatCurrency(stats.withdrawnAmount)}</p>
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/80 mb-1">إجمالي الأرباح</div>
                  <div className="text-3xl font-bold">${formatCurrency(stats.totalEarnings)}</div>
                  <div className="text-xs text-white/70 mt-1">متوسط لكل مشروع: ${formatCurrency(stats.averagePerProject)}</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '📊', value: `$${formatCurrency(stats.monthlyEarnings)}`, label: 'أرباح هذا الشهر' },
                { icon: '📈', value: `$${formatCurrency(stats.weeklyEarnings)}`, label: 'أرباح هذا الأسبوع' },
                { icon: '⏰', value: `$${formatCurrency(stats.todayEarnings)}`, label: 'أرباح اليوم' },
                { icon: '🏆', value: stats.totalEarnings > 0 ? '⭐' : '📦', label: 'معدل النمو +15%' }
              ].map((item, idx) => (
                <motion.div key={idx} variants={cardVariants} className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-2xl font-bold text-indigo-600">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

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
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">${formatCurrency(item.earnings)}</div>
                        <div className="text-center text-white text-xs font-bold absolute bottom-1 w-full">{formatCurrency(item.earnings)}</div>
                      </motion.div>
                      <span className="text-xs text-gray-500">{item.month}</span>
                    </motion.div>
                  )) : <div className="flex-1 flex items-center justify-center text-gray-400">لا توجد بيانات</div>}
                </div>
              </motion.div>

              <motion.div variants={fadeInRight} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">🏆 المشاريع الأعلى ربحاً</h3>
                <div className="space-y-4">
                  {topProjects.length > 0 ? topProjects.map((project, idx) => (
                    <motion.div key={project.id || idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ x: -5 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-lg overflow-hidden"><img src={project.image} alt={project.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100'; }} /></div>
                      <div className="flex-1"><div className="font-semibold text-gray-800">{project.name}</div><div className="text-xs text-gray-500">{project.sales ?? 0} عملية بيع</div></div>
                      <div className="text-left"><div className="font-bold text-indigo-600">${formatCurrency(project.revenue)}</div><div className="text-xs text-gray-400">⭐ {project.rating ?? 0}</div></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🏆</p><p>لا توجد مشاريع بعد</p></div>}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">🔄 آخر المعاملات</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.length > 0 ? transactions.map((t, idx) => (
                    <motion.div key={t.id || idx} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">{t.type === 'sale' ? '🛒' : '📁'}</div>
                        <div><div className="font-semibold text-gray-800">{t.project}</div><div className="text-xs text-gray-500">{t.buyer}</div><div className="text-xs text-gray-400">{formatDate(t.date)}</div></div>
                      </div>
                      <div className="text-left"><div className="font-bold text-green-600">+${formatCurrency(t.amount)}</div><div className="text-xs text-gray-400">{t.package || t.typeLabel}</div></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🔄</p><p>لا توجد معاملات بعد</p></div>}
                </div>
              </motion.div>

              <motion.div variants={fadeInRight} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">🏧 سجل السحوبات</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {withdrawals.length > 0 ? withdrawals.map((w, idx) => (
                    <motion.div key={w.id || idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">💸</div>
                        <div><div className="font-semibold text-gray-800">{w.method}</div><div className="text-xs text-gray-500">{formatDate(w.date)}</div><div className="text-xs text-gray-400">المرجع: {w.reference}</div></div>
                      </div>
                      <div className="text-left"><div className="font-bold text-orange-600">-${formatCurrency(w.amount)}</div><div className={`text-xs ${w.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{w.status === 'completed' ? '✓ مكتمل' : '⏳ قيد المعالجة'}</div></div>
                    </motion.div>
                  )) : <div className="text-center py-8 text-gray-400"><p className="text-3xl mb-2">🏧</p><p>لا توجد سحوبات بعد</p></div>}
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">📊 ملخص الأرباح</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'مبيعات المتجر', value: stats.storesales , color: 'green' },
                  { label: 'مشاريع مخصصة', value: stats.custmisprojects, color: 'blue' },
                  
                ].map((item, idx) => (
                  <div key={idx} className={`text-center p-3 rounded-xl bg-${item.color}-50`}>
                    <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                    <div className={`text-xl font-bold text-${item.color}-600`}>${formatCurrency(item.value)}</div>
                  </div>
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