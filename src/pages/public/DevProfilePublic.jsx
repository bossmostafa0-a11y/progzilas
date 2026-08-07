import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getDeveloperProfile } from '../../services/develper.service.js';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
export default function DevProfile() {
    const navigate = useNavigate();
  const { id, username } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const devIdentifier = id || username;

  // ✅ منع التمرير عند فتح البوب
  useEffect(() => {
    if (showProjectModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showProjectModal]);

  useEffect(() => {
    
    const loadDeveloperProfile = async () => {
      if (!devIdentifier) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getDeveloperProfile(devIdentifier);
        
        let data = response;
        if (typeof data === 'string') data = JSON.parse(data);
        // ✅ دالة التعامل مع الضغط على تفاصيل المشروع

        const userData = data?.data?.userdata;
        const projects = data?.data?.projects || [];
        
        if (!userData?._id) {
          setDeveloper(null);
          setLoading(false);
          return;
        }
        
        setDeveloper({
          id: userData._id,
          name: userData.username || 'غير معروف',
          username: userData.username || '',
          title: userData.title || userData.track || 'مطور',
          bio: userData.bio || '',
          avatar: userData.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
          coverImage: userData.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
          rating: userData.rating || 0,
          totalProjects: data?.data?.countallproject || 0,
          completedProjects: data?.data?.completproject || 0,
          ongoingProjects: data?.data?.crunetprojects || 0,
          salesCount: userData.salesCount || 0,
          hourlyRate: userData.hourlyRate || 0,
          experience: userData.experience || '1-3',
          location: userData.country || 'مصر',
          languages: userData.languages?.length ? userData.languages : ['العربية'],
          memberSince: userData.createdAt || new Date().toISOString(),
          techStack: userData.techStack || [],
          skills: userData.skills || [],
          isTeam: userData.isTeam === true || userData.isTeam === 'true' || false, // ✅ علامة الفريق
          portfolio: (data?.data?.previousprojectss || []).map(item => ({
            id: item._id || item.id,
            title: item.projectName || item.name || 'مشروع بدون اسم',
            description: item.shortDescription || item.fullDescription || '',
            fullDescription: item.fullDescription || item.shortDescription || '',
            image: item.images?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            images: item.images || [],
            videoUrl: item.videoUrl || '',
            demoUrl: item.demoUrl || '',
            githubUrl: item.githubUrl || '',
            tech: item.technologies || [],
            mainFeatures: item.mainFeatures || [],
            category: item.category || 'web',
            createdAt: item.createdAt || '',
            link: `/portfolio/${item._id}`,
          })),
          projectsForSale: projects.map(project => ({
            id: project._id,
            name: project.projectName || '',
            description: project.shortDescription || '',
            price: project.basic?.price || 0,
            sales: project.sales || 0,
            rating: project.rating || 0,
            image: project.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
            tech: project.technologies || []
          })),
          social: {
            github: userData.github || '',
            linkedin: userData.linkedin || '',
            twitter: userData.twitter || '',
            website: userData.website || ''
          },
          education: (userData.education || []).map(edu => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            year: edu.year || '',
            description: edu.description || ''
          })),
          certificates: (userData.certificates || []).map(cert => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            credentialId: cert.credentialId || ''
          })),
          reviews: (data?.data?.projectreviwess || []).map(review => ({
            user: review.client?.username || 'مستخدم',
            username: review.client?.username || 'مستخدم',
            rating: review.rating || 5,
            comment: review.comment || '',
            date: review.createdAt || review.date || '',
            avatar: review.client?.profileImage || 'https://randomuser.me/api/portraits/men/45.jpg'
          }))
        });
      } catch (error) {
        console.error('❌ Error:', error);
        setDeveloper(null);
      } finally {
        setLoading(false);
      }
    };

    loadDeveloperProfile();
  }, [devIdentifier]);
const handleProjectClick = (projectId) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    navigate(`/login`);
  } else {
    navigate(`/marketplaceitem/${projectId}`);
  }
};
  const getExperienceLabel = (exp) => {
    const levels = {
      '0-1': 'مبتدئ (0-1 سنة)',
      '1-3': 'متوسط (1-3 سنوات)',
      '3-5': 'محترف (3-5 سنوات)',
      '5-8': 'خبير (5-8 سنوات)',
      '8+': 'أسطورة (8+ سنوات)'
    };
    return levels[exp] || exp;
  };

  // ✅ دالة فتح البوب
  const openProjectModal = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  // ✅ دالة إغلاق البوب
  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
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
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Profile Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img 
                  src={developer.avatar} 
                  alt={developer.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg'; }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                متاح للعمل
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2 justify-center md:justify-start">
                {developer.name}
                {/* ✅ علامة الفريق الزرقاء */}
                {developer.isTeam === true && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    فريق
                  </span>
                )}
              </h1>
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
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
             

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

              {(developer.social.github || developer.social.linkedin || developer.social.twitter || developer.social.website) && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">🔗 روابط التواصل</h3>
                  <div className="space-y-3">
                    {developer.social.github && (
                      <a href={`${developer.social.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">🐙</div>
                        <span className="text-gray-700">GitHub</span>
                      </a>
                    )}
                    {developer.social.linkedin && (
                      <a href={`${developer.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">in</div>
                        <span className="text-gray-700">LinkedIn</span>
                      </a>
                    )}
                    {developer.social.twitter && (
                      <a href={`${developer.social.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white">𝕏</div>
                        <span className="text-gray-700">Twitter</span>
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
              )}

              {developer.skills.length > 0 && (
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
              )}

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

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: 'about', label: 'نبذة عني', icon: '👤' },
                    { id: 'projects', label: 'مشاريع للبيع', icon: '🛒' },
                    { id: 'portfolio', label: 'أعمالي', icon: '📁' },
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
                  {activeTab === 'about' && (
                    <div>
                      <p className="text-gray-600 leading-relaxed text-lg">{developer.bio || 'لا يوجد وصف'}</p>
                      {developer.techStack.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-800 mb-3">💻 التقنيات</h3>
                          <div className="flex flex-wrap gap-2">
                            {developer.techStack.map((tech, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {developer.projectsForSale.length > 0 ? developer.projectsForSale.map((project) => (
                        <div key={project.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                          <img src={project.image} alt={project.name} className="w-full h-40 object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'; }} />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">{project.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech?.slice(0, 3).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-lg">{tech}</span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xl font-bold text-indigo-600">${project.price}</span>
                            </div>
                           <button
  onClick={() => handleProjectClick(project.id)}
  className="block w-full text-center mt-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
>
  عرض المشروع
</button>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-8 text-gray-400">
                          <p className="text-3xl mb-2">🛒</p>
                          <p>لا توجد مشاريع للبيع حالياً</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {developer.portfolio.length > 0 ? developer.portfolio.map((project, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition group">
                          <div className="relative">
                            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'; }} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => openProjectModal(project)}
                                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition"
                              >
                                عرض التفاصيل
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech.slice(0, 3).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-lg">{tech}</span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-lg">+{project.tech.length - 3}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => openProjectModal(project)}
                              className="mt-3 text-indigo-600 text-sm hover:underline font-medium"
                            >
                              عرض التفاصيل كاملة ←
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-8 text-gray-400">
                          <p className="text-3xl mb-2">📁</p>
                          <p>لا توجد أعمال حالياً</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {developer.reviews.length > 0 ? developer.reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <img 
                              src={review.avatar} 
                              alt={review.user} 
                              className="w-10 h-10 rounded-full object-cover" 
                              onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/45.jpg'; }} 
                            />
                            <div>
                              <div className="font-semibold">{review.user}</div>
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm">{review.rating}</span>
                                <span className="text-gray-400 text-xs mx-2">|</span>
                                <span className="text-xs text-gray-400">
                                  {review.date ? new Date(review.date).toLocaleDateString('ar-EG') : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-3xl mb-2">💬</p>
                          <p>لا توجد تقييمات بعد</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <div className="space-y-6">
                      {developer.education.length > 0 && (
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
                      )}

                      {developer.certificates.length > 0 && (
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
                      )}

                      {developer.education.length === 0 && developer.certificates.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-3xl mb-2">🎓</p>
                          <p>لا توجد مؤهلات مضافة بعد</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Project Details Modal */}
      <AnimatePresence>
        {showProjectModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{selectedProject.title}</h2>
                <button
                  onClick={closeProjectModal}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Images Gallery */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">🖼️ معرض الصور</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedProject.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`${selectedProject.title} - ${idx + 1}`} 
                          className="w-full h-32 sm:h-40 object-cover rounded-xl hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Video */}
                {selectedProject.videoUrl && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">🎬 فيديو توضيحي</h3>
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        src={selectedProject.videoUrl}
                        controls
                        className="w-full max-h-[400px] object-contain"
                      >
                        متصفحك لا يدعم تشغيل الفيديو
                      </video>
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedProject.category && (
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-sm text-gray-500">التصنيف</div>
                      <div className="text-lg font-semibold text-indigo-600">
                        {selectedProject.category}
                      </div>
                    </div>
                  )}
                  {selectedProject.createdAt && (
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-sm text-gray-500">تاريخ الإضافة</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {new Date(selectedProject.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">التقنيات المستخدمة</div>
                    <div className="text-lg font-semibold text-purple-600">
                      {selectedProject.tech.length} تقنية
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📝 الوصف الكامل</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.fullDescription || selectedProject.description || 'لا يوجد وصف'}
                  </p>
                </div>

                {/* Main Features */}
                {selectedProject.mainFeatures && selectedProject.mainFeatures.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">✨ المميزات الرئيسية</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.mainFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {selectedProject.tech && selectedProject.tech.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">💻 التقنيات المستخدمة</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      عرض تجريبي
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
                    >
                      <FiGithub className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={closeProjectModal}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}