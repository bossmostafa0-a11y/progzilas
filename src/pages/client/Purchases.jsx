import { useState, useEffect } from 'react';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ClientSidebar from '../../components/layout/ClientSidebar';

export default function Purchases() {
 
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const mockPurchases = [
        {
          id: 1,
          projectName: 'نظام إدارة المستشفيات الذكي',
          developer: 'أحمد المنصوري',
          developerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          amount: 499,
          package: 'Basic',
          purchaseDate: '2024-02-01',
          status: 'active',
          downloadUrl: '#',
          licenseKey: 'LIC-12345-67890'
        },
        {
          id: 2,
          projectName: 'متجر إلكتروني متكامل',
          developer: 'نورة خالد',
          developerAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
          amount: 399,
          package: 'Basic',
          purchaseDate: '2024-01-28',
          status: 'active',
          downloadUrl: '#',
          licenseKey: 'LIC-54321-09876'
        },
        {
          id: 3,
          projectName: 'نظام إدارة المطاعم',
          developer: 'سارة القحطاني',
          developerAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          amount: 449,
          package: 'Pro',
          purchaseDate: '2024-01-25',
          status: 'active',
          downloadUrl: '#',
          licenseKey: 'LIC-98765-43210'
        }
      ];
      setPurchases(mockPurchases);
      setLoading(false);
    }, 1000);
  }, []);

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

            <div className="grid grid-cols-1 gap-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <img src={purchase.developerAvatar} alt={purchase.developer} className="w-12 h-12 rounded-full" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{purchase.projectName}</h3>
                          <p className="text-sm text-gray-500">بواسطة {purchase.developer}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>📦 {purchase.package}</span>
                            <span>📅 {purchase.purchaseDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-indigo-600">${purchase.amount}</div>
                        <div className="text-xs text-green-600">✓ تم الشراء</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-xl p-3 mb-4">
                        <div className="text-xs text-gray-500 mb-1">مفتاح الترخيص</div>
                        <div className="font-mono text-sm">{purchase.licenseKey}</div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                          تحميل المشروع 📥
                        </button>
                        <button className="flex-1 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition">
                          طلب دعم فني 💬
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}