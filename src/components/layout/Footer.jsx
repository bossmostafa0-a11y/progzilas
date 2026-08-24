import   'react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Progzila</h3>
            <p className="text-gray-400">أول منصة عربية متخصصة في توظيف المبرمجين</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/developers" className="hover:text-white">المبرمجين</a></li>
              <li><a href="/marketplace" className="hover:text-white">المتجر</a></li>
              <li><a href="/Projects" className="hover:text-white">الاعمال</a></li>
              <li><a href="/pricing" className="hover:text-white">الأسعار</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/how-it-works" className="hover:text-white">كيف يعمل</a></li>
              <li><a href="#" className="hover:text-white">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-white">الأسئلة الشائعة</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">تابعنا</h4>
            <div className="flex space-x-4 space-x-reverse">
              <span className="text-gray-400"><a href="https://www.facebook.com/people/Progzila/61575326354571/" className="hover:text-white">Facebook</a></span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Progzila. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  )
}
