import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getDeveloperProfile } from '../../services/develper.service.js';

export default function DevProfile() {
  const { id, username } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  const devIdentifier = id || username;

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
          // ✅ استخدام القيم من data مباشرة
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
          portfolio: (userData.portfolio || []).map(item => ({
            id: item._id || item.id,
            title: item.projectName || item.title || '',
            description: item.description || '',
            image: item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            link: `/marketplace/${item._id || item.id}`,
            tech: item.technologies || []
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
          reviews: (userData.reviews || []).map(review => ({
            user: review.user?.username || review.username || '',
            rating: review.rating || 5,
            comment: review.comment || '',
            date: review.date || review.createdAt || '',
            avatar: review.user?.profileImage || review.avatar || 'https://randomuser.me/api/portraits/men/45.jpg'
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
                      <a href={`https://github.com/${developer.social.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">🐙</div>
                        <span className="text-gray-700">GitHub</span>
                      </a>
                    )}
                    {developer.social.linkedin && (
                      <a href={`https://linkedin.com/in/${developer.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">in</div>
                        <span className="text-gray-700">LinkedIn</span>
                      </a>
                    )}
                    {developer.social.twitter && (
                      <a href={`https://twitter.com/${developer.social.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
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
                            <Link to={`/marketplace/${project.id}`} className="block w-full text-center mt-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                              شراء المشروع
                            </Link>
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
                        <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                          <img src={project.image} alt={project.title} className="w-full h-40 object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'; }} />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech.map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-lg">{tech}</span>
                              ))}
                            </div>
                            <Link to={project.link} className="inline-block mt-3 text-indigo-600 text-sm hover:underline">
                              عرض المشروع →
                            </Link>
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
                            <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/45.jpg'; }} />
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

      <Footer />
    </div>
  );
}