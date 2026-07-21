import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';
import { getClientPurchases, submitReview , createSupportChat } from '../../services/cliecnt.service.js';

export default function Purchases() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [supportLoading, setSupportLoading] = useState(false);
  
  // ✅ Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingProject, setRatingProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingError, setRatingError] = useState('');

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

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ طلب دعم فني - إنشاء شات والتحويل لصفحة الدعم
  // في Purchases.jsx - تعديل دالة handleSupportRequest

const handleSupportRequest = async (projectId) => {
  setSupportLoading(true);
  try {
    // ✅ إنشاء الشات
    await createSupportChat(projectId);
    // ✅ التحويل لصفحة الدعم مع projectId
    navigate(`/Support/${projectId}`);
  } catch (err) {
    console.error('❌ Support error:', err);
    // ✅ لو الشات موجود بالفعل، نحول برضو مع projectId
    if (err?.response?.data?.message?.includes('يوجد شات')) {
      navigate(`/Support/${projectId}`);
    } else {
      alert(err?.response?.data?.message || 'فشل في إنشاء طلب الدعم الفني');
    }
  } finally {
    setSupportLoading(false);
  }
};

  const handleOpenRating = (purchase) => {
    setRatingProject(purchase);
    setRating(0);
    setHoverRating(0);
    setReviewComment('');
    setRatingError('');
    setRatingSuccess(false);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setRatingError('يرجى اختيار التقييم');
      return;
    }

    setRatingLoading(true);
    setRatingError('');

    try {
      await submitReview({
        projectId: ratingProject.projectId,
        rating: rating,
        comment: reviewComment
      });

      setRatingSuccess(true);
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingProject(null);
      }, 2000);
    } catch (err) {
      setRatingError(err?.response?.data?.message || 'فشل في إرسال التقييم');
    } finally {
      setRatingLoading(false);
    }
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
                              {purchase.downloadUrl && (
                                <button 
                                  onClick={() => handleDownload(purchase.downloadUrl)}
                                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-center min-w-[100px]"
                                >
                                  تحميل المشروع 📥
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleOpenRating(purchase)}
                                className="flex-1 py-2 border-2 border-yellow-500 text-yellow-600 rounded-xl font-medium hover:bg-yellow-50 transition text-center min-w-[100px]"
                              >
                                تقييم المشروع ⭐
                              </button>
                              
                              {/* ✅ طلب دعم فني - ينشئ شات ويحول للدعم */}
                              <button 
                                onClick={() => handleSupportRequest(purchase.projectId)}
                                disabled={supportLoading}
                                className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition text-center min-w-[100px] disabled:opacity-50"
                              >
                                {supportLoading ? '⏳ جاري...' : 'طلب دعم فني 💬'}
                              </button>
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

      {/* ✅ Rating Modal */}
      <AnimatePresence>
        {showRatingModal && ratingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRatingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {ratingSuccess ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">تم إرسال تقييمك بنجاح!</h3>
                  <p className="text-gray-500">شكراً لك على مشاركة رأيك</p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="text-xl font-bold text-gray-800">تقييم المشروع</h3>
                    <p className="text-sm text-gray-500 mt-1">{ratingProject.projectName}</p>
                  </div>

                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`text-4xl transition-all duration-200 ${
                          (hoverRating || rating) >= star
                            ? 'text-yellow-400 drop-shadow-lg'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mb-4">
                    {rating === 0 ? 'اضغط على النجوم للتقييم' : rating === 5 ? 'ممتاز! 😍' : rating === 4 ? 'جيد جداً 👍' : rating === 3 ? 'جيد 🙂' : rating === 2 ? 'مقبول 😐' : 'ضعيف 😞'}
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">تعليقك (اختياري)</label>
                    <textarea
                      rows="3"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                      placeholder="اكتب تعليقك عن المشروع..."
                    />
                  </div>

                  {ratingError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm mb-4 text-center">{ratingError}</div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSubmitRating}
                      disabled={ratingLoading || rating === 0}
                      className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
                    >
                      {ratingLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري...
                        </div>
                      ) : (
                        'إرسال التقييم ⭐'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}