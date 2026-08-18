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