/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getSubscriptionResult } from '../../services/payment.service';

const POLL_INTERVAL = 3000; // 3 ثواني
const MAX_ATTEMPTS = 40; // ~ دقيقتين

export default function SubscriptionResult() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // ✅ الحالة الابتدائية محسوبة من sessionId مباشرة — مفيش setState في effect
  const [status, setStatus] = useState(() =>
    sessionId ? 'checking' : 'unknown'
  );
  const [message, setMessage] = useState(() =>
    sessionId
      ? 'جاري التحقق من حالة الدفع...'
      : 'لم يتم العثور على جلسة الدفع.'
  );
  const [paymentData, setPaymentData] = useState(null);

  const attemptsRef = useRef(0);
  const intervalRef = useRef(null);
  const stoppedRef = useRef(false);

  const stopPolling = useCallback(() => {
    stoppedRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const applyStatus = useCallback((payment) => {
    const s = payment?.status;
    setPaymentData(payment);

    if (s === 'paid') {
      setStatus('paid');
      setMessage('تم تفعيل اشتراكك بنجاح 🎉');
      return true;
    }
    if (s === 'failed') {
      setStatus('failed');
      setMessage('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
      return true;
    }
    if (s === 'expired') {
      setStatus('expired');
      setMessage('انتهت صلاحية جلسة الدفع. يرجى البدء من جديد.');
      return true;
    }
    // pending أو أي حالة تانية → نكمل polling
    setStatus('pending');
    setMessage('تم استلام طلبك، وجاري تأكيد الدفع من بوابة الدفع...');
    return false;
  }, []);

  // ✅ poll async — كل setState جوّاها بعد await
  const poll = useCallback(
    async (id) => {
      try {
        const res = await getSubscriptionResult(id);
        const payment = res?.data ?? res;
        const done = applyStatus(payment);
        if (done) stopPolling();
      } catch (error) {
        console.error('Polling error:', error);
        const httpStatus = error?.response?.status;

        // 404: الجلسة مش موجودة أو مش بتاعة المستخدم → وقف فوراً
        if (httpStatus === 404) {
          setStatus('unknown');
          setMessage(
            error?.response?.data?.message ||
              'عملية الدفع غير موجودة أو لا تخص حسابك.'
          );
          stopPolling();
          return;
        }

        // 403: مش developer → صفحة غير مسموحة
        if (httpStatus === 403) {
          setStatus('unknown');
          setMessage(
            error?.response?.data?.message ||
              'الصفحة متاحة لحسابات المبرمجين فقط.'
          );
          stopPolling();
          return;
        }

        // 400: sessionId غلط
        if (httpStatus === 400) {
          setStatus('unknown');
          setMessage(
            error?.response?.data?.message || 'معرف جلسة الدفع غير صحيح.'
          );
          stopPolling();
          return;
        }

        // أخطاء شبكة عادية → نسيب polling يكمل
      }
    },
    [applyStatus, stopPolling]
  );

  useEffect(() => {
    // ✅ لو مفيش sessionId: مفيش setState هنا خالص — الحالة الابتدائية غطّت ده
    if (!sessionId) return;

    stoppedRef.current = false;
    attemptsRef.current = 0;

    let firstTimeoutId = null;

    // ✅ نأجل أول poll خارج جسم الـ effect (timer callback → مسموح)
    firstTimeoutId = setTimeout(() => {
      if (!stoppedRef.current) poll(sessionId);
    }, 0);

    intervalRef.current = setInterval(() => {
      if (stoppedRef.current) return;

      attemptsRef.current += 1;

      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setStatus('timeout');
        setMessage(
          'استغرق التحقق وقتاً أطول من المتوقع. لو تم خصم المبلغ، الاشتراك هيتفعل تلقائياً خلال دقائق.'
        );
        stopPolling();
        return;
      }

      poll(sessionId);
    }, POLL_INTERVAL);

    return () => {
      if (firstTimeoutId) clearTimeout(firstTimeoutId);
      stopPolling();
    };
  }, [sessionId, poll, stopPolling]);

  // ====== إعدادات العرض لكل حالة ======
  const statusConfig = {
    checking: {
      icon: '⏳',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      title: 'جاري التحقق...',
    },
    pending: {
      icon: '⏳',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'بانتظار تأكيد الدفع',
    },
    paid: {
      icon: '✅',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'تم الدفع بنجاح',
    },
    failed: {
      icon: '❌',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'فشلت العملية',
    },
    expired: {
      icon: '⌛',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      title: 'انتهت الصلاحية',
    },
    timeout: {
      icon: '⚠️',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      title: 'تأخر التأكيد',
    },
    unknown: {
      icon: '❓',
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      title: 'غير معروف',
    },
  };

  const cfg = statusConfig[status] || statusConfig.checking;
  const isLoading = status === 'checking' || status === 'pending';

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20"
      dir="rtl"
    >
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center border ${cfg.border}`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${cfg.bg}`}
          >
            {isLoading ? (
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <span className="text-4xl">{cfg.icon}</span>
            )}
          </div>

          <h1 className={`text-2xl font-bold mb-2 ${cfg.color}`}>
            {cfg.title}
          </h1>

          <p className="text-gray-600 mb-6">{message}</p>

          {/* تفاصيل الدفع لو متاحة */}
          {paymentData && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right text-sm space-y-2">
              {paymentData.paymentId && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">رقم العملية:</span>
                  <span
                    className="font-mono text-gray-800 break-all text-left"
                    dir="ltr"
                  >
                    {paymentData.paymentId}
                  </span>
                </div>
              )}
              {paymentData.amount != null && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">المبلغ:</span>
                  <span className="font-bold text-gray-800">
                    {paymentData.amount} {paymentData.currency || 'EGP'}
                  </span>
                </div>
              )}
              {paymentData.paidAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">تاريخ الدفع:</span>
                  <span className="text-gray-800">
                    {new Date(paymentData.paidAt).toLocaleString('ar-EG')}
                  </span>
                </div>
              )}
              {paymentData.subscriptionStartDate && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">بداية الاشتراك:</span>
                  <span className="text-gray-800">
                    {new Date(
                      paymentData.subscriptionStartDate
                    ).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              )}
              {paymentData.subscriptionEndDate && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">نهاية الاشتراك:</span>
                  <span className="text-gray-800">
                    {new Date(
                      paymentData.subscriptionEndDate
                    ).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'paid' && (
              <>
                <Link to="/dashboard/developer" className="flex-1">
                  <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition">
                    الذهاب للوحة التحكم
                  </button>
                </Link>
                <Link to="/" className="flex-1">
                  <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                    الصفحة الرئيسية
                  </button>
                </Link>
              </>
            )}

            {(status === 'failed' ||
              status === 'expired' ||
              status === 'timeout' ||
              status === 'unknown') && (
              <>
                <Link to="/pricing" className="flex-1">
                  <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition">
                    إعادة المحاولة
                  </button>
                </Link>
                <Link to="/" className="flex-1">
                  <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                    الصفحة الرئيسية
                  </button>
                </Link>
              </>
            )}

            {(status === 'checking' || status === 'pending') && (
              <Link to="/" className="flex-1">
                <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  العودة للرئيسية
                </button>
              </Link>
            )}
          </div>

          {status === 'pending' && (
            <p className="text-xs text-gray-400 mt-4">
              لا تغلق الصفحة — يتم التحقق تلقائياً كل 3 ثواني
            </p>
          )}

          {sessionId && (
            <p
              className="text-[10px] text-gray-300 mt-3 font-mono break-all"
              dir="ltr"
            >
              Session: {sessionId}
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}