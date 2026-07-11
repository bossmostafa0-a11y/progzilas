import 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout, isDeveloper, user } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Progzila</Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/developers" className="text-gray-700 hover:text-indigo-600">المبرمجين</Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-indigo-600">المتجر</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-indigo-600">كيف يعمل</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600">الأسعار</Link>
            <Link to="/privacy" className="text-gray-700 hover:text-indigo-600">سياسة الخصوصية</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={isDeveloper ? '/dashboard/developer' : '/dashboard/client'} className="text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-red-600 hover:text-red-700">تسجيل خروج</button>
                {/* ✅ صورة المستخدم أو الحرف الأول */}
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.username || 'User'} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center ${user?.profileImage ? 'hidden' : 'flex'}`}
                >
                  <span className="text-indigo-600 font-semibold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">تسجيل الدخول</Link>
                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">ابدأ مجاناً</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}