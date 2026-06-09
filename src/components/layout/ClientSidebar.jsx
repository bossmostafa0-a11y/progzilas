import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ClientSidebar({ activePage }) {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '📊', path: '/dashboard/client' },
    { id: 'projects', label: 'مشاريعي', icon: '📁', path: '/dashboard/client/projects' },
    { id: 'new-project', label: 'مشروع جديد', icon: '➕', path: '/dashboard/client/new-project' },
    { id: 'proposals', label: 'العروض', icon: '📝', path: '/dashboard/client/proposals' },
    { id: 'purchases', label: 'مشترياتي', icon: '🛒', path: '/dashboard/client/purchases' },
    { id: 'messages', label: 'الرسائل', icon: '💬', path: '/messages' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️', path: '/dashboard/client/settings' }
  ];

  return (
    <aside className="w-72 bg-white shadow-lg min-h-screen sticky top-16">
      <div className="p-6">
        {/* User Info */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
            ع
          </div>
          <h3 className="font-bold text-gray-800">شركة التقنية</h3>
          <p className="text-sm text-gray-500 mt-1">عميل مميز</p>
          <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
            نشط ✅
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
          <Link to="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-300">
              <span className="text-xl">🏠</span>
              <span className="font-medium">الرئيسية</span>
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