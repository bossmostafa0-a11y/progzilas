// src/pages/client/Proposals.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getClientProposals, acceptProposal, rejectProposal } from '../../services/cliecnt.service.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

// ✅ Toast Component - خارج المكون
const Toast = ({ message, type, onClose }) => {
  // ✅ استخدام useEffect في بداية المكون (ليس شرطياً)
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  
  if (!message) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white ${bgColor} animate-slide-in`}>
      {message}
    </div>
  );
};

// ✅ دوال مساعدة
const getStatusBadge = (status) => {
  const statusMap = {
    'pending': { color: 'bg-yellow-100 text-yellow-700', label: 'قيد المراجعة' },
    'accepted': { color: 'bg-green-100 text-green-700', label: 'تم القبول ✅' },
    'rejected': { color: 'bg-red-100 text-red-700', label: 'مرفوض ❌' }
  };
  return statusMap[status] || { color: 'bg-gray-100 text-gray-700', label: status };
};

export default function Proposals() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const hasFetched = useRef(false);

  // ✅ Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // ✅ جلب العروض من الباك اند
  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientProposals();
      
      const proposalsData = response?.data?.proposals || response?.proposals || response?.data || [];
      setProposals(proposalsData);
      
    } catch (err) {
      console.error('❌ Error fetching proposals:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل العروض');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ useEffect في بداية المكون (ليس شرطياً)
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProposals();
    }
  }, [fetchProposals]);

  // ✅ قبول العرض
  const handleAccept = async (proposal) => {
    setActionLoading(true);
    try {
      const response = await acceptProposal(proposal._id);
      
      showToast(`✅ تم قبول عرض ${proposal.developer?.username || 'المبرمج'}`, 'success');
      
      setProposals(prev => prev.map(p => 
        p._id === proposal._id ? { ...p, status: 'accepted' } : p
      ));
      setShowDetailsModal(false);
      
      if (response?.data?.chatId) {
        console.log('💬 Chat ID:', response.data.chatId);
      }
      
    } catch (error) {
      console.error('❌ Error accepting proposal:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء قبول العرض', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ رفض العرض
  const handleReject = async (proposal) => {
    setActionLoading(true);
    try {
      await rejectProposal(proposal._id);
      
      showToast(`❌ تم رفض عرض ${proposal.developer?.username || 'المبرمج'}`, 'info');
      
      setProposals(prev => prev.map(p => 
        p._id === proposal._id ? { ...p, status: 'rejected' } : p
      ));
      setShowDetailsModal(false);
      
    } catch (error) {
      console.error('❌ Error rejecting proposal:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء رفض العرض', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ إعادة المحاولة
  const handleRetry = () => {
    hasFetched.current = false;
    fetchProposals();
  };

  // ✅ تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ✅ الانتقال لصفحة بروفيل المبرمج
  const handleDeveloperProfile = (developerId) => {
    if (developerId) {
      navigate(`/dev/${developerId}`);
    }
  };

  // ✅ Early returns بعد كل الـ Hooks
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل العروض...</p>
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
        <div className="flex-grow flex">
          <ClientSidebar activePage="proposals" />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                إعادة المحاولة 🔄
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      {/* ✅ Toast */}
      <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />

      <div className="flex-grow flex">
        <ClientSidebar activePage="proposals" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                العروض المقدمة 📝
              </h1>
              <p className="text-gray-500 mt-1">مراجعة وقبول عروض المبرمجين لمشاريعك</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  {proposals.filter(p => p.status === 'pending').length} قيد المراجعة
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {proposals.filter(p => p.status === 'accepted').length} مقبول
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {proposals.filter(p => p.status === 'rejected').length} مرفوض
                </span>
              </div>
            </div>

            {proposals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد عروض</h3>
                <p className="text-gray-500">لم يتم تقديم أي عروض على مشاريعك بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => {
                  const statusBadge = getStatusBadge(proposal.status);
                  const developer = proposal.developer || {};
                  const isPending = proposal.status === 'pending';
                  
                  return (
                    <div key={proposal._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">W
                              {/* ✅ صورة البروفيل - قابلة للنقر */}
                              <button
                                onClick={() => handleDeveloperProfile(developer._id)}
                                className="focus:outline-none hover:ring-2 hover:ring-indigo-400 rounded-full transition-all"
                                title="عرض بروفيل المبرمج"
                              >
                                <img 
                                  src={developer.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                                  alt={developer.username || 'مبرمج'} 
                                  className="w-12 h-12 rounded-full object-cover hover:scale-105 transition-transform" 
                                />
                              </button>
                              <div>
                                <div className="flex items-center gap-2">
                                  {/* ✅ اسم المبرمج - قابل للنقر */}
                                  <button
                                    onClick={() => handleDeveloperProfile(developer._id)}
                                    className="text-lg font-bold text-gray-800 hover:text-indigo-600 hover:underline transition-colors focus:outline-none"
                                  >
                                    {developer.username || 'مبرمج'}
                                  </button>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                    {statusBadge.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-yellow-500">★ {developer.rating || proposal.rating || 0}</span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-gray-500">{developer.completedProjects || proposal.completedProjects || 0} مشروع مكتمل</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">المشروع: {proposal.project?.projectName || proposal.projectName || 'مشروع'}</p>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2 line-clamp-2">{proposal.coverLetter || proposal.message}</p>
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-indigo-600">${proposal.budget || proposal.amount || 0}</div>
                            <div className="text-sm text-gray-500">{proposal.duration || 'غير محدد'}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              تم الإرسال: {formatDate(proposal.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        {isPending ? (
                          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleAccept(proposal)}
                              disabled={actionLoading}
                              className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  جاري القبول...
                                </div>
                              ) : (
                                'قبول العرض ✅'
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(proposal)}
                              disabled={actionLoading}
                              className="flex-1 py-2 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                  جاري الرفض...
                                </div>
                              ) : (
                                'رفض العرض ❌'
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowDetailsModal(true);
                              }}
                              className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition"
                            >
                              تفاصيل أكثر
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowDetailsModal(true);
                              }}
                              className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition"
                            >
                              عرض التفاصيل
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">تفاصيل العرض</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {/* ✅ صورة البروفيل في المودال - قابلة للنقر */}
                  <button
                    onClick={() => handleDeveloperProfile(selectedProposal.developer?._id)}
                    className="focus:outline-none hover:ring-2 hover:ring-indigo-400 rounded-full transition-all"
                    title="عرض بروفيل المبرمج"
                  >
                    <img 
                      src={selectedProposal.developer?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                      alt={selectedProposal.developer?.username || 'مبرمج'} 
                      className="w-12 h-12 rounded-full object-cover hover:scale-105 transition-transform" 
                    />
                  </button>
                  <div>
                    {/* ✅ اسم المبرمج في المودال - قابل للنقر */}
                    <button
                      onClick={() => handleDeveloperProfile(selectedProposal.developer?._id)}
                      className="font-semibold hover:text-indigo-600 hover:underline transition-colors focus:outline-none"
                    >
                      {selectedProposal.developer?.username || 'مبرمج'}
                    </button>
                    <div className="text-sm text-gray-500">
                      ⭐ {selectedProposal.developer?.rating || selectedProposal.rating || 4.5} | {selectedProposal.developer?.completedProjects || selectedProposal.completedProjects || 0} مشروع
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedProposal.status).color}`}>
                      {getStatusBadge(selectedProposal.status).label}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500">المشروع</div>
                  <p className="font-semibold">{selectedProposal.project?.projectName || selectedProposal.projectName || 'مشروع'}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500">رسالة المبرمج</div>
                  <p className="mt-1">{selectedProposal.coverLetter || selectedProposal.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">المبلغ</div>
                    <div className="font-bold text-indigo-600">${selectedProposal.budget || selectedProposal.amount || 0}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">مدة التسليم</div>
                    <div className="font-semibold">{selectedProposal.duration || 'غير محدد'}</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500">تاريخ التقديم</div>
                  <div className="font-semibold">{formatDate(selectedProposal.createdAt)}</div>
                </div>
              </div>

              {selectedProposal.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleAccept(selectedProposal)}
                    disabled={actionLoading}
                    className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري القبول...
                      </div>
                    ) : (
                      'قبول العرض ✅'
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(selectedProposal)}
                    disabled={actionLoading}
                    className="flex-1 py-2 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        جاري الرفض...
                      </div>
                    ) : (
                      'رفض العرض ❌'
                    )}
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إغلاق
                  </button>
                </div>
              )}

              {selectedProposal.status !== 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}