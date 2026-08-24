// src/components/layout/ClientSidebar.jsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function ClientSidebar({ activePage }) {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // يبدأ مقفول على الموبايل

  // ✅ استخراج بيانات المستخدم
  const userName = user?.name || user?.username || 'عميل';
  const userCompany = user?.companyName || user?.company || 'شركة';
  const userImage = user?.profileImage || user?.avatar || null;
  const firstLetter = userName.charAt(0);

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
    <>
      {/* ✅ زرار فتح/قفل الـ Sidebar (يظهر فقط على الموبايل) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-24 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            className="md:hidden fixed top-16 right-0 w-full bg-white shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto z-40"
          >
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
                <h3 className="font-bold text-gray-800">{userCompany}</h3>
                <p className="text-sm text-gray-500 mt-1">{userName}</p>
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
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ✅ الـ Sidebar الثابت (الظاهر دايماً على Desktop) */}
      <aside className="hidden md:block sticky top-16 w-72 bg-white shadow-lg min-h-screen overflow-y-auto">
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
            <h3 className="font-bold text-gray-800">{userCompany}</h3>
            <p className="text-sm text-gray-500 mt-1">{userName}</p>
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
    </>
  );
}