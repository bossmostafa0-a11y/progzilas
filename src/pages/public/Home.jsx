import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getHomeDetails } from '../../services/cliecnt.service.js';


const STEPS = [
  { number: '01', title: 'سجل مجاناً', description: 'أنشئ حسابك كمبرمج أو عميل في دقيقة واحدة', icon: '📝', color: 'from-blue-500 to-cyan-500' },
  { number: '02', title: 'اعرض مشروعك أو ابحث عن مبرمج', description: 'مبرمج: ارفع مشروعك للبيع | عميل: انشر متطلباتك', icon: '🔍', color: 'from-purple-500 to-pink-500' },
  { number: '03', title: 'احصل على عروض وابدأ العمل', description: 'استلم العروض، وافق على العرض، وابدأ رحلة النجاح', icon: '🚀', color: 'from-green-500 to-emerald-500' }
];

const AnimatedCounter = memo(({ target, duration = 2500 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId;

    const run = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const rate = Math.min(progress / duration, 1);
      setValue(Math.floor(rate * target));

      if (progress < duration) {
        frameId = requestAnimationFrame(run);
      }
    };

    frameId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return <>{value}</>;
});

AnimatedCounter.displayName = 'AnimatedCounter';

export default function Home() {
    const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [topDevelopers, setTopDevelopers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // ✅ تعريف الدالة قبل useEffect
  const getCategoryLabel = (category) => {
    const labels = {
      'management': 'نظام إدارة',
      'ecommerce': 'متجر إلكتروني',
      'education': 'منصة تعليمية',
      'dashboard': 'داشبورد',
      'mobile': 'تطبيق موبايل',
      'ai': 'ذكاء اصطناعي'
    };
    return labels[category] || category || 'أخرى';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getHomeDetails();
        
        let data = response;
        if (typeof data === 'string') data = JSON.parse(data);
        
        const projects = data?.data?.project || data?.project || [];
        const developers = data?.data?.dev || data?.dev || [];

        const mappedProjects = projects.map(project => ({
          id: project._id,
          name: project.projectName || '',
          dev: project.owner?.username || 'مطور',
          devAvatar: project.owner?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          category: getCategoryLabel(project.category),
          sales: project.salesCount || project.sales || 0,
          price: project.basic?.price || 0,
          rating: project.rating || 0,
          image: project.images?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
          tech: (project.technologies || []).slice(0, 3)
        }));
        
        setFeaturedProjects(mappedProjects);

        const mappedDevs = developers.map(dev => ({
          id: dev._id,
          name: dev.username || '',
          title: dev.title || dev.track || 'مطور',
          tech: (dev.techStack || []).slice(0, 3),
          rating: dev.rating || 0,
          completed: dev.completedProjects || 0,
          hourlyRate: dev.hourlyRate || 0,
          avatar: dev.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          badge: dev.rating > 4.7 ? '🏆 مميز' : dev.completedProjects > 50 ? '⭐ محترف' : '🚀 صاعد',
          cover: dev.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
        }));
        
        setTopDevelopers(mappedDevs);

      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statsConfig = [
    { label: 'مبرمج محترف', suffix: '+', target: 850 },
    { label: 'مشروع مكتمل', suffix: '+', target: 2150 },
    { label: 'أرباح بالملايين', suffix: 'M+', target: 125 },
    { label: 'رضا العملاء', suffix: '%', target: 99 }
  ];

  const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);
// ✅ دالة التعامل مع الضغط على تفاصيل المشروع
const handleProjectClick = (projectId) => {
  // ✅ التحقق من وجود مستخدم مسجل (من localStorage أو context)
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // ✅ لو مش مسجل، روح لتسجيل الدخول مع حفظ رابط المشروع
    navigate(`/login`);
  } else {
    // ✅ لو مسجل، روح لصفحة المشروع
    navigate(`/marketplaceitem/${projectId}`);
  }
};
  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: { events: { onClick: { enable: false }, onHover: { enable: true, mode: "repulse" } }, modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } } },
    particles: { color: { value: ["#4f46e5", "#7c3aed", "#ec4899", "#06b6d4"] }, links: { color: "#4f46e5", distance: 150, enable: true, opacity: 0.2, width: 1 }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false }, number: { value: 50 }, opacity: { value: 0.3 }, shape: { type: "circle" }, size: { value: { min: 2, max: 5 } } },
    detectRetina: false,
  };

  const fadeInUp = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" dir="rtl">
      <Navbar />
      <main className="flex-grow relative">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/80 to-purple-50/80 z-[1]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="text-center">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">أول منصة عربية</span>
              <br /><span className="text-gray-800">متخصصة في توظيف</span>
              <br /><span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">المبرمجين</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Progzila هي <span className="font-bold text-indigo-600">LinkedIn + GitHub + Upwork</span> في مكان واحد.
              <span className="block text-indigo-600 font-bold mt-3 text-lg">✨ بيع مشروعك أكثر من مرة وحقق دخل سلبي حقيقي ✨</span>
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
              <Link to="/developers" className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg">
                <span className="flex items-center gap-2">🔍 ابحث عن مبرمج<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
              </Link>
              <Link to="/login" className="group border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg">✨ سجل كمبرمج وابدأ الربح</Link>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {statsConfig.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="glass rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"><AnimatedCounter target={stat.target} />{stat.suffix}</div>
                  <div className="text-sm md:text-base text-gray-600 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* كيف يعمل */}
        <div className="relative py-24 bg-white/50 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">كيف يعمل <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Progzila</span>؟</h2>
              <p className="text-xl text-gray-600">ثلاث خطوات بسيطة لتبدأ رحلتك معنا</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -10 }} className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-black text-xl shadow-lg rotate-45 group-hover:rotate-0 transition-all duration-300`}>
                      <span className="-rotate-45 group-hover:rotate-0 transition-all duration-300">{step.number}</span>
                    </div>
                  </div>
                  <div className="mt-6"><div className="text-5xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">{step.icon}</div><h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3><p className="text-gray-500 leading-relaxed">{step.description}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* أمهر المبرمجين */}
        <div className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">أمهر المبرمجين</span></h2>
              <p className="text-xl text-gray-600">تعرف على نخبة المبرمجين العرب المميزين على منصتنا</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topDevelopers.map((dev, index) => (
                <motion.div key={dev.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -10 }} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-32 overflow-hidden">
                    <img src={dev.cover} alt={dev.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 right-3"><span className="px-2 py-1 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full shadow-lg">{dev.badge}</span></div>
                  </div>
                  <div className="relative px-6">
                    <div className="absolute -top-12 left-6"><div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white"><img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg'; }} /></div></div>
                    <div className="text-left pt-14 pb-4">
                      <div className="flex justify-between items-start mb-2"><div><h3 className="text-xl font-bold text-gray-800">{dev.name}</h3><p className="text-sm text-indigo-600 font-semibold">{dev.title}</p></div><div className="text-right"><div className="text-2xl font-bold text-indigo-600">${dev.hourlyRate}</div><div className="text-xs text-gray-500">/ ساعة</div></div></div>
                      <div className="flex items-center gap-1 mb-3"><span className="text-yellow-400">★</span><span className="font-semibold">{dev.rating}</span><span className="text-gray-400 text-sm">({dev.completed} مشروع)</span></div>
                      <div className="flex flex-wrap gap-2 mb-4">{dev.tech.map((t, i) => (<span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{t}</span>))}</div>
                      <Link to={`/dev/${dev.id}`} className="block w-full text-center py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">عرض البروفايل</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/developers" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all duration-300">عرض جميع المبرمجين<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
            </div>
          </div>
        </div>

        {/* أضخم المشاريع */}
        <div className="relative py-24 bg-white/50 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">أضخم المشاريع</span></h2>
              <p className="text-xl text-gray-600">أشهر المشاريع التي تم بيعها على منصتنا</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div key={project.id} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -5 }} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img src={project.image} alt={project.name} className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600'; }} />
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-bold">{project.sales} عملية بيع</div>
                    </div>
                    <div className="md:w-3/5 p-6 text-right">
                      <div className="flex items-center gap-2 mb-2"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">{project.category}</span><div className="flex items-center gap-1"><span className="text-yellow-400">★</span><span className="text-sm font-semibold">{project.rating}</span></div></div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
                      <div className="flex items-center gap-2 mb-3"><img src={project.devAvatar} alt={project.dev} className="w-6 h-6 rounded-full" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg'; }} /><span className="text-sm text-gray-600">{project.dev}</span></div>
                      <div className="flex flex-wrap gap-2 mb-4">{project.tech.map((t, i) => (<span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{t}</span>))}</div>
                      <div className="flex justify-between items-center">
                       <button
  onClick={() => handleProjectClick(project.id)}
  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm"
>
  تفاصيل المشروع
</button>
                        <span className="text-2xl font-bold text-indigo-600">${project.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">استكشف جميع المشاريع<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative py-16 mb-12 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">جاهز تبدأ رحلتك مع Progzila</h3>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">انضم لأكثر من 850 مبرمج عربي بيحققوا أرباحاً خيالية على منصتنا</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login" className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block">✨ ابدأ مجاناً الآن</Link>
                  <Link to="/how-it-works" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-block">📖 اعرف أكثر</Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}