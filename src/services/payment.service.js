import api from './api';

/**
 * إنشاء طلب اشتراك VIP جديد
 * @param {Object} data
 * @param {string} data.senderPhone - رقم التليفون اللي هيحول منه
 * @param {string} data.name - اسم المستخدم
 */
export const createVipSubscription = async (data) => {
  try {
    const response = await api.post('/dev/vip', data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating VIP subscription:', error);
    throw error;
  }
};

/**
 * جلب حالة الاشتراك الحالية للمستخدم
 */
export const getSubscription = async () => {
  try {
    const response = await api.get('/dev/mesub');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    throw error;
  }
};

/**
 * جلب سجل الاشتراكات
 */
export const getSubscriptionHistory = async () => {
  try {
    const response = await api.get('/dev/history');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    throw error;
  }
};


// ========== الدفع الجديد (XPay) ==========
export const createXPayCheckout = async () => {
  const response = await api.post('/subscription/create-checkout');
  return response.data;
};

export const getXPayPaymentStatus = async (paymentId) => {
  const response = await api.get(`/subscription/status/${paymentId}`);
  return response.data;
};

export const getSubscriptionResult = async (sessionId) => {
  const response = await api.get(`/subscription/result/${sessionId}`);
  return response.data;
};

//شراء مشاريع
export const getPaymentResult = async (sessionId) => {
  const response = await api.get(`/subscription/xpay/result/${sessionId}`);
  return response.data;
};
export const createXPayCheckoutorder = async ({ purpose, orderId, paymentId }) => {
  const response = await api.post('/subscription/xpay/checkout', {
    purpose,
    orderId,
    paymentId,
  });
  return response.data;
};