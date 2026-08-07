import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function DeveloperSidebar({ activePage }) {
  const location = useLocation();
  const { user } = useAuth(); // ✅ استخدم الـ Context عشان تجيب بيانات المستخدم

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '📊', path: '/dashboard/developer' },
    { id: 'projects', label: 'مشاريعي', icon: '📁', path: '/dashboard/developer/projects' },
    { id: 'proposals', label: 'عروضي', icon: '📝', path: '/dashboard/developer/proposals' },
    { id: 'store', label: 'متجري', icon: '🛒', path: '/dashboard/developer/store' },
    { id: 'earnings', label: 'أرباحي', icon: '💰', path: '/dashboard/developer/earnings' },
    { id: 'profile', label: 'بروفايلي', icon: '👤', path: '/dashboard/developer/profile' },
    { id: 'add-project', label: 'إضافة مشروع', icon: '➕', path: '/dashboard/developer/add-project' },
        { id: 'PreviousProjects', label: 'الأعمال السابقة', icon: '💼', path: '/dashboard/developer/PreviousProjects' },

    { id: 'settings', label: 'الإعدادات', icon: '⚙️', path: '/dashboard/developer/settings' }
  ];

  // ✅ استخراج بيانات المستخدم
  const userName = user?.name || user?.username || 'مطور';
  const userTitle = user?.title || user?.headline || 'مطور برمجيات';
  const userImage = user?.profileImage || user?.avatar || null;

  // ✅ الحرف الأول من الاسم
  const firstLetter = userName.charAt(0);

  return (
    <aside className="w-72 bg-white shadow-lg min-h-screen sticky top-16">
      <div className="p-6">
        {/* User Info */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500">
            {userImage ? (
              <img 
                src={userImage} 
                alt={userName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{firstLetter}</span>
            )}
          </div>
          <h3 className="font-bold text-gray-800">{userName}</h3>
          <p className="text-sm text-gray-500 mt-1">{userTitle}</p>
          <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
            متاح للعمل ✅
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || activePage === item.id;
            return (
              <Link key={item.id} to={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="mr-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Menu */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link to="/ReportProblem">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-300">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">إبلاغ عن مشكلة </span>
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
}