import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

export default function Proposals() {

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockProposals = [
        {
          id: 1,
          projectId: 1,
          projectName: 'نظام إدارة المستشفيات الذكي',
          developer: 'أحمد المنصوري',
          developerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          amount: 4999,
          duration: '30 يوم',
          message: 'أنا متحمس للعمل على هذا المشروع. لدي خبرة واسعة في بناء أنظمة إدارة المستشفيات.',
          status: 'pending',
          submittedAt: '2024-02-01',
          rating: 4.9,
          completedProjects: 47
        },
        {
          id: 2,
          projectId: 1,
          projectName: 'نظام إدارة المستشفيات الذكي',
          developer: 'سارة القحطاني',
          developerAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          amount: 4500,
          duration: '35 يوم',
          message: 'أستطيع بناء نظام متكامل بإمكانيات عالية.',
          status: 'pending',
          submittedAt: '2024-01-30',
          rating: 4.8,
          completedProjects: 38
        }
      ];
      setProposals(mockProposals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAccept = (proposal) => {
    alert(`تم قبول عرض ${proposal.developer}`);
    setProposals(proposals.map(p => 
      p.id === proposal.id ? { ...p, status: 'accepted' } : p
    ));
  };

  const handleReject = (proposal) => {
    alert(`تم رفض عرض ${proposal.developer}`);
    setProposals(proposals.map(p => 
      p.id === proposal.id ? { ...p, status: 'rejected' } : p
    ));
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow flex">
        <ClientSidebar activePage="proposals" />

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                العروض المقدمة 📝
              </h1>
              <p className="text-gray-500 mt-1">مراجعة وقبول عروض المبرمجين لمشاريعك</p>
            </div>

            {proposals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">لا توجد عروض</h3>
                <p className="text-gray-500">لم يتم تقديم أي عروض على مشاريعك بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={proposal.developerAvatar} alt={proposal.developer} className="w-12 h-12 rounded-full" />
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{proposal.developer}</h3>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-yellow-500">★ {proposal.rating}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">{proposal.completedProjects} مشروع مكتمل</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">{proposal.message}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-indigo-600">${proposal.amount}</div>
                          <div className="text-sm text-gray-500">{proposal.duration}</div>
                          <div className="text-xs text-gray-400 mt-1">تم الإرسال: {proposal.submittedAt}</div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleAccept(proposal)}
                          className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
                        >
                          قبول العرض ✅
                        </button>
                        <button
                          onClick={() => handleReject(proposal)}
                          className="flex-1 py-2 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition"
                        >
                          رفض العرض ❌
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Details Modal */}
   
        {showDetailsModal && selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">تفاصيل العرض</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={selectedProposal.developerAvatar} alt={selectedProposal.developer} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold">{selectedProposal.developer}</div>
                    <div className="text-sm text-gray-500">⭐ {selectedProposal.rating} | {selectedProposal.completedProjects} مشروع</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500">رسالة المبرمج</div>
                  <p className="mt-1">{selectedProposal.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">المبلغ</div>
                    <div className="font-bold text-indigo-600">${selectedProposal.amount}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-sm text-gray-500">مدة التسليم</div>
                    <div className="font-semibold">{selectedProposal.duration}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    handleAccept(selectedProposal);
                    setShowDetailsModal(false);
                  }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
                >
                  قبول العرض
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
     

      <Footer />
    </div>
  );
}