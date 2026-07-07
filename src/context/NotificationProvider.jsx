// src/context/NotificationProvider.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import NotificationContext from './NotificationContext';

const NOTIFICATION_SOUND = '/notification.mp3';

export default function NotificationProvider({ children }) {
  const { socket } = useSocket();
  const audioRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [isSoundReady, setIsSoundReady] = useState(false);

  // ✅ تشغيل الصوت
  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND);
        audioRef.current.volume = 0.5;
      }
      
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('🔇 Sound failed:', err);
      });
    } catch (error) {
      console.log('🔇 Audio error:', error);
    }
  }, []);

  // ✅ تفعيل الصوت عند أول نقرة
  useEffect(() => {
    const enableSound = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsSoundReady(true);
        }).catch(() => {});
      }
    };

    document.addEventListener('click', enableSound, { once: true });
    
    return () => {
      document.removeEventListener('click', enableSound);
    };
  }, []);

  // ✅ استقبال الإشعارات من السوكت وتشغيل الصوت
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log('🔔 New notification:', notification);
      playSound();
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket, playSound]);

  // ✅ القيم اللي هتكون متاحة لأي صفحة
  const value = {
    playSound
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}