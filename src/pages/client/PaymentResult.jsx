import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getPaymentResult } from '../../services/payment.service';

const POLL_INTERVAL = 3000;
const MAX_ATTEMPTS = 40;

export default function PaymentResult() {
  const { sessionId } = useParams();

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
      setMessage('تم الدفع بنجاح! 🎉');
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
    setStatus('pending');
    setMessage('تم استلام طلبك، وجاري تأكيد الدفع...');
    return false;
  }, []);

  const poll = useCallback(
    async (id) => {
      try {
        const res = await getPaymentResult(id);
        const payment = res?.data ?? res;
        const done = applyStatus(payment);
        if (done) stopPolling();
      } catch (error) {
        console.error('Polling error:', error);
        const httpStatus = error?.response?.status;
        if (httpStatus === 404 || httpStatus === 403 || httpStatus === 400) {
          setStatus('unknown');
          setMessage(
            error?.response?.data?.message ||
              'لم يتم العثور على عملية الدفع.'
          );
          stopPolling();
        }
      }
    },
    [applyStatus, stopPolling]
  );

  useEffect(() => {
    if (!sessionId) return;

    stoppedRef.current = false;
    attemptsRef.current = 0;

    let firstTimeoutId = setTimeout(() => {
      if (!stoppedRef.current) poll(sessionId);
    }, 0);

    intervalRef.current = setInterval(() => {
      if (stoppedRef.current) return;
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setStatus('timeout');
        setMessage(
          'استغرق التحقق وقتاً أطول من المتوقع. لو تم خصم المبلغ، الطلب هيتأكد تلقائياً.'
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

  const config = {
    checking: { icon: '⏳', color: 'text-indigo-600', bg: 'from-indigo-400 via-purple-500 to-pink-500', title: 'جاري التحقق...' },
    pending: { icon: '⏳', color: 'text-yellow-600', bg: 'from-yellow-400 via-orange-500 to-amber-500', title: 'بانتظار تأكيد الدفع' },
    paid: { icon: '✅', color: 'text-green-600', bg: 'from-green-400 via-emerald-500 to-teal-500', title: 'تم الدفع بنجاح!' },
    failed: { icon: '❌', color: 'text-red-600', bg: 'from-red-400 via-rose-500 to-pink-500', title: 'فشلت العملية' },
    expired: { icon: '⌛', color: 'text-orange-600', bg: 'from-orange-400 via-amber-500 to-yellow-500', title: 'انتهت الصلاحية' },
    timeout: { icon: '⚠️', color: 'text-orange-600', bg: 'from-orange-400 via-amber-500 to-yellow-500', title: 'تأخر التأكيد' },
    unknown: { icon: '❓', color: 'text-gray-600', bg: 'from-gray-400 via-gray-500 to-gray-600', title: 'غير معروف' },
  };

  const cfg = config[status] || config.checking;
  const isLoading = status === 'checking' || status === 'pending';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20" dir="rtl">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-10 right-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl"
        />

        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-60" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full opacity-60" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className={`w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br ${cfg.bg} flex items-center justify-center shadow-lg`}
              >
                {isLoading ? (
                  <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="text-5xl">{cfg.icon}</span>
                )}
              </motion.div>

              <h3 className={`text-2xl font-bold mb-2 ${cfg.color}`}>{cfg.title}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>

              {paymentData && (paymentData.amount != null || paymentData.paidAt) && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right text-sm space-y-2">
                  {paymentData.amount != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">المبلغ:</span>
                      <span className="font-bold text-gray-800">
                        {paymentData.amount} {paymentData.currency || 'EGP'}
                      </span>
                    </div>
                  )}
                  {paymentData.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">تاريخ الدفع:</span>
                      <span className="text-gray-800">
                        {new Date(paymentData.paidAt).toLocaleString('ar-EG')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {status === 'paid' && (
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  الدفع مكتمل
                </div>
              )}
              {status === 'pending' && (
                <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  بانتظار التأكيد
                </div>
              )}

              <div className="flex flex-col gap-3">
                {status === 'paid' && (
                  <>
                    <Link to="dashboard/client/projects">
                      <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition">
                         صفحةالمشاريع
                      </button>
                    </Link>
                    <Link to="/marketplace">
                      <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        العودة للمتجر
                      </button>
                    </Link>
                  </>
                )}

                {(status === 'failed' || status === 'expired' || status === 'timeout' || status === 'unknown') && (
                  <>
                    <Link to="/marketplace">
                      <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition">
                        إعادة المحاولة
                      </button>
                    </Link>
                    <Link to="/dashboard">
                      <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        لوحة التحكم
                      </button>
                    </Link>
                  </>
                )}

                {(status === 'checking' || status === 'pending') && (
                  <Link to="/dashboard">
                    <button className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                      لوحة التحكم
                    </button>
                  </Link>
                )}
              </div>

              {status === 'pending' && (
                <p className="text-xs text-gray-400 mt-4">
                  لا تغلق الصفحة — يتم التحقق تلقائياً كل 3 ثواني
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}