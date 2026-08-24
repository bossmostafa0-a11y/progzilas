import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getHomeDetails } from '../../services/cliecnt.service.js';

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const STEPS = [
  { number: '01', cmd: 'signup', title: 'سجل مجانًا', description: 'أنشئ حسابك كمبرمج أو عميل في أقل من دقيقة.' },
  { number: '02', cmd: 'publish', title: 'انشر مشروعك أو ابحث عن مبرمج', description: 'مبرمج؟ اعرض خدماتك. عميل؟ انشر متطلبات مشروعك.' },
  { number: '03', cmd: 'start', title: 'ابدأ العمل', description: 'استلم العروض، اختر الأنسب، وابدأ التنفيذ مباشرة.' },
];

// tier styling for developer badges — meaning is carried by color + shape, not emoji
const BADGE_STYLES = {
  'الأعلى تقييمًا': 'bg-indigo-600 text-white border-indigo-600',
  'محترف': 'bg-white text-purple-700 border-purple-300',
  'صاعد': 'bg-white text-cyan-700 border-cyan-300',
};

// color rotation for tech-stack tags — gives lists of tags a "syntax highlight"
// rhythm instead of one flat gray chip repeated everywhere
const TAG_PALETTE = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-cyan-50 text-cyan-700 border-cyan-100',
];

// one accent per step — gives the "three steps" flow a visible color rhythm
const STEP_ACCENTS = ['#4f46e5', '#7c3aed', '#06b6d4'];

// avatar ring color per developer tier, echoing the badge color
const BADGE_RING = {
  'الأعلى تقييمًا': 'ring-2 ring-indigo-200',
  'محترف': 'ring-2 ring-purple-200',
  'صاعد': 'ring-2 ring-cyan-200',
};

const AnimatedCounter = memo(({ target, duration = 1600 }) => {
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

// ---------------------------------------------------------------------------
// Small presentational helpers (visual-only, no data/logic)
// ---------------------------------------------------------------------------

const StarRating = ({ rating }) => (
  <span className="inline-flex items-center gap-1 text-sm text-gray-700">
    <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
    </svg>
    <span className="font-mono font-semibold">{rating}</span>
  </span>
);

const Eyebrow = ({ children }) => (
  <div className="font-mono text-xs tracking-wide text-gray-400 mb-3 select-none">
    <span className="text-gray-300">// </span>
    {children}
  </div>
);

// JSX-tag styled badge — `<الأعلى تقييمًا />` — a small wink to the audience
// this platform is built for. Wrapped in dir="ltr" so the angle brackets
// stay put regardless of the page's RTL context.
const TagBadge = ({ label, className }) => (
  <span dir="ltr" className={`font-mono text-[10px] tracking-wide px-2 py-1 rounded border whitespace-nowrap ${className}`}>
    {'<'}{label}{' />'}
  </span>
);

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

// noise texture used as a fixed overlay — the kind of subtle grain premium
// product sites use to keep flat color fields from feeling sterile/flat/"AI"
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export default function Home() {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [topDevelopers, setTopDevelopers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  const getCategoryLabel = (category) => {
    const labels = {
      management: 'نظام إدارة',
      ecommerce: 'متجر إلكتروني',
      education: 'منصة تعليمية',
      dashboard: 'داشبورد',
      mobile: 'تطبيق موبايل',
      ai: 'ذكاء اصطناعي',
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

        const mappedProjects = projects.map((project) => ({
          id: project._id,
          name: project.projectName || '',
          dev: project.owner?.username || 'مطور',
          devAvatar: project.owner?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          category: getCategoryLabel(project.category),
          sales: project.salesCount || project.sales || 0,
          price: project.basic?.price || 0,
          rating: project.rating || 0,
          image: project.images?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
          tech: (project.technologies || []).slice(0, 3),
        }));

        setFeaturedProjects(mappedProjects);

        const mappedDevs = developers.map((dev) => ({
          id: dev._id,
          name: dev.username || '',
          title: dev.title || dev.track || 'مطور',
          tech: (dev.techStack || []).slice(0, 3),
          rating: dev.rating || 0,
          completed: dev.completedProjects || 0,
          hourlyRate: dev.hourlyRate || 0,
          avatar: dev.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          badge: dev.rating > 4.7 ? 'الأعلى تقييمًا' : dev.completedProjects > 50 ? 'محترف' : 'صاعد',
          cover: dev.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
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



  const handleProjectClick = (projectId) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate(`/login`);
    } else {
      navigate(`/marketplaceitem/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFD] text-[#14151F] relative">
      <style>{`
        @keyframes progzila-blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
        .progzila-cursor { display: inline-block; animation: progzila-blink 1.1s steps(1) infinite; }
        @keyframes progzila-pulse { 0% { box-shadow: 0 0 0 0 rgba(6,182,212,0.45); } 70% { box-shadow: 0 0 0 6px rgba(6,182,212,0); } 100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); } }
        .progzila-live-dot { animation: progzila-pulse 2.2s ease-out infinite; }
        @keyframes progzila-float-a { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
        @keyframes progzila-float-b { 0%, 100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
        .progzila-card-a { animation: progzila-float-a 6.5s ease-in-out infinite; }
        .progzila-card-b { animation: progzila-float-b 7.5s ease-in-out infinite; }
        @keyframes progzila-type { from { width: 0; } to { width: 21ch; } }
        .progzila-typeline { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; width: 21ch; animation: progzila-type 1.4s steps(21) 0.5s both; }
      `}</style>

      {/* soft film-grain overlay across the whole page — kills the "flat vector" AI look */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025] mix-blend-multiply"
        style={{ backgroundImage: NOISE_BG }}
      />

      <div dir="rtl" className="relative z-[2] flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* ------------------------------------------------------------ */}
        {/* Hero                                                         */}
        {/* ------------------------------------------------------------ */}
        <section className="relative overflow-hidden border-b border-[#E7E7F0]">
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#EFEFF6 1px, transparent 1px), linear-gradient(90deg, #EFEFF6 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 85%)',
            }}
          />
          <div
            className="absolute -top-32 right-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.16] blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
              {/* Text column */}
              <div className="text-center lg:text-right">
                <motion.div {...fadeUp} className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-2 rounded-md border border-[#E4E4EC] bg-white px-3 py-1.5">
                    <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-500 progzila-live-dot" />
                    <span className="font-mono text-xs text-gray-500 tracking-wide">progzila.com</span>
                  </span>
                  <span className="text-sm text-gray-500">منصة العمل الحر للمبرمجين</span>
                </motion.div>

                <motion.h1
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.05 }}
                  className="mt-7 leading-[1.08] tracking-[-0.02em]"
                >
                  <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">
                    اعثر على مبرمجك <span className="text-indigo-600">المثالي</span>
                  </span>
                  <span className="block mt-3 text-2xl sm:text-3xl lg:text-4xl font-light text-gray-400">
                    أو اعرض مهارتك وابدأ العمل
                    <span className="font-mono text-indigo-500 progzila-cursor">_</span>
                  </span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Progzila تجمع بين سوق للمشاريع الجاهزة وشبكة من المبرمجين المحترفين،
                  في مكان واحد مصمّم خصيصًا لسوق البرمجة العربي.
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.15 }}
                  className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <Link
                    to="/developers"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-7 rounded-lg transition-all duration-200 text-base shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_14px_32px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
                  >
                    ابحث عن مبرمج
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-white font-semibold py-3.5 px-7 rounded-lg transition-colors duration-200 text-base"
                  >
                    ابدأ كمبرمج
                  </Link>
                </motion.div>
              </div>

              {/* Visual column — a real terminal window is the hero's signature element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative hidden lg:block h-[380px]"
              >
                <div
                  className="absolute inset-0 -z-10 rounded-full opacity-30 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)' }}
                />

                {/* terminal mock */}
                <div
                  dir="ltr"
                  className="progzila-card-a absolute top-2 right-2 w-[340px] bg-[#0B0B12] rounded-2xl shadow-[0_25px_60px_rgba(11,11,18,0.35)] p-5 font-mono text-[13px] text-gray-300"
                >
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="mr-auto text-[10px] text-gray-500">progzila — zsh</span>
                  </div>
                  <div className="space-y-2 leading-relaxed">
                    <div>
                      <span className="text-cyan-400">$</span>{' '}
                      <span className="progzila-typeline">progzila --find developer</span>
                    </div>
                    <div className="text-gray-500">✓ 850+ verified profiles</div>
                    <div className="text-gray-500">
                      ✓ match: <span className="text-white">Full-Stack Developer</span>
                    </div>
                    <div className="text-gray-500">
                      React · Node.js · <span className="text-white">$45/h</span> · <span className="text-amber-400">★4.9</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-cyan-400">$</span>
                      <span className="w-2 h-4 bg-cyan-400 progzila-cursor" />
                    </div>
                  </div>
                </div>

                {/* developer-card mock */}
                <div className="progzila-card-b absolute bottom-2 left-0 w-56 bg-white rounded-2xl border border-[#E4E4EC] shadow-[0_20px_50px_rgba(20,21,31,0.12)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">مطور Full-Stack</div>
                      <div className="text-[11px] text-gray-400">React · Node.js</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <TagBadge label="الأعلى تقييمًا" className="bg-indigo-600 text-white border-indigo-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

         
        </section>

        {/* ------------------------------------------------------------ */}
        {/* How it works                                                 */}
        {/* ------------------------------------------------------------ */}
        <section className="py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <Eyebrow>كيف يعمل</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">ثلاث خطوات وتبدأ</h2>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-stretch gap-5 sm:gap-0">
              {STEPS.flatMap((step, index) => {
                const accent = STEP_ACCENTS[index % STEP_ACCENTS.length];
                const card = (
                  <motion.div
                    key={`step-${index}`}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.12 }}
                    whileHover={{ y: -6 }}
                    className="relative flex-1 bg-white rounded-2xl border border-[#E4E4EC] px-7 pt-8 pb-9 text-right overflow-hidden shadow-[0_1px_2px_rgba(20,21,31,0.04)] hover:shadow-[0_20px_40px_rgba(20,21,31,0.1)] transition-shadow duration-300"
                  >
                    <span
                      className="absolute top-0 right-0 left-0 h-1"
                      style={{ background: accent }}
                    />
                    <span className="absolute -top-4 left-3 font-mono text-8xl font-bold text-[#F3F3F9] select-none leading-none pointer-events-none">
                      {step.number}
                    </span>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 font-mono text-sm">
                        <span className="font-bold" style={{ color: accent }}>
                          {step.number}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span dir="ltr" className="text-cyan-600">
                          $ {step.cmd}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );

                if (index === STEPS.length - 1) return [card];

                const arrow = (
                  <div
                    key={`arrow-${index}`}
                    className="hidden sm:flex items-center justify-center shrink-0 w-10 relative z-10"
                  >
                    <span className="w-8 h-8 rounded-full bg-white border border-[#E4E4EC] flex items-center justify-center shadow-sm">
                      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </div>
                );

                return [card, arrow];
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Top developers                                               */}
        {/* ------------------------------------------------------------ */}
        <section className="py-20 sm:py-24 bg-white border-y border-[#E7E7F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <Eyebrow>أمهر المبرمجين</Eyebrow>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">نخبة من المنصة</h2>
              </div>
              <Link
                to="/developers"
                className="hidden sm:inline-flex items-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-700"
              >
                عرض الجميع
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topDevelopers.map((dev, index) => (
                <motion.div
                  key={dev.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (index % 3) * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="group bg-[#FAFAFD] rounded-2xl border border-[#E4E4EC] overflow-hidden transition-all duration-300 shadow-[0_1px_2px_rgba(20,21,31,0.04)] hover:shadow-[0_20px_40px_rgba(20,21,31,0.1)] hover:border-indigo-200"
                >
                  <div className="relative h-20 overflow-hidden bg-gray-100">
                    <img
                      src={dev.cover}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>
                  <div className="relative z-10 px-5">
                    <div className="-mt-8 flex items-end justify-between">
                      <div
                        className={`w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm ${
                          BADGE_RING[dev.badge] || ''
                        }`}
                      >
                        <img
                          src={dev.avatar}
                          alt={dev.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                          }}
                        />
                      </div>
                      <TagBadge label={dev.badge} className={BADGE_STYLES[dev.badge] || 'bg-white text-gray-600 border-gray-300'} />
                    </div>

                    <div className="pt-3 pb-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold">{dev.name}</h3>
                            {dev.badge === 'الأعلى تقييمًا' && (
                              <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M10 1.5l2.1 1.4 2.5-.3 1 2.3 2.3 1-.3 2.5 1.4 2.1-1.4 2.1.3 2.5-2.3 1-1 2.3-2.5-.3L10 18.5l-2.1-1.4-2.5.3-1-2.3-2.3-1 .3-2.5L1 10l1.4-2.1-.3-2.5 2.3-1 1-2.3 2.5.3L10 1.5zm3.7 6.1a.75.75 0 00-1.13-.98l-3.24 3.7-1.37-1.47a.75.75 0 10-1.1 1.02l1.93 2.07a.75.75 0 001.11-.02l3.8-4.32z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{dev.title}</p>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="font-mono font-semibold tabular-nums">${dev.hourlyRate}</div>
                          <div className="text-[11px] text-gray-400">/ساعة</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <StarRating rating={dev.rating} />
                        <span className="text-xs text-gray-400 font-mono">({dev.completed})</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dev.tech.map((t, i) => (
                          <span key={i} className={`px-2 py-0.5 text-xs rounded font-mono border ${TAG_PALETTE[i % TAG_PALETTE.length]}`}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/dev/${dev.id}`}
                        className="mt-4 block text-center py-2 rounded-lg border border-[#E4E4EC] bg-white text-gray-800 text-sm font-medium hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors duration-200"
                      >
                        عرض البروفايل
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link to="/developers" className="inline-flex items-center gap-1.5 text-indigo-600 font-medium">
                عرض جميع المبرمجين
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Featured projects                                            */}
        {/* ------------------------------------------------------------ */}
        <section className="py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <Eyebrow>أضخم المشاريع</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">مشاريع تم بيعها بالفعل</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (index % 6) * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl border border-[#E4E4EC] overflow-hidden transition-all duration-300 shadow-[0_1px_2px_rgba(20,21,31,0.04)] hover:shadow-[0_20px_40px_rgba(20,21,31,0.1)] hover:border-indigo-200 flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/95 text-indigo-700 text-xs rounded-md border border-white/50 font-medium">
                        {project.category}
                      </span>
                      <span className="bg-white/95 text-gray-700 px-2 py-1 rounded-md text-xs font-mono border border-white/50">
                        {project.sales} بيع
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 text-sm text-white">
                        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
                        </svg>
                        <span className="font-mono font-semibold">{project.rating}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 text-right flex flex-col flex-1">
                    <h3 className="text-lg font-semibold mb-2">{project.name}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={project.devAvatar}
                        alt={project.dev}
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                        }}
                      />
                      <span className="text-sm text-gray-500">{project.dev}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t, i) => (
                        <span key={i} className={`px-2 py-0.5 text-xs rounded font-mono border ${TAG_PALETTE[i % TAG_PALETTE.length]}`}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#F0F0F5] flex items-center justify-between">
                      <span className="font-mono text-xl font-bold tabular-nums">${project.price}</span>
                      <button
                        onClick={() => handleProjectClick(project.id)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors duration-200"
                      >
                        تفاصيل المشروع
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-white text-gray-800 font-semibold py-3 px-7 rounded-lg transition-colors duration-200"
              >
                استكشف جميع المشاريع
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Final CTA                                                    */}
        {/* ------------------------------------------------------------ */}
        <section className="relative py-20 sm:py-24 my-4 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-[#0B0B12] px-6 sm:px-12 py-14 sm:py-16 text-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
                style={{ background: '#6366f1' }}
              />
              <div
                className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: '#7c3aed' }}
              />

              <div className="relative">
                <div className="font-mono text-xs tracking-wide text-gray-500 mb-3">
                  <span className="text-gray-600">// </span>ابدأ الآن
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">جاهز تبدأ مشروعك القادم؟</h3>
                <p className="mt-3 text-gray-400 max-w-xl mx-auto">
                  اعثر على أفضل المبرمجين لمشروعك، أو ابدأ بعرض خبرتك وبيعها اليوم.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-7 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    ابدأ مجانًا الآن
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center justify-center border border-gray-700 text-white hover:bg-white/10 font-semibold py-3 px-7 rounded-lg transition-colors duration-200"
                  >
                    اعرف أكثر
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      </div>
    </div>
  );
}