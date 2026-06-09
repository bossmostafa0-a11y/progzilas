import  { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      const userData = JSON.parse(savedUser)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(userData)
      setUserType(userData.userType)
    }
    setLoading(false)
  }, [])

  // Mock login - بدون API
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // أي إيميل وباسورد عشوائي شغالين للتجربة
        if (email && password && password.length >= 6) {
          // تحديد نوع المستخدم بناءً على الإيميل
          let userTypeDetermined = 'developer'
          if (email.includes('client') || email.includes('company')) {
            userTypeDetermined = 'client'
          }
          
          const mockUser = {
            id: Math.floor(Math.random() * 1000),
            name: userTypeDetermined === 'developer' ? 'أحمد محمد' : 'شركة التقنية',
            email: email,
            userType: userTypeDetermined,
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            createdAt: new Date().toISOString()
          }
          
          localStorage.setItem('token', 'mock-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(mockUser))
          setUser(mockUser)
          setUserType(mockUser.userType)
          resolve(mockUser)
        } else {
          reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة'))
        }
      }, 500)
    })
  }

  // Mock register - بدون API
  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.email || !userData.password) {
          reject(new Error('البريد الإلكتروني وكلمة المرور مطلوبين'))
          return
        }
        
        if (userData.password.length < 6) {
          reject(new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'))
          return
        }
        
        if (userData.userType === 'developer' && !userData.track) {
          reject(new Error('يرجى اختيار التخصص'))
          return
        }
        
        const mockUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          userType: userData.userType,
          ...(userData.userType === 'developer' && {
            track: userData.track,
            experience: userData.experience,
            title: '',
            bio: '',
            hourlyRate: '',
            techStack: [],
            completedProjects: 0,
            rating: 0
          }),
          ...(userData.userType === 'client' && {
            companyName: userData.companyName,
            companySize: '',
            industry: '',
            projectsCount: 0
          }),
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: new Date().toISOString()
        }
        
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify(mockUser))
        setUser(mockUser)
        setUserType(mockUser.userType)
        resolve(mockUser)
      }, 500)
    })
  }

  // Update profile - بدون API
  const updateProfile = async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...profileData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        resolve(updatedUser)
      }, 500)
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setUserType(null)
  }

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isDeveloper: userType === 'developer',
    isClient: userType === 'client',
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}