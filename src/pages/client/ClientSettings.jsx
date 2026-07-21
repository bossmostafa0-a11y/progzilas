import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';
import { 
  updateAccountSettings, 
  updateNotificationSettings, 
  changePassword, 
  deleteAccount 
} from '../../services/cliecnt.service.js';

export default function ClientSettings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Delete Loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    companyName: user?.companyName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    language: user?.language || 'ar',
    currency: user?.currency || 'USD'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    messages: user?.notificationSettings?.messages ?? true,
    projects: user?.notificationSettings?.projects ?? true,
    tasks: user?.notificationSettings?.tasks ?? true,
    payments: user?.notificationSettings?.payments ?? true,
    proposals: user?.notificationSettings?.proposals ?? true,
    milestones: user?.notificationSettings?.milestones ?? true,
    emailNotifications: user?.notificationSettings?.emailNotifications ?? true,
    pushNotifications: user?.notificationSettings?.pushNotifications ?? false
  });

  const handleAccountChange = (e) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationToggle = async (key) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key]
    };
    setNotificationSettings(newSettings);

    try {
      await updateNotificationSettings(newSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'فشل في تحديث الإشعارات');
      setNotificationSettings(notificationSettings);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await updateAccountSettings(accountSettings);
      
      const updatedUser = { ...user, ...accountSettings };
      if (setUser) setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'فشل في حفظ التغييرات');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    if (e) e.preventDefault();
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordError('جميع الحقول مطلوبة');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'فشل في تغيير كلمة المرور');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      await deleteAccount();
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (logout) logout();
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'فشل في حذف الحساب');
      setShowDeleteModal(false);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const languages = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' }
  ];

  // ✅ الدول العربية
  const countries = [
    { value: 'Egypt', label: '🇪🇬 مصر' },
    { value: 'Saudi Arabia', label: '🇸🇦 السعودية' },
    { value: 'UAE', label: '🇦🇪 الإمارات' },
    { value: 'Kuwait', label: '🇰🇼 الكويت' },
    { value: 'Qatar', label: '🇶🇦 قطر' },
    { value: 'Bahrain', label: '🇧🇭 البحرين' },
    { value: 'Oman', label: '🇴🇲 عمان' },
    { value: 'Jordan', label: '🇯🇴 الأردن' },
    { value: 'Lebanon', label: '🇱🇧 لبنان' },
    { value: 'Syria', label: '🇸🇾 سوريا' },
    { value: 'Iraq', label: '🇮🇶 العراق' },
    { value: 'Palestine', label: '🇵🇸 فلسطين' },
    { value: 'Yemen', label: '🇾🇪 اليمن' },
    { value: 'Sudan', label: '🇸🇩 السودان' },
    { value: 'Libya', label: '🇱🇾 ليبيا' },
    { value: 'Tunisia', label: '🇹🇳 تونس' },
    { value: 'Algeria', label: '🇩🇿 الجزائر' },
    { value: 'Morocco', label: '🇲🇦 المغرب' },
    { value: 'Mauritania', label: '🇲🇷 موريتانيا' },
    { value: 'Somalia', label: '🇸🇴 الصومال' },
    { value: 'Djibouti', label: '🇩🇯 جيبوتي' },
    { value: 'Comoros', label: '🇰🇲 جزر القمر' },
  ];

  // ✅ العملات - فقط جنيه ودولار
  const currencies = [
    { value: 'USD', label: 'دولار أمريكي ($)' },
    { value: 'EGP', label: 'جنيه مصري (E£)' },
  ];

  const tabs = [
    { id: 'account', label: 'الحساب', icon: '🏢' },
    { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <ClientSidebar activePage="settings" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  الإعدادات ⚙️
                </h1>
                <p className="text-gray-500 mt-1">إدارة إعدادات حسابك وتفضيلات شركتك</p>
              </div>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl flex items-center gap-2"
                >
                  <span>✅</span> تم حفظ التغييرات بنجاح
                </motion.div>
              )}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl flex items-center gap-2"
                >
                  <span>❌</span> {errorMessage}
                </motion.div>
              )}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                        : 'text-gray-500 hover:text-indigo-500'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم الشركة
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            value={accountSettings.companyName}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={accountSettings.email}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الهاتف
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={accountSettings.phone}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الدولة
                          </label>
                          <select
                            name="location"
                            value={accountSettings.location}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          >
                            {countries.map(country => (
                              <option key={country.value} value={country.value}>{country.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          الموقع الإلكتروني
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={accountSettings.website}
                          onChange={handleAccountChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اللغة
                          </label>
                          <select
                            name="language"
                            value={accountSettings.language}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          >
                            {languages.map(lang => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            العملة
                          </label>
                          <select
                            name="currency"
                            value={accountSettings.currency}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          >
                            {currencies.map(curr => (
                              <option key={curr.value} value={curr.value}>{curr.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => { setPasswordError(''); setShowPasswordModal(true); }}
                          className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition"
                        >
                          تغيير كلمة المرور 🔑
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'استلام الإشعارات عبر البريد الإلكتروني' },
                          { key: 'pushNotifications', label: 'الإشعارات الفورية', desc: 'استلام الإشعارات الفورية في المتصفح' },
                          { key: 'messages', label: 'الرسائل', desc: 'إشعارات الرسائل الجديدة' },
                          { key: 'projects', label: 'المشاريع', desc: 'تحديثات المشاريع' },
                          { key: 'tasks', label: 'المهام', desc: 'إشعارات المهام الجديدة' },
                          { key: 'payments', label: 'المدفوعات', desc: 'تأكيدات الدفع' },
                          { key: 'proposals', label: 'العروض', desc: 'عروض جديدة من المبرمجين' },
                          { key: 'milestones', label: 'المراحل', desc: 'إنجاز مراحل المشروع' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h3 className="font-semibold text-gray-800">{item.label}</h3>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleNotificationToggle(item.key)}
                              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                                notificationSettings[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                notificationSettings[item.key] ? 'left-7' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                {activeTab === 'account' && (
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-6 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                    >
                      حذف الحساب 🗑️
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري الحفظ...
                        </div>
                      ) : (
                        'حفظ التغييرات 💾'
                      )}
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); setPasswordError(''); setShowPasswordModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">تغيير كلمة المرور</h3>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{passwordError}</div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {passwordLoading ? 'جاري...' : 'تغيير'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-600">تحذير!</h3>
                <p className="text-gray-500 text-sm mt-2">
                  هل أنت متأكد من حذف حساب شركتك؟ هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleteLoading ? 'جاري...' : 'تأكيد الحذف'}
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