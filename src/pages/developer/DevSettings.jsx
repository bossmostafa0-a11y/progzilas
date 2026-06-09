import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeveloperSidebar from '../../components/layout/DeveloperSidebar';

export default function DevSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || 'ahmed@devhire.com',
    phone: '+20123456789',
    language: 'ar',
    timezone: 'Africa/Cairo',
    currency: 'USD',
    dateFormat: 'dd/mm/yyyy'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    newMessages: true,
    newSales: true,
    newReviews: true,
    paymentReceived: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: true,
    showLocation: true,
    showSocialLinks: true,
    profileVisibility: 'public',
    allowMessages: 'everyone'
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    deviceManagement: true,
    sessionTimeout: '30'
  });

  // Billing Settings
  const [billingSettings, setBillingSettings] = useState({
    defaultPaymentMethod: 'bank',
    bankName: 'البنك الأهلي المصري',
    accountNumber: '123456789',
    accountName: 'أحمد محمد المنصوري',
    taxNumber: '123456789',
    invoiceEmail: 'invoices@ahmed.com'
  });

  const handleAccountChange = (e) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  const handlePrivacyChange = (e) => {
    setPrivacySettings({
      ...privacySettings,
      [e.target.name]: e.target.value
    });
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key]
    });
  };

  const handleSecurityToggle = (key) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: !securitySettings[key]
    });
  };

  const handleSecurityChange = (e) => {
    setSecuritySettings({
      ...securitySettings,
      [e.target.name]: e.target.value
    });
  };

  const handleBillingChange = (e) => {
    setBillingSettings({
      ...billingSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('تم تغيير كلمة المرور بنجاح');
    setShowPasswordModal(false);
  };

  const handleDeleteAccount = () => {
    alert('تم حذف الحساب بنجاح');
    setShowDeleteModal(false);
  };

  const languages = [
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  const timezones = [
    { value: 'Africa/Cairo', label: 'القاهرة (+2)' },
    { value: 'Asia/Dubai', label: 'دبي (+4)' },
    { value: 'Europe/London', label: 'لندن (+0)' },
    { value: 'America/New_York', label: 'نيويورك (-5)' }
  ];

  const currencies = [
    { value: 'USD', label: 'دولار أمريكي ($)', symbol: '$' },
    { value: 'EUR', label: 'يورو (€)', symbol: '€' },
    { value: 'GBP', label: 'جنيه إسترليني (£)', symbol: '£' },
    { value: 'EGP', label: 'جنيه مصري (E£)', symbol: 'E£' }
  ];

  const profileVisibility = [
    { value: 'public', label: 'عام - يظهر للجميع' },
    { value: 'private', label: 'خاص - يظهر فقط للمسجلين' },
    { value: 'hidden', label: 'مخفي - لا يظهر في البحث' }
  ];

  const messagePrivacy = [
    { value: 'everyone', label: 'الجميع' },
    { value: 'clients', label: 'العملاء فقط' },
    { value: 'none', label: 'لا أحد' }
  ];

 

  const tabs = [
    { id: 'account', label: 'الحساب', icon: '👤' },
    { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
    { id: 'privacy', label: 'الخصوصية', icon: '🔒' },
    { id: 'security', label: 'الأمان', icon: '🛡️' },
    { id: 'billing', label: 'الفواتير', icon: '💳' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <DeveloperSidebar activePage="settings" />

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
                <p className="text-gray-500 mt-1">إدارة إعدادات حسابك وتفضيلاتك الشخصية</p>
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
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
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
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={accountSettings.email}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                          <p className="text-xs text-gray-400 mt-1">سيتم إرسال الإشعارات إلى هذا البريد</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الهاتف
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={accountSettings.phone}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
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
                              <option key={lang.value} value={lang.value}>
                                {lang.flag} {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            المنطقة الزمنية
                          </label>
                          <select
                            name="timezone"
                            value={accountSettings.timezone}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          >
                            {timezones.map(tz => (
                              <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <option key={curr.value} value={curr.value}>
                                {curr.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            تنسيق التاريخ
                          </label>
                          <select
                            name="dateFormat"
                            value={accountSettings.dateFormat}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                            <option value="yyyy/mm/dd">YYYY/MM/DD</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-semibold text-gray-800">إشعارات البريد الإلكتروني</h3>
                            <p className="text-xs text-gray-500">استلام الإشعارات عبر البريد الإلكتروني</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleNotificationToggle('emailNotifications')}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                              notificationSettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                              notificationSettings.emailNotifications ? 'left-7' : 'left-1'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-semibold text-gray-800">إشعارات التطبيق</h3>
                            <p className="text-xs text-gray-500">إشعارات فورية داخل التطبيق</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleNotificationToggle('pushNotifications')}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                              notificationSettings.pushNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                              notificationSettings.pushNotifications ? 'left-7' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-3">نوع الإشعارات</h3>
                        {[
                          { key: 'projectUpdates', label: 'تحديثات المشاريع', desc: 'عند تحديث حالة المشروع' },
                          { key: 'newMessages', label: 'الرسائل الجديدة', desc: 'عند استلام رسالة جديدة' },
                          { key: 'newSales', label: 'مبيعات جديدة', desc: 'عند شراء أحد منتجاتك' },
                          { key: 'newReviews', label: 'تقييمات جديدة', desc: 'عند إضافة تقييم جديد' },
                          { key: 'paymentReceived', label: 'المدفوعات', desc: 'عند استلام دفعة جديدة' },
                          { key: 'marketingEmails', label: 'رسائل تسويقية', desc: 'عروض وخدمات جديدة' },
                          { key: 'weeklyDigest', label: 'ملخص أسبوعي', desc: 'ملخص نشاطك الأسبوعي' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.label}</h4>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleNotificationToggle(item.key)}
                              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                                notificationSettings[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                notificationSettings[item.key] ? 'left-5' : 'left-0.5'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Privacy Tab */}
                  {activeTab === 'privacy' && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ظهور البروفايل
                        </label>
                        <select
                          name="profileVisibility"
                          value={privacySettings.profileVisibility}
                          onChange={handlePrivacyChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          {profileVisibility.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          من يمكنه مراسلتك
                        </label>
                        <select
                          name="allowMessages"
                          value={privacySettings.allowMessages}
                          onChange={handlePrivacyChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          {messagePrivacy.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-3">إظهار المعلومات الشخصية</h3>
                        {[
                          { key: 'showEmail', label: 'البريد الإلكتروني' },
                          { key: 'showPhone', label: 'رقم الهاتف' },
                          { key: 'showLocation', label: 'الموقع' },
                          { key: 'showSocialLinks', label: 'روابط التواصل الاجتماعي' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-800">{item.label}</span>
                            <button
                              type="button"
                              onClick={() => handlePrivacyToggle(item.key)}
                              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                                privacySettings[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                privacySettings[item.key] ? 'left-5' : 'left-0.5'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        {[
                          { key: 'twoFactorAuth', label: 'المصادقة الثنائية (2FA)', desc: 'طبقة أمان إضافية عند تسجيل الدخول' },
                          { key: 'loginAlerts', label: 'تنبيهات تسجيل الدخول', desc: 'إشعار عند تسجيل الدخول من جهاز جديد' },
                          { key: 'deviceManagement', label: 'إدارة الأجهزة', desc: 'التحكم في الأجهزة المتصلة بحسابك' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h3 className="font-semibold text-gray-800">{item.label}</h3>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSecurityToggle(item.key)}
                              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                                securitySettings[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                                securitySettings[item.key] ? 'left-7' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          مهلة انتهاء الجلسة (دقيقة)
                        </label>
                        <select
                          name="sessionTimeout"
                          value={securitySettings.sessionTimeout}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="15">15 دقيقة</option>
                          <option value="30">30 دقيقة</option>
                          <option value="60">ساعة واحدة</option>
                          <option value="120">ساعتين</option>
                          <option value="240">4 ساعات</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          عرض الأجهزة المتصلة ›
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Billing Tab */}
                  {activeTab === 'billing' && (
                    <motion.div
                      key="billing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          طريقة الدفع الافتراضية
                        </label>
                        <select
                          name="defaultPaymentMethod"
                          value={billingSettings.defaultPaymentMethod}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="bank">تحويل بنكي</option>
                          <option value="vodafone">فودافون كاش</option>
                          <option value="binance">Binance Pay</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            اسم البنك
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={billingSettings.bankName}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الحساب
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={billingSettings.accountNumber}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          اسم صاحب الحساب
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={billingSettings.accountName}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الرقم الضريبي
                          </label>
                          <input
                            type="text"
                            name="taxNumber"
                            value={billingSettings.taxNumber}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            بريد الفواتير
                          </label>
                          <input
                            type="email"
                            name="invoiceEmail"
                            value={billingSettings.invoiceEmail}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
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
            onClick={() => setShowPasswordModal(false)}
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
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  تغيير
                </button>
              </div>
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
                  هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بياناتك نهائياً.
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
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                >
                  تأكيد الحذف
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