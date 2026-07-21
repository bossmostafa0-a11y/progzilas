// src/context/NotificationProvider.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import NotificationContext from './NotificationContext';


export default function NotificationProvider({ children }) {
  const { socket } = useSocket();
  const audioRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [isSoundReady, setIsSoundReady] = useState(false);

  // ✅ تشغيل الصوت
const playSound = useCallback(() => {
  if (!audioRef.current) return;

  audioRef.current.currentTime = 0;

  audioRef.current.play().catch((err) => {
    console.log("🔇 Sound failed:", err);
  });
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