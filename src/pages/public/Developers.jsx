import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Developers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');


  // Mock data
  useEffect(() => {
    const mockDevelopers = [
      {
        id: 1,
        name: 'أحمد المنصوري',
        email: 'ahmed@devhire.com',
        title: 'Full Stack Architect',
        bio: 'خبير في تطوير تطبيقات الويب باستخدام React و Node.js. أكثر من 8 سنوات خبرة.',
        track: 'fullstack',
        level: 'expert',
        rating: 4.9,
        completedProjects: 142,
        hourlyRate: 75,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
        tech: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        badges: ['🏆 الأفضل', '🚀 مميز'],
        available: true,
        location: 'مصر',
        languages: ['العربية', 'English'],
        social: { github: 'ahmed_dev', linkedin: 'ahmed-dev' },
        projectsCount: 47,
        salesCount: 156
      },
      {
        id: 2,
        name: 'سارة القحطاني',
        email: 'sara@devhire.com',
        title: 'Frontend Expert',
        bio: 'متخصصة في واجهات المستخدم وتجربة المستخدم. شغوفة بإنشاء تصاميم جذابة.',
        track: 'frontend',
        level: 'senior',
        rating: 4.8,
        completedProjects: 118,
        hourlyRate: 65,
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
        tech: ['React', 'Vue.js', 'Tailwind', 'Figma', 'Next.js'],
        badges: ['⭐ متميز', '🎨 إبداعية'],
        available: true,
        location: 'السعودية',
        languages: ['العربية', 'English'],
        social: { github: 'sara_dev', linkedin: 'sara-dev' },
        projectsCount: 38,
        salesCount: 98
      },
      {
        id: 3,
        name: 'يوسف إبراهيم',
        email: 'youssef@devhire.com',
        title: 'Mobile Dev Expert',
        bio: 'مطور تطبيقات موبايل محترف باستخدام Flutter و React Native.',
        track: 'mobile',
        level: 'expert',
        rating: 4.9,
        completedProjects: 94,
        hourlyRate: 70,
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        tech: ['Flutter', 'React Native', 'Dart', 'iOS', 'Android'],
        badges: ['🚀 مميز', '📱 خبير'],
        available: true,
        location: 'الإمارات',
        languages: ['العربية', 'English'],
        social: { github: 'youssef_mobile', linkedin: 'youssef-mobile' },
        projectsCount: 52,
        salesCount: 134
      },
      {
        id: 4,
        name: 'نورة خالد',
        email: 'noura@devhire.com',
        title: 'UI/UX + Frontend',
        bio: 'مصممة واجهات ومطورة Frontend. أهتم بتجربة المستخدم.',
        track: 'frontend',
        level: 'mid',
        rating: 4.7,
        completedProjects: 82,
        hourlyRate: 55,
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        cover: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600',
        tech: ['React', 'Figma', 'Adobe XD', 'CSS3', 'HTML5'],
        badges: ['✨ صاعدة', '🎨 مصممة'],
        available: true,
        location: 'الكويت',
        languages: ['العربية', 'English'],
        social: { github: 'noura_ui', linkedin: 'noura-ui' },
        projectsCount: 29,
        salesCount: 67
      },
      {
        id: 5,
        name: 'عبدالله السالم',
        email: 'abdullah@devhire.com',
        title: 'DevOps Engineer',
        bio: 'مهندس DevOps محترف مع خبرة في AWS و Kubernetes.',
        track: 'devops',
        level: 'expert',
        rating: 4.9,
        completedProjects: 108,
        hourlyRate: 85,
        avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600',
        tech: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        badges: ['🔥 خبير', '⚙️ DevOps'],
        available: false,
        location: 'قطر',
        languages: ['العربية', 'English'],
        social: { github: 'abdullah_devops', linkedin: 'abdullah-devops' },
        projectsCount: 61,
        salesCount: 89
      },
      {
        id: 6,
        name: 'هند العتيبي',
        email: 'hind@devhire.com',
        title: 'AI/ML Specialist',
        bio: 'متخصصة في الذكاء الاصطناعي وتعلم الآلة.',
        track: 'ai',
        level: 'senior',
        rating: 4.8,
        completedProjects: 63,
        hourlyRate: 80,
        avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
        cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
        tech: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn'],
        badges: ['🧠 خبيرة', '🤖 AI'],
        available: true,
        location: 'البحرين',
        languages: ['العربية', 'English'],
        social: { github: 'hind_ai', linkedin: 'hind-ai' },
        projectsCount: 34,
        salesCount: 78
      },
      {
        id: 7,
        name: 'محمد رشاد',
        email: 'mohamed@devhire.com',
        title: 'Backend Developer',
        bio: 'مطور Backend محترف باستخدام Python و Django.',
        track: 'backend',
        level: 'senior',
        rating: 4.7,
        completedProjects: 76,
        hourlyRate: 60,
        avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
        cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
        tech: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
        badges: ['💪 قوي', '🔧 Backend'],
        available: true,
        location: 'مصر',
        languages: ['العربية', 'English'],
        social: { github: 'mohamed_backend', linkedin: 'mohamed-backend' },
        projectsCount: 43,
        salesCount: 112
      },
      {
        id: 8,
        name: 'فاطمة الزهراء',
        email: 'fatima@devhire.com',
        title: 'Full Stack Developer',
        bio: 'مطورة Full Stack شغوفة بتقنيات الويب الحديثة.',
        track: 'fullstack',
        level: 'mid',
        rating: 4.6,
        completedProjects: 58,
        hourlyRate: 50,
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'GraphQL'],
        badges: ['🌟 واعدة', '💻 Full Stack'],
        available: true,
        location: 'الأردن',
        languages: ['العربية', 'English'],
        social: { github: 'fatima_fullstack', linkedin: 'fatima-fullstack' },
        projectsCount: 25,
        salesCount: 56
      }
    ];

    setTimeout(() => {
      setDevelopers(mockDevelopers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort
  const filteredDevelopers = useMemo(() => {
    let filtered = [...developers];

    if (searchTerm) {
      filtered = filtered.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTrack !== 'all') {
      filtered = filtered.filter(dev => dev.track === selectedTrack);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(dev => dev.level === selectedLevel);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'projects': return b.completedProjects - a.completedProjects;
        case 'rate': return b.hourlyRate - a.hourlyRate;
        case 'sales': return b.salesCount - a.salesCount;
        default: return 0;
      }
    });

    return filtered;
  }, [developers, searchTerm, selectedTrack, selectedLevel, sortBy]);

  const tracks = [
    { value: 'all', label: 'الكل', icon: '🌐' },
    { value: 'frontend', label: 'Frontend', icon: '🎨' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'fullstack', label: 'Full Stack', icon: '🚀' },
    { value: 'mobile', label: 'Mobile', icon: '📱' },
    { value: 'devops', label: 'DevOps', icon: '🔧' },
    { value: 'ai', label: 'AI/ML', icon: '🧠' }
  ];

  const levels = [
    { value: 'all', label: 'الكل', color: 'gray' },
    { value: 'junior', label: 'مبتدئ', color: 'blue' },
    { value: 'mid', label: 'متوسط', color: 'green' },
    { value: 'senior', label: 'محترف', color: 'orange' },
    { value: 'expert', label: 'خبير', color: 'red' }
  ];

  const getLevelColor = (level) => {
    const colors = {
      junior: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      mid: 'bg-green-500/20 text-green-400 border-green-500/30',
      senior: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      expert: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { y: -8, transition: { duration: 0.2, type: "spring", stiffness: 300 } }
  };



  const filterItemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow relative">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3"
            >
              <span className="text-yellow-400 text-sm">✨</span>
              <span className="text-white/90 text-xs">أكثر من 1000 مبرمج محترف</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              المبرمجين المميزين
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-white/90 max-w-2xl mx-auto"
            >
              تعرف على نخبة المبرمجين العرب المحترفين واختر الأنسب لمشروعك
            </motion.p>
          </div>
        </div>

        {/* Search and Filters Section - NON-sticky to prevent overlap */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            
            {/* Search Bar */}
            <motion.div variants={filterItemVariants} className="mb-4">
              <div className="relative group">
                <div className="relative">
                  {/* Search Icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <motion.svg
                      animate={{ rotate: searchTerm ? [0, 360] : 0, scale: searchTerm ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </motion.svg>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن مبرمج... (بالاسم، التخصص، أو التقنية)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 text-right rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm"
                    style={{ paddingRight: '3rem', paddingLeft: '3rem' }}
                  />

                  {/* Clear Button */}
                  <AnimatePresence>
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Search Stats */}
              <AnimatePresence>
                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-2.5 flex items-center justify-between border border-indigo-100">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                          className="text-indigo-600 text-sm"
                        >
                          🔍
                        </motion.div>
                        <span className="text-xs text-gray-700">
                          تم العثور على <span className="font-bold text-indigo-600 mx-0.5">{filteredDevelopers.length}</span> مبرمج
                          {searchTerm && ` تطابق "${searchTerm}"`}
                        </span>
                      </div>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        مسح الكل ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Filters Row - Balanced layout */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Track Filters - Left side */}
              <div className="flex flex-wrap gap-2">
                {tracks.map((track) => (
                  <motion.button
                    key={track.value}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTrack(track.value)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm ${
                      selectedTrack === track.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="ml-1 text-sm">{track.icon}</span>
                    {track.label}
                  </motion.button>
                ))}
              </div>

              {/* Right Side Controls */}
              <div className="flex gap-2">
                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white/50 backdrop-blur-sm appearance-none cursor-pointer text-gray-700 text-sm"
                  style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%236b7280\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "left 0.5rem center", backgroundSize: "0.875rem", paddingLeft: '1.75rem' }}
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>📊 {level.label}</option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white/50 backdrop-blur-sm appearance-none cursor-pointer text-gray-700 text-sm"
                  style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%236b7280\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "left 0.5rem center", backgroundSize: "0.875rem", paddingLeft: '1.75rem' }}
                >
                  <option value="rating">⭐ التقييم</option>
                  <option value="projects">📦 المشاريع</option>
                  <option value="rate">💰 السعر</option>
                  <option value="sales">🏆 المبيعات</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <AnimatePresence>
              {(selectedTrack !== 'all' || selectedLevel !== 'all') && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200"
                >
                  <span className="text-xs text-gray-500">الفلاتر النشطة:</span>
                  {selectedTrack !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                      {tracks.find(t => t.value === selectedTrack)?.label}
                      <button onClick={() => setSelectedTrack('all')} className="hover:text-indigo-900 mr-0.5">✕</button>
                    </span>
                  )}
                  {selectedLevel !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {levels.find(l => l.value === selectedLevel)?.label}
                      <button onClick={() => setSelectedLevel('all')} className="hover:text-purple-900 mr-0.5">✕</button>
                    </span>
                  )}
                  <button
                    onClick={() => { setSelectedTrack('all'); setSelectedLevel('all'); setSearchTerm(''); }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    مسح الكل
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Count - Added margin top for spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-indigo-500 text-sm">✨</div>
              <p className="text-gray-600 text-xs">
                عرض <span className="font-bold text-indigo-600 mx-0.5">{filteredDevelopers.length}</span> مبرمج
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500">جاري التحميل...</span>
              </div>
            )}
          </div>
        </div>

        {/* Developers Grid/List - Added padding bottom for spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-24 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-1.5"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDevelopers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-1">لا يوجد مبرمجون</h3>
              <p className="text-sm text-gray-500">لم نجد أي مبرمجين مطابقين لمعايير البحث</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedTrack('all'); setSelectedLevel('all'); }}
                className="mt-3 px-5 py-1.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition"
              >
                مسح جميع الفلاتر
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="wait">
                {filteredDevelopers.map((dev) => (
                  <motion.div
                    key={dev.id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Cover Image */}
                    <div className="relative h-24 overflow-hidden">
                      <motion.img
                        src={dev.cover}
                        alt={dev.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Availability Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${dev.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {dev.available ? 'متاح' : 'مشغول'}
                        </span>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {dev.badges.slice(0, 2).map((badge, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-yellow-400 text-gray-800 text-[10px] rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative px-5">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -top-9 right-5 w-14 h-14 rounded-xl border-4 border-white shadow-xl overflow-hidden bg-white"
                      >
                        <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="pt-8 pb-4 px-5">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base font-bold text-gray-800">{dev.name}</h3>
                          <p className="text-[11px] text-indigo-600 font-semibold">{dev.title}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-indigo-600">${dev.hourlyRate}</div>
                          <div className="text-[10px] text-gray-500">/ ساعة</div>
                        </div>
                      </div>

                      {/* Rating & Projects */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          <span className="text-yellow-400 text-[11px]">★</span>
                          <span className="font-semibold text-[11px]">{dev.rating}</span>
                        </div>
                        <div className="text-gray-400 text-[10px]">|</div>
                        <div className="text-[10px] text-gray-600">📦 {dev.completedProjects}</div>
                        <div className="text-[10px] text-gray-600">🏆 {dev.salesCount}</div>
                      </div>

                      {/* Level */}
                      <div className="mb-2">
                        <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-semibold border ${getLevelColor(dev.level)}`}>
                          {levels.find(l => l.value === dev.level)?.label}
                        </span>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {dev.tech.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">
                            {tech}
                          </span>
                        ))}
                        {dev.tech.length > 4 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-lg">
                            +{dev.tech.length - 4}
                          </span>
                        )}
                      </div>

                      {/* View Profile Button */}
                      <Link
                        to={`/dev/${dev.name}`}
                        className="block w-full text-center py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-[11px] font-medium"
                      >
                        عرض البروفايل
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <AnimatePresence mode="wait">
                {filteredDevelopers.map((dev, index) => (
                  <motion.div
                    key={dev.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 10, scale: 1.01 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={dev.avatar}
                        alt={dev.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-base font-bold">{dev.name}</h3>
                            <p className="text-xs text-indigo-600">{dev.title}</p>
                          </div>
                          <div className="text-lg font-bold text-indigo-600">
                            ${dev.hourlyRate}<span className="text-[10px] text-gray-500">/ساعة</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-1 text-xs">
                          <span className="flex items-center gap-0.5">★ {dev.rating}</span>
                          <span>{dev.completedProjects} مشروع</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${dev.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            {dev.available ? 'متاح' : 'مشغول'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs line-clamp-1">{dev.bio}</p>
                      </div>
                      <Link
                        to={`/dev/${dev.name}`}
                        className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition whitespace-nowrap"
                      >
                        عرض البروفايل
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}