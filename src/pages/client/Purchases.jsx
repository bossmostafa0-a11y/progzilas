import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';
import { getClientPurchases } from '../../services/cliecnt.service.js';

export default function Purchases() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        const response = await getClientPurchases();
        
        let data = response;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        
        const purchasesData = data?.data?.project || data?.project || data?.data || [];
        
        if (purchasesData.length > 0) {
          const mapped = purchasesData.map((order, index) => ({
            id: order._id || `purchase-${index}`,
            projectName: order.project?.projectName || 'مشروع',
            developer: order.developer?.username || 'مطور',
            developerAvatar: order.developer?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
            developerId: order.developer?._id || order.developer,
            projectId: order.project?._id || order.project,
            amount: order.amount || 0,
            package: order.package || order.type || 'Basic',
            purchaseDate: order.createdAt || '',
            status: order.status || 'pending',
            downloadUrl: order.project?.downloadurl || '',
            licenseKey: order.licenseKey || '',
            typewallet: order.typewallet || '',
            phone: order.phone || '',
            name: order.name || '',
            delivered: order.delivered || false
          }));
          setPurchases(mapped);
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err?.response?.data?.message || 'حدث خطأ في تحميل المشتريات');
      } finally {
        setLoading(false);
      }
    };
    
    loadPurchases();
  }, []);

  // ✅ دالة تحميل الملف - تفتح الرابط للتحميل المباشر
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      'paid': { label: 'تم الدفع', color: 'bg-green-100 text-green-700', icon: '✅' },
      'cancelled': { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: '❌' },
      'refunded': { label: 'مسترجع', color: 'bg-orange-100 text-orange-700', icon: '↩️' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: '📋' };
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل المشتريات...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <ClientSidebar activePage="purchases" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                مشترياتي 🛒
              </h1>
              <p className="text-gray-500 mt-1">إدارة المشاريع والمشتريات من المتجر</p>
            </div>

            {purchases.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مشتريات</h3>
                <p className="text-gray-500">لم تقم بشراء أي مشروع بعد</p>
                <Link to="/marketplace" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                  تصفح المتجر
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {purchases.map((purchase) => {
                  const statusInfo = getStatusInfo(purchase.status);
                  const isPaid = purchase.status === 'paid';
                  
                  return (
                    <motion.div 
                      key={purchase.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <img src={purchase.developerAvatar} alt={purchase.developer} className="w-12 h-12 rounded-full" onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg'; }} />
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{purchase.projectName}</h3>
                              <p className="text-sm text-gray-500">بواسطة {purchase.developer}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <span>📦 {purchase.package}</span>
                                <span>📅 {formatDate(purchase.purchaseDate)}</span>
                                {purchase.delivered && <span className="text-green-600">✅ تم التسليم</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-indigo-600">${purchase.amount?.toLocaleString() || 0}</div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        {(purchase.typewallet || purchase.phone || purchase.name) && (
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                            {purchase.typewallet && <span>💳 {purchase.typewallet}</span>}
                            {purchase.phone && <span>📱 {purchase.phone}</span>}
                            {purchase.name && <span>👤 {purchase.name}</span>}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {isPaid && purchase.licenseKey && (
                            <div className="bg-gray-50 rounded-xl p-3 mb-4">
                              <div className="text-xs text-gray-500 mb-1">مفتاح الترخيص</div>
                              <div className="font-mono text-sm">{purchase.licenseKey}</div>
                            </div>
                          )}

                          {isPaid && (
                            <div className="flex gap-3 flex-wrap">
                              {/* ✅ تحميل المشروع - يفتح في صفحة جديدة للتحميل */}
                              {purchase.downloadUrl && (
                                <button 
                                  onClick={() => handleDownload(purchase.downloadUrl, purchase.projectName)}
                                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-center min-w-[100px]"
                                >
                                  تحميل المشروع 📥
                                </button>
                              )}
                              
                              <Link 
                                to={`/rate/${purchase.projectId}`}
                                className="flex-1 py-2 border-2 border-yellow-500 text-yellow-600 rounded-xl font-medium hover:bg-yellow-50 transition text-center min-w-[100px]"
                              >
                                تقييم المشروع ⭐
                              </Link>
                              
                              <Link 
                                to={`/messages`}
                                className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition text-center min-w-[100px]"
                              >
                                طلب دعم فني 💬
                              </Link>
                            </div>
                          )}

                          {!isPaid && (
                            <div className="text-center py-3 text-gray-400 text-sm">
                              {purchase.status === 'pending' && '⏳ جاري مراجعة عملية الدفع - ستظهر الأزرار بعد التأكيد'}
                              {purchase.status === 'cancelled' && '❌ تم إلغاء الطلب'}
                              {purchase.status === 'refunded' && '↩️ تم استرداد المبلغ'}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}