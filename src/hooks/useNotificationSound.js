import { useRef, useCallback, useEffect } from 'react';

/**
 * هوك مخصص لتشغيل صوت الإشعارات
 * 
 * @param {Object} options - إعدادات الصوت
 * @param {string} options.soundUrl - مسار ملف الصوت (افتراضي: '/notification.mp3')
 * @param {number} options.volume - مستوى الصوت من 0 إلى 1 (افتراضي: 0.5)
 * @param {boolean} options.preload - تحميل الصوت مسبقاً (افتراضي: true)
 * 
 * @returns {Object} - يحتوي على دوال التحكم في الصوت
 * @returns {Function} playSound - تشغيل الصوت
 * @returns {Function} stopSound - إيقاف الصوت
 * @returns {Function} setVolume - تغيير مستوى الصوت
 * @returns {Object} audioRef - المرجع لكائن Audio (للاستخدام المتقدم)
 * 
 * @example
 * // استخدام أساسي
 * const { playSound } = useNotificationSound();
 * 
 * @example
 * // استخدام متقدم مع تخصيص
 * const { playSound, stopSound, setVolume } = useNotificationSound({
 *   soundUrl: '/custom-sound.mp3',
 *   volume: 0.7,
 *   preload: true
 * });
 */
export const useNotificationSound = (options = {}) => {
  const {
    soundUrl = '/notification.mp3',
    volume = 0.5,
    preload = true
  } = options;

  const audioRef = useRef(null);

  // إنشاء كائن Audio وتحميل الصوت مسبقاً
  useEffect(() => {
    // إنشاء الكائن مرة واحدة عند التركيب
    if (preload && !audioRef.current) {
      try {
        audioRef.current = new Audio(soundUrl);
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
        // تحميل الصوت في الخلفية
        audioRef.current.load();
      } catch (error) {
        console.warn('فشل في تحميل الصوت:', error);
      }
    }

    // تنظيف عند إزالة الكومبوننت
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current.load();
        } catch (error) {
          // تجاهل أخطاء التنظيف
          console.log(error)
        }
        audioRef.current = null;
      }
    };
    // نعتمد على [] لأننا نريد التنفيذ مرة واحدة فقط
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * تشغيل صوت الإشعار
   * يتم إعادة تعيين وقت الصوت إلى البداية في كل مرة
   */
  const playSound = useCallback(() => {
    try {
      // إنشاء كائن Audio إذا لم يكن موجوداً
      if (!audioRef.current) {
        audioRef.current = new Audio(soundUrl);
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
      }

      // إعادة تعيين وقت التشغيل إلى البداية
      audioRef.current.currentTime = 0;

      // تشغيل الصوت والتعامل مع الـ Promise
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // تجاهل خطأ "المستخدم لم يتفاعل مع الصفحة بعد"
          if (error.name === 'NotAllowedError') {
            console.warn(
              'تشغيل الصوت ممنوع - يحتاج المتصفح لتفاعل المستخدم أولاً. ' +
              'تأكد من أن تشغيل الصوت يتم بعد نقرة أو إجراء من المستخدم.'
            );
          } else if (error.name === 'AbortError') {
            // تم إلغاء التشغيل - غالباً بسبب تشغيل سريع متتالي
            console.debug('تم إلغاء تشغيل الصوت السابق');
          } else {
            console.warn('خطأ في تشغيل الصوت:', error.name, error.message);
          }
        });
      }
    } catch (error) {
      console.warn('خطأ غير متوقع أثناء تشغيل الصوت:', error);
    }
  }, [soundUrl, volume]);

  /**
   * إيقاف تشغيل الصوت
   */
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.warn('خطأ أثناء إيقاف الصوت:', error);
      }
    }
  }, []);

  /**
   * تغيير مستوى الصوت
   * @param {number} newVolume - مستوى الصوت الجديد (0 إلى 1)
   */
  const setVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      try {
        // التأكد من أن القيمة بين 0 و 1
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        audioRef.current.volume = clampedVolume;
      } catch (error) {
        console.warn('خطأ في تغيير مستوى الصوت:', error);
      }
    }
  }, []);

  return {
    playSound,
    stopSound,
    setVolume,
    audioRef // مرجع مفيد للاستخدامات المتقدمة
  };
};

export default useNotificationSound;