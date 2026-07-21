// src/context/SocketContext.jsx

import { createContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

// ✅ إنشاء الـ Context
const SocketContext = createContext();

// ✅ Provider Component
export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const hasConnected = useRef(false);
const url = import.meta.env.VITE_API_URL ;
  useEffect(() => {
    if (!user?._id || hasConnected.current) return;

    const socketInstance = io(url, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current = socketInstance;
    hasConnected.current = true;

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
      socketInstance.emit('user-online', user._id);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('online-users', (users) => {
      console.log('🟢 Online users:', users);
      setOnlineUsers(users);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setIsConnected(false);
        hasConnected.current = false;
      }
    };
  }, [user?._id]);

  const joinChat = (chatId) => {
    if (socketRef.current && chatId) {
      socketRef.current.emit('join-chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socketRef.current && chatId) {
      socketRef.current.emit('leave-chat', chatId);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// ✅ تصدير Context للاستخدام في الـ Hook
export default SocketContext;