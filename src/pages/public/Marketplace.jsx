import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Marketplace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  
  // Refs for scroll animations
  const containerRef = useRef(null);

  // Mock data for marketplace projects
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'نظام إدارة المستشفيات الذكي',
        description: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى، المواعيد، الغرف، والموظفين مع لوحة تحكم متقدمة.',
        developer: 'أحمد المنصوري',
        developerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        category: 'management',
        price: 499,
        salesCount: 156,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
        tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
        features: ['إدارة المرضى', 'جدولة المواعيد', 'تقارير متقدمة', 'API مفتوحة'],
        packages: [
          { name: 'Basic', price: 499, delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 1499, delivery: '7 أيام', features: ['كل ما في Basic', 'تعديل الألوان', 'إضافة ميزة واحدة'] },
          { name: 'Enterprise', price: 4999, delivery: '30 يوم', features: ['بناء مخصص كامل', 'دعم فني شهر', 'استضافة'] }
        ],
        badge: 'الأكثر مبيعاً',
        popular: true
      },
      {
        id: 2,
        name: 'منصة تعليمية متكاملة',
        description: 'منصة تعليمية إلكترونية متكاملة تشمل نظام إدارة المحتوى، نظام الفصول الافتراضية، ونظام الامتحانات.',
        developer: 'يوسف إبراهيم',
        developerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        category: 'education',
        price: 599,
        salesCount: 134,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600',
        tech: ['Flutter', 'Django', 'PostgreSQL', 'Redis'],
        features: ['دروس فيديو', 'نظام امتحانات', 'شهادات إلكترونية', 'منتدى نقاش'],
        packages: [
          { name: 'Basic', price: 599, delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 1799, delivery: '7 أيام', features: ['كل ما في Basic', 'تعديل الشعار', 'إضافة نظام الدفع'] }
        ],
        badge: 'مميز',
        popular: true
      },
      {
        id: 3,
        name: 'متجر إلكتروني متكامل',
        description: 'متجر إلكتروني احترافي مع نظام دفع متكامل، إدارة منتجات، وعملاء، وتقارير مبيعات متقدمة.',
        developer: 'نورة خالد',
        developerAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        category: 'ecommerce',
        price: 399,
        salesCount: 289,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600',
        tech: ['Next.js', 'Stripe', 'Tailwind', 'Prisma'],
        features: ['سلة مشتريات', 'بوابات دفع', 'إدارة مخزون', 'تقارير مبيعات'],
        packages: [
          { name: 'Basic', price: 399, delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 1299, delivery: '7 أيام', features: ['كل ما في Basic', 'إضافة وحدة الدفع', 'تعديل التصميم'] }
        ],
        badge: 'الأكثر مبيعاً',
        popular: true
      },
      {
        id: 4,
        name: 'لوحة تحكم تحليلات متقدمة',
        description: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات مع رسوم بيانية متقدمة وتقارير قابلة للتخصيص.',
        developer: 'عبدالله السالم',
        developerAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        category: 'dashboard',
        price: 699,
        salesCount: 89,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        tech: ['React', 'D3.js', 'Firebase', 'Chart.js'],
        features: ['رسوم بيانية تفاعلية', 'تصدير تقارير', 'لوحات مخصصة', 'تحديث لحظي'],
        packages: [
          { name: 'Basic', price: 699, delivery: '5 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 1999, delivery: '14 يوم', features: ['كل ما في Basic', 'API مخصصة', 'دعم فني'] }
        ],
        badge: 'جديد',
        popular: false
      },
      {
        id: 5,
        name: 'نظام إدارة المطاعم',
        description: 'نظام متكامل لإدارة المطاعم يشمل إدارة الطلبات، المخزون، الموظفين، وتقارير المبيعات.',
        developer: 'سارة القحطاني',
        developerAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        category: 'management',
        price: 449,
        salesCount: 67,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
        tech: ['Vue.js', 'Laravel', 'MySQL', 'Bootstrap'],
        features: ['نظام طلبات', 'إدارة طاولات', 'نظام فواتير', 'تقارير يومية'],
        packages: [
          { name: 'Basic', price: 449, delivery: '3 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] }
        ],
        badge: 'مميز',
        popular: false
      },
      {
        id: 6,
        name: 'تطبيق موبايل للتسوق',
        description: 'تطبيق موبايل كامل للتسوق الإلكتروني مع نظام دفع وإشعارات وتكامل مع APIs.',
        developer: 'هند العتيبي',
        developerAvatar: 'https://randomuser.me/api/portraits/women/89.jpg',
        category: 'mobile',
        price: 899,
        salesCount: 45,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
        tech: ['Flutter', 'Firebase', 'REST API', 'Node.js'],
        features: ['تسجيل دخول', 'عربة تسوق', 'إشعارات', 'بوابات دفع'],
        packages: [
          { name: 'Basic', price: 899, delivery: '7 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 2499, delivery: '21 يوم', features: ['كل ما في Basic', 'إصدار iOS و Android', 'دعم فني'] }
        ],
        badge: 'جديد',
        popular: false
      },
      {
        id: 7,
        name: 'نظام CRM لإدارة العملاء',
        description: 'نظام متكامل لإدارة علاقات العملاء مع تتبع المبيعات والتسويق ودعم العملاء.',
        developer: 'محمد رشاد',
        developerAvatar: 'https://randomuser.me/api/portraits/men/15.jpg',
        category: 'management',
        price: 549,
        salesCount: 78,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Material-UI'],
        features: ['إدارة جهات اتصال', 'تتبع المبيعات', 'تقارير', 'تذكيرات'],
        packages: [
          { name: 'Basic', price: 549, delivery: '5 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] }
        ],
        badge: 'مميز',
        popular: false
      },
      {
        id: 8,
        name: 'منصة بث مباشر',
        description: 'منصة متكاملة للبث المباشر تشمل غرف دردشة، تفاعل مع المشاهدين، ونظام اشتراكات.',
        developer: 'فاطمة الزهراء',
        developerAvatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        category: 'education',
        price: 799,
        salesCount: 34,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?w=600',
        tech: ['Next.js', 'WebRTC', 'Socket.io', 'Redis'],
        features: ['بث مباشر', 'دردشة حية', 'نظام اشتراكات', 'إشعارات'],
        packages: [
          { name: 'Basic', price: 799, delivery: '7 أيام', features: ['كود المصدر', 'تثبيت', 'شرح بالفيديو'] },
          { name: 'Pro', price: 2999, delivery: '30 يوم', features: ['كل ما في Basic', 'تطبيق موبايل', 'دعم فني 24/7'] }
        ],
        badge: 'جديد',
        popular: false
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case 'under500':
          filtered = filtered.filter(project => project.price < 500);
          break;
        case '500-1000':
          filtered = filtered.filter(project => project.price >= 500 && project.price <= 1000);
          break;
        case 'above1000':
          filtered = filtered.filter(project => project.price > 1000);
          break;
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.salesCount - a.salesCount;
        case 'priceLow': return a.price - b.price;
        case 'priceHigh': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  const categories = [
    { value: 'all', label: 'الكل', icon: '🌐' },
    { value: 'management', label: 'نظم إدارة', icon: '📊' },
    { value: 'ecommerce', label: 'متاجر إلكترونية', icon: '🛒' },
    { value: 'education', label: 'منصات تعليمية', icon: '📚' },
    { value: 'dashboard', label: 'لوحات تحكم', icon: '📈' },
    { value: 'mobile', label: 'تطبيقات موبايل', icon: '📱' }
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: 'under500', label: 'أقل من $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: 'above1000', label: 'أكثر من $1000' }
  ];

  // Scroll Animation Variants
  const scrollRevealVariants = {
    hidden: (custom) => ({
      opacity: 0,
      y: 60,
      scale: 0.9,
      transition: { duration: 0.5, delay: custom * 0.1 }
    }),
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: custom * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    })
  };

  const containerScrollVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

 

  // Animation variants for filters
  const staggerFilters = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
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
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3"
            >
              <span className="text-yellow-400 text-sm">🏪</span>
              <span className="text-white/90 text-xs">أكثر من 500 مشروع قابل للشراء الفوري</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              متجر المشاريع الجاهزة
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-white/90 max-w-2xl mx-auto"
            >
              اشتري مشاريع برمجية جاهزة ووفر وقت التطوير، أو اربح من خلال بيع نسخ متعددة من مشروعك
            </motion.p>
          </div>
        </div>

        {/* Search and Filters Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerFilters}
          className="bg-white/80 backdrop-blur-lg border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            
            {/* Search Bar */}
            <motion.div variants={filterItemVariants} className="mb-4">
              <div className="relative group">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <motion.svg
                      animate={{ rotate: searchTerm ? [0, 360] : 0, scale: searchTerm ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </motion.svg>
                  </div>

                  <input
                    type="text"
                    placeholder="🔍 ابحث عن مشروع... (بالاسم، التخصص، أو التقنية)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 text-right rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm"
                    style={{ paddingRight: '2.5rem', paddingLeft: '2.5rem' }}
                  />

                  <AnimatePresence>
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

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
                          تم العثور على <span className="font-bold text-indigo-600 mx-0.5">{filteredProjects.length}</span> مشروع
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

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.value}
                    variants={filterItemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm ${
                      selectedCategory === cat.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="ml-1 text-sm">{cat.icon}</span>
                    {cat.label}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white/50 backdrop-blur-sm appearance-none cursor-pointer text-gray-700 text-sm"
                  style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%236b7280\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "left 0.5rem center", backgroundSize: "0.875rem", paddingRight: '1.75rem', paddingLeft: '1.75rem' }}
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>💰 {range.label}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white/50 backdrop-blur-sm appearance-none cursor-pointer text-gray-700 text-sm"
                  style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%236b7280\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "left 0.5rem center", backgroundSize: "0.875rem", paddingRight: '1.75rem', paddingLeft: '1.75rem' }}
                >
                  <option value="popular">🏆 الأكثر مبيعاً</option>
                  <option value="priceLow">💰 السعر: من الأقل للأعلى</option>
                  <option value="priceHigh">💰 السعر: من الأعلى للأقل</option>
                  <option value="rating">⭐ الأعلى تقييماً</option>
                </select>

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
              {(selectedCategory !== 'all' || selectedPriceRange !== 'all') && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200"
                >
                  <span className="text-xs text-gray-500">الفلاتر النشطة:</span>
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                      {categories.find(c => c.value === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-indigo-900 mr-0.5">✕</button>
                    </span>
                  )}
                  {selectedPriceRange !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {priceRanges.find(p => p.value === selectedPriceRange)?.label}
                      <button onClick={() => setSelectedPriceRange('all')} className="hover:text-purple-900 mr-0.5">✕</button>
                    </span>
                  )}
                  <button
                    onClick={() => { setSelectedCategory('all'); setSelectedPriceRange('all'); setSearchTerm(''); }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    مسح الكل
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-3"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                className="text-indigo-500 text-sm"
              >
                ✨
              </motion.div>
              <p className="text-gray-600 text-xs">
                عرض <motion.span key={filteredProjects.length} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-bold text-indigo-600 mx-0.5 inline-block">{filteredProjects.length}</motion.span> مشروع
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500">جاري التحميل...</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Projects Grid/List with Scroll Animation */}
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-3"
              >
                🔍
              </motion.div>
              <h3 className="text-xl font-bold text-gray-700 mb-1">لا يوجد مشاريع</h3>
              <p className="text-sm text-gray-500">لم نجد أي مشاريع مطابقة لمعايير البحث</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedPriceRange('all'); }}
                className="mt-3 px-5 py-1.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition"
              >
                مسح جميع الفلاتر
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              variants={containerScrollVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  custom={index}
                  variants={scrollRevealVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Project Image */}
                  <div className="relative h-40 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badge */}
                    {project.badge && (
                      <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="absolute top-3 right-3"
                      >
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          project.badge === 'الأكثر مبيعاً' 
                            ? 'bg-yellow-500 text-white' 
                            : project.badge === 'مميز'
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {project.badge}
                        </span>
                      </motion.div>
                    )}
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-white font-bold text-sm">${project.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 ml-2">
                        <h3 className="text-base font-bold text-gray-800 truncate">{project.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <motion.img 
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            src={project.developerAvatar} 
                            alt={project.developer} 
                            className="w-4 h-4 rounded-full" 
                          />
                          <span className="text-[10px] text-gray-500 truncate">{project.developer}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <motion.span 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="text-yellow-400 text-xs"
                        >
                          ★
                        </motion.span>
                        <span className="text-xs font-semibold">{project.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech.slice(0, 3).map((tech, i) => (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + i * 0.03 }}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] rounded-lg"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] rounded-lg">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Sales Count */}
                    <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-400">
                      <span>🏆 {project.salesCount} عملية بيع</span>
                    </div>

                    {/* View Details Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={`/marketplace/${project.id}`}
                        className="block w-full text-center py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-xs font-medium"
                      >
                        تفاصيل المشروع
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={containerScrollVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-3"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  custom={index}
                  variants={scrollRevealVariants}
                  whileHover={{ x: 10, scale: 1.01 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src={project.image} 
                      alt={project.name} 
                      className="w-24 h-24 rounded-xl object-cover shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 ml-2">
                          <h3 className="text-base font-bold truncate">{project.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <img src={project.developerAvatar} alt={project.developer} className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-500 truncate">{project.developer}</span>
                            <span className="text-gray-300 text-xs">|</span>
                            <div className="flex items-center gap-0.5">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-xs">{project.rating}</span>
                            </div>
                          </div>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="text-lg font-bold text-indigo-600 shrink-0"
                        >
                          ${project.price}
                        </motion.div>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-1 mb-2">{project.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] rounded-lg">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">🏆 {project.salesCount} بيع</span>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to={`/marketplace/${project.id}`}
                        className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition whitespace-nowrap shrink-0"
                      >
                        تفاصيل
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}