import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function DevProfile() {
  const { username } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // Mock data - Replace with API call
    const mockDeveloper = {
      id: 1,
      name: 'أحمد المنصوري',
      username: 'ahmed-mansouri',
      title: 'Full Stack Architect',
      bio: 'مبرمج Full Stack محترف مع أكثر من 8 سنوات خبرة. متخصص في بناء تطبيقات الويب الحديثة باستخدام React و Node.js. عملت على أكثر من 50 مشروع ناجح لعملاء حول العالم.',
      longBio: `بدأت مسيرتي في البرمجة منذ 8 سنوات، وعملت مع العديد من الشركات الكبرى في مجال التقنية. أؤمن بأن البرمجة هي لغة المستقبل، وأسعى دائماً لتقديم أفضل الحلول البرمجية.

خلال مسيرتي المهنية، تمكنت من:
• قيادة فرق تطوير في مشاريع ضخمة
• تصميم وبناء أنظمة معقدة قابلة للتوسع
• تحسين أداء التطبيقات بنسبة تصل إلى 60%
• تدريب وتوجيه أكثر من 20 مطور مبتدئ

أنا متحمس دائماً للتعلم والتطوير، وأحب مشاركة معرفتي مع المجتمع التقني.`,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
      rating: 4.9,
      totalProjects: 142,
      completedProjects: 138,
      ongoingProjects: 4,
      salesCount: 156,
      hourlyRate: 75,
      experience: '5-8',
      location: 'مصر',
      languages: ['العربية', 'الإنجليزية'],
      memberSince: '2023-01-15',
      techStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'TailwindCSS'],
      skills: ['حل المشكلات', 'التواصل الفعال', 'القيادة', 'إدارة الوقت', 'التفكير النقدي', 'العمل الجماعي'],
      portfolio: [
        {
          id: 1,
          title: 'نظام إدارة المستشفيات',
          description: 'نظام متكامل لإدارة المستشفيات يشمل إدارة المرضى والمواعيد والغرف',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
          link: '/marketplace/1',
          tech: ['React', 'Node.js', 'MongoDB']
        },
        {
          id: 2,
          title: 'منصة تعليمية',
          description: 'منصة تعليمية إلكترونية متكاملة مع نظام إدارة المحتوى والامتحانات',
          image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
          link: '/marketplace/2',
          tech: ['Next.js', 'Django', 'PostgreSQL']
        },
        {
          id: 3,
          title: 'لوحة تحكم تحليلات',
          description: 'لوحة تحكم تفاعلية لعرض البيانات والإحصائيات المتقدمة',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
          link: '/marketplace/4',
          tech: ['React', 'D3.js', 'Firebase']
        }
      ],
      projectsForSale: [
        {
          id: 1,
          name: 'نظام إدارة المستشفيات الذكي',
          price: 499,
          sales: 156,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
        },
        {
          id: 4,
          name: 'لوحة تحكم تحليلات متقدمة',
          price: 699,
          sales: 89,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
        }
      ],
      social: {
        github: 'ahmed_mansouri',
        linkedin: 'ahmed-mansouri',
        twitter: 'ahmed_dev',
        website: 'https://ahmedmansouri.com'
      },
      education: [
        { degree: 'ماجستير علوم الحاسب', institution: 'جامعة القاهرة', year: '2018', description: 'تخصص في هندسة البرمجيات' },
        { degree: 'بكالوريوس علوم الحاسب', institution: 'جامعة عين شمس', year: '2015', description: 'تقدير امتياز مع مرتبة الشرف' }
      ],
      certificates: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', date: '2023', credentialId: 'AWS-12345' },
        { name: 'Meta Backend Developer', issuer: 'Meta', date: '2022', credentialId: 'META-67890' }
      ],
      reviews: [
        { user: 'سارة القحطاني', rating: 5, comment: 'عمل رائع جداً، أنجز المشروع قبل الموعد المحدد', date: '2024-01-15', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
        { user: 'محمد العتيبي', rating: 4.8, comment: 'متمكن جداً في مجاله، التعامل معه سهل ومحترف', date: '2024-01-10', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { user: 'نورة خالد', rating: 5, comment: 'أفضل مبرمج تعاملت معه، أنصح به بشدة', date: '2024-01-05', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' }
      ]
    };

    setTimeout(() => {
      setDeveloper(mockDeveloper);
      setLoading(false);
    }, 500);
  }, [username]);

  const getExperienceLabel = (experience) => {
    const levels = {
      '0-1': 'مبتدئ (0-1 سنة)',
      '1-3': 'متوسط (1-3 سنوات)',
      '3-5': 'محترف (3-5 سنوات)',
      '5-8': 'خبير (5-8 سنوات)',
      '8+': 'أسطورة (8+ سنوات)'
    };
    return levels[experience] || experience;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل البروفايل...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">المبرمج غير موجود</h1>
            <p className="text-gray-500">عذراً، لم نتمكن من العثور على المبرمج المطلوب</p>
            <Link to="/developers" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              العودة للمبرمجين
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow relative">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img 
            src={developer.coverImage} 
            alt={developer.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Profile Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img src={developer.avatar} alt={developer.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                متاح للعمل
              </div>
            </motion.div>

            {/* Name & Title */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{developer.name}</h1>
              <p className="text-indigo-600 font-semibold mt-1">{developer.title}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <span>📍</span> {developer.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <span>💬</span> {developer.languages.join(' - ')}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <span>📅</span> عضو منذ {new Date(developer.memberSince).getFullYear()}
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-indigo-600">${developer.hourlyRate}</div>
                <div className="text-xs text-gray-500">/ ساعة</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-yellow-500">★ {developer.rating}</div>
                <div className="text-xs text-gray-500">تقييم</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats & Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">📞 تواصل معي</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">
                    📩 إرسال رسالة
                  </button>
                  <button className="w-full py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition">
                    📋 طلب عرض سعر
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">📊 إحصائيات</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المشاريع المنجزة</span>
                    <span className="font-bold text-xl text-indigo-600">{developer.completedProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المشاريع الحالية</span>
                    <span className="font-bold text-xl text-indigo-600">{developer.ongoingProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">إجمالي المشاريع</span>
                    <span className="font-bold text-xl text-indigo-600">{developer.totalProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عدد المبيعات</span>
                    <span className="font-bold text-xl text-indigo-600">{developer.salesCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">سنوات الخبرة</span>
                    <span className="font-bold text-xl text-indigo-600">{getExperienceLabel(developer.experience)}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">🔗 روابط التواصل</h3>
                <div className="space-y-3">
                  {developer.social.github && (
                    <a href={`https://github.com/${developer.social.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">🐙</div>
                      <span className="text-gray-700">GitHub</span>
                      <span className="text-gray-400 text-sm flex-1 text-left">{developer.social.github}</span>
                    </a>
                  )}
                  {developer.social.linkedin && (
                    <a href={`https://linkedin.com/in/${developer.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">in</div>
                      <span className="text-gray-700">LinkedIn</span>
                      <span className="text-gray-400 text-sm flex-1 text-left">{developer.social.linkedin}</span>
                    </a>
                  )}
                  {developer.social.twitter && (
                    <a href={`https://twitter.com/${developer.social.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white">𝕏</div>
                      <span className="text-gray-700">Twitter</span>
                      <span className="text-gray-400 text-sm flex-1 text-left">{developer.social.twitter}</span>
                    </a>
                  )}
                  {developer.social.website && (
                    <a href={developer.social.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">🌐</div>
                      <span className="text-gray-700">الموقع الشخصي</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">⭐ المهارات</h3>
                <div className="flex flex-wrap gap-2">
                  {developer.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">🌐 اللغات</h3>
                <div className="flex flex-wrap gap-2">
                  {developer.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: 'about', label: 'نبذة عني', icon: '👤' },
                    { id: 'portfolio', label: 'أعمالي', icon: '📁' },
                    { id: 'projects', label: 'مشاريع للبيع', icon: '🛒' },
                    { id: 'reviews', label: 'التقييمات', icon: '💬' },
                    { id: 'education', label: 'المؤهلات', icon: '🎓' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-4 font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                          : 'text-gray-500 hover:text-indigo-500'
                      }`}
                    >
                      <span className="ml-1">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* About Tab */}
                  {activeTab === 'about' && (
                    <div>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{developer.longBio || developer.bio}</p>
                      </div>
                      
                      {/* Tech Stack */}
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">💻 التقنيات</h3>
                        <div className="flex flex-wrap gap-2">
                          {developer.techStack.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Portfolio Tab */}
                  {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {developer.portfolio.map((project, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                          <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech.map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-lg">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <Link to={project.link} className="inline-block mt-3 text-indigo-600 text-sm hover:underline">
                              عرض المشروع →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects for Sale Tab */}
                  {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {developer.projectsForSale.map((project) => (
                        <div key={project.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                          <img src={project.image} alt={project.name} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">{project.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm">{project.rating}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm text-gray-500">{project.sales} عملية بيع</span>
                              </div>
                              <span className="text-xl font-bold text-indigo-600">${project.price}</span>
                            </div>
                            <Link to={`/marketplace/${project.id}`} className="block w-full text-center mt-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                              شراء المشروع
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {developer.reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <div className="font-semibold">{review.user}</div>
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm">{review.rating}</span>
                                <span className="text-gray-400 text-xs mx-2">|</span>
                                <span className="text-xs text-gray-400">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education Tab */}
                  {activeTab === 'education' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">🎓 المؤهلات العلمية</h3>
                        <div className="space-y-4">
                          {developer.education.map((edu, idx) => (
                            <div key={idx} className="border-r-4 border-indigo-500 pr-4">
                              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                              <p className="text-indigo-600 text-sm">{edu.institution}</p>
                              <p className="text-gray-500 text-sm">{edu.year}</p>
                              {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">📜 الشهادات المهنية</h3>
                        <div className="space-y-3">
                          {developer.certificates.map((cert, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <div>
                                <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                                <p className="text-sm text-gray-500">{cert.issuer}</p>
                              </div>
                              <div className="text-left">
                                <span className="text-xs text-gray-400">{cert.date}</span>
                                {cert.credentialId && <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}