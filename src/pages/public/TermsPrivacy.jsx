import  'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function TermsPrivacy() {
  

  const privacyContent = {
    sections: [
      {
        title: '1. المعلومات التي نجمعها',
        content: [
          'معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف، صورة الملف الشخصي.',
          'معلومات المشاريع: المشاريع التي تبيعها أو تشتريها، التقييمات، المراجعات.',
          'معلومات الدفع: تفاصيل الدفع (لا نخزن معلومات البطاقة الائتمانية الكاملة).',
          'معلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل، سجل النشاطات.'
        ]
      },
      {
        title: '2. كيف نستخدم معلوماتك',
        content: [
          'لتقديم وتحسين خدمات المنصة.',
          'للتواصل معك بشأن حساباتك ومشاريعك.',
          'لإرسال الإشعارات والتحديثات الهامة.',
          'لتحليل أداء المنصة وتحسين تجربة المستخدم.'
        ]
      },
      {
        title: '3. مشاركة المعلومات',
        content: [
          'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.',
          'قد نشارك معلوماتك مع المبرمجين والعملاء لتسهيل التعاملات.',
          'قد نكشف عن معلوماتك إذا طلب القانون ذلك.',
          'معلومات المشاريع والمهارات تظهر علناً في بروفايلك.'
        ]
      },
      {
        title: '4. حماية المعلومات',
        content: [
          'نستخدم تشفير SSL لحماية بياناتك أثناء النقل.',
          'نخزن معلوماتك على خوادم آمنة مع إجراءات حماية متقدمة.',
          'نقوم بمراجعة إجراءات الأمان بانتظام.'
        ]
      },
      {
        title: '5. ملفات تعريف الارتباط (Cookies)',
        content: [
          'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة.',
          'يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح.',
          'بعض ميزات المنصة قد لا تعمل بشكل صحيح إذا عطلت ملفات تعريف الارتباط.'
        ]
      },
      {
        title: '6. حقوقك',
        content: [
          'يمكنك الوصول إلى معلوماتك الشخصية وتحديثها في أي وقت.',
          'يمكنك طلب حذف حسابك وبياناتك.',
          'يمكنك إلغاء الاشتراك في الرسائل التسويقية.'
        ]
      },
      {
        title: '7. التغييرات على سياسة الخصوصية',
        content: [
          'قد نقوم بتحديث سياسة الخصوصية من وقت لآخر.',
          'سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني.',
          'استمرارك في استخدام المنصة يعني موافقتك على التغييرات.'
        ]
      }
    ],
    lastUpdated: '2024-01-01'
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              سياسة <span className="text-yellow-400">الخصوصية</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              نحن نحمي خصوصية بياناتك ونحرص على أمان معلوماتك
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Intro */}
              <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  في DevHire، نحن نأخذ خصوصيتك على محمل الجد. تصف هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  آخر تحديث: {privacyContent.lastUpdated}
                </p>
              </div>

              {/* Sections */}
              <div className="p-8">
                {privacyContent.sections.map((section, idx) => (
                  <div key={idx} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                        {idx + 1}
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                    </div>
                    <div className="space-y-2 pr-4">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-indigo-500 text-lg mt-0.5">•</span>
                          <p className="text-gray-600 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">📧 لديك استفسارات؟</h3>
                <p className="text-gray-600 mb-4">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا على:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-indigo-600">✉️</span>
                    <span className="text-gray-700">privacy@devhire.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-indigo-600">📞</span>
                    <span className="text-gray-700">+20 123 456 789</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}