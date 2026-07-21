/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { getSupportChat, getSupportMessages } from '../../services/chatService';
import Navbar from '../../components/layout/Navbar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const formatTimeHelper = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'أمس';
  } else if (days < 7) {
    return `${days} أيام`;
  } else {
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  }
};

const QUICK_REPLIES = [
  { text: 'لدي مشكلة في تحميل المشروع', icon: '📥' },
  { text: 'أريد الاستفسار عن طريقة الدفع', icon: '💳' },
  { text: 'لدي مشكلة تقنية', icon: '🔧' },
  { text: 'أريد طلب استرجاع', icon: '↩️' },
  { text: 'استفسار عام', icon: '❓' },
];

export default function Support() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isUserAtBottom = useRef(true);
  const typingTimeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const loadedRef = useRef(false);
  const tempIdCounter = useRef(0);

  // ✅ حساب حالة الاتصال فوراً وبشكل ديناميكي بدون State وبدون Cascading Renders
  const isConnected = !!(socket && chatId);

  useEffect(() => {
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Pathname:', location.pathname);
    console.log('📍 Project ID from params:', projectId);
    console.log('📍 Location state:', location.state);
    
    if (!projectId && location.state?.projectId) {
      console.log('📍 Using projectId from state:', location.state.projectId);
      navigate(`/support/chat/${location.state.projectId}`, { replace: true });
    }
  }, [projectId, location, navigate]);

  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => { isUserAtBottom.current = checkIfAtBottom(); };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // ✅ تحميل بيانات الشات من الـ API
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const finalProjectId = projectId || location.state?.projectId;
        
        console.log('📡 Loading support chat...');
        console.log('📡 Final Project ID:', finalProjectId);
        
        const response = await getSupportChat(finalProjectId);
        console.log('✅ Chat response:', response);
        
        const chat = response?.data?.chat || response?.chat || response?.data;
        
        if (chat?.chatId) {
          const id = chat.chatId;
          setChatId(id);
          setOtherUser(chat.otherUser || null);
          setProjectData(chat.project || null);
          
          if (chat.otherUser?.isOnline) {
            setAdminOnline(true);
          }
          
          const msgResponse = await getSupportMessages(id);
          console.log('✅ Messages response:', msgResponse);
          
          let messagesData = [];
          if (msgResponse?.data?.messages) messagesData = msgResponse.data.messages;
          else if (msgResponse?.messages) messagesData = msgResponse.messages;
          else if (Array.isArray(msgResponse?.data)) messagesData = msgResponse.data;
          
          setMessages(Array.isArray(messagesData) ? messagesData : []);
        } else {
          console.error('❌ No chat data received');
          setError('لا توجد محادثة حالية');
        }
      } catch (error) {
        console.error('❌ Error loading support chat:', error);
        setError(error.message || 'حدث خطأ في تحميل المحادثة');
        
        if (error.response?.status === 404 && !projectId) {
          setError('لا توجد محادثة دعم عام. يرجى المحاولة لاحقاً.');
        } else if (error.response?.status === 404) {
          setTimeout(() => {
            navigate('/dashboard/client');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, navigate, location.state]);

  // ✅ الانضمام للغرفة (تم حذف setState المتزامن لحل مشكلة الـ Cascading Render)
  useEffect(() => {
    if (socket && chatId) {
      console.log('📡 Dynamically joining support chat room:', chatId.toString());
      
      if (user?._id) {
        socket.emit('user-online', { userId: user._id.toString() });
      }
      
      socket.emit('join-chat-support', chatId.toString());
      socket.emit('seen', { chatId: chatId.toString(), userId: user?._id });
    }
  }, [socket, chatId, user?._id]);

  // ✅ استقبال وأحداث الـ Socket ريل تايم
  useEffect(() => {
    if (!socket || !chatId) {
      console.log('⏳ Waiting for Socket and ChatId to be ready...');
      return;
    }

    console.log('🟢 Socket and chatId are READY! Active Listeners configured.');

    const handleReceiveMessage = (message) => {
      console.log('📥 Received message from server:', message);
      const incomingChatId = message.chat?._id || message.chat || message.chatId;
      
      if (incomingChatId && incomingChatId.toString() === chatId.toString()) {
        setMessages(prev => {
          const msgSenderId = message.sender?._id || message.sender || message.senderId;
          
          const existingIndex = prev.findIndex(msg => 
            msg._id === message._id || 
            (msg.status === 'sending' && msg.text?.trim() === message.text?.trim())
          );
          
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = { 
              ...message, 
              status: 'sent',
              _id: message._id || updated[existingIndex]._id
            };
            return updated;
          }
          
          if (prev.some(msg => msg._id?.toString() === message._id?.toString())) return prev;
          return [...prev, { ...message, status: 'sent' }];
        });
        
        const msgSenderId = message.sender?._id || message.sender || message.senderId;
        if (msgSenderId?.toString() !== user?._id?.toString()) {
          setAdminOnline(true);
          setAdminTyping(false);
          socket.emit('seen', { chatId: chatId.toString(), userId: user?._id });
        }
        
        setTimeout(() => {
          if (isUserAtBottom.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    const handleMessagesSeen = ({ chatId: seenChatId, seenBy }) => {
      if (seenChatId?.toString() === chatId.toString() && seenBy?.toString() !== user?._id?.toString()) {
        setMessages(prev => prev.map(msg => {
          const msgSenderId = msg.sender?._id || msg.sender;
          if (msgSenderId?.toString() === user?._id?.toString()) {
            return { ...msg, seen: true };
          }
          return msg;
        }));
      }
    };

    const handleTyping = ({ chatId: typingChatId, userId: typingUserId }) => {
      if (typingChatId?.toString() === chatId.toString() && typingUserId?.toString() !== user?._id?.toString()) {
        setAdminTyping(true);
      }
    };

    const handleStopTyping = ({ chatId: stopChatId }) => {
      if (stopChatId?.toString() === chatId.toString()) {
        setAdminTyping(false);
      }
    };

    const handleUserOnline = ({ userId: onlineUserId }) => {
      if (otherUser && (onlineUserId?.toString() === otherUser._id?.toString())) {
        setAdminOnline(true);
      }
    };

    const handleUserOffline = ({ userId: offlineUserId }) => {
      if (otherUser && (offlineUserId?.toString() === otherUser._id?.toString())) {
        setAdminOnline(false);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('messages-seen', handleMessagesSeen);
    socket.on('typing', handleTyping);
    socket.on('stop-typing', handleStopTyping);
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('messages-seen', handleMessagesSeen);
      socket.off('typing', handleTyping);
      socket.off('stop-typing', handleStopTyping);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [socket, chatId, user?._id, otherUser]);

  useEffect(() => {
    if (messages.length > 0 && isUserAtBottom.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  // ✅ إرسال الرسالة عبر السوكت
  const handleSendMessage = (text) => {
    const messageText = text || newMessage.trim();
    if (!messageText || !isConnected) {
      console.log('❌ Cannot send message:', { messageText, isConnected });
      return;
    }

    tempIdCounter.current += 1;
    const tempMessageId = `msg-local-${tempIdCounter.current}`;
    
    const messageData = {
      chatId: chatId.toString(),
      sender: user?._id,
      text: messageText,
    };

    const tempMessage = {
      _id: tempMessageId,
      chat: chatId.toString(),
      sender: user?._id,
      text: messageText,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    if (!text) setNewMessage('');
    
    console.log('📤 Sending message to server:', messageData);
    socket.emit('send-message', messageData);

    const timeoutId = setTimeout(() => {
      setMessages(prev => prev.map(msg => {
        if (msg._id === tempMessageId && msg.status === 'sending') {
          console.log('⏰ Message timeout, marking as sent');
          return { ...msg, status: 'sent' };
        }
        return msg;
      }));
    }, 5000);

    setTimeout(() => clearTimeout(timeoutId), 6000);

    setTimeout(() => {
      isUserAtBottom.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  const handleTypingStart = () => {
    if (!isTyping && isConnected) {
      setIsTyping(true);
      socket.emit('typing', { chatId: chatId.toString(), userId: user?._id });
    }
  };

  const handleTypingStop = () => {
    if (isTyping && isConnected) {
      setIsTyping(false);
      socket.emit('stop-typing', { chatId: chatId.toString(), userId: user?._id });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      handleTypingStop();
    }
  };

  const handleTextChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => handleTypingStop(), 1000);
    } else {
      handleTypingStop();
    }
  };

  const formatTime = (timestamp) => formatTimeHelper(timestamp);

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">عذراً، حدث خطأ</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              العودة للوحة التحكم
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500 font-medium">جاري تجهيز محادثة الدعم...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden" dir="rtl">
      <Navbar />
      
      <div className="flex-1 flex flex-col min-h-0 bg-white relative">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white shadow-sm flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-100">
                {otherUser?.profileImage ? (
                  <img src={otherUser.profileImage} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : '🛟'}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${adminOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-1.5">
                {otherUser?.username || 'الدعم الفني'} 🛟
                {projectData && (
                  <span className="text-xs text-gray-400 font-normal mr-2">
                    • {projectData.projectName}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {adminOnline ? 'متصل الآن ومستعد لمساعدتك' : 'فريقنا متاح وسيتم الرد عليك في دقائق'}
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100/50">⏰ 24/7</span>
            <span className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-xl border border-purple-100/50">🛡️ أمان كامل</span>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0 bg-slate-50/50" 
          ref={messagesContainerRef}
          style={{ 
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.015) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.015) 0%, transparent 40%)'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md p-6"
              >
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl mb-5"
                >
                  👋
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">مرحباً بك في مركز الدعم</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  كيف يمكننا مساعدتك اليوم؟ يمكنك كتابة استفسارك مباشرة أو اختيار أحد الأسئلة الشائعة لبدء المحادثة فوراً.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickReply(reply.text)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-gray-600 shadow-sm transition-all"
                    >
                      <span>{reply.icon}</span>
                      <span>{reply.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {QUICK_REPLIES.slice(0, 3).map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full text-xs font-medium text-gray-600 hover:text-indigo-600 shadow-sm transition-all"
                    >
                      <span>{reply.icon}</span>
                      <span>{reply.text}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {messages.map((msg, idx) => {
                const msgSenderId = msg.sender?._id || msg.sender;
                const isOwnMessage = msgSenderId?.toString() === user?._id?.toString();
                const showAvatar = idx === 0 || (messages[idx - 1] && (messages[idx - 1].sender?._id || messages[idx - 1].sender)?.toString() !== msgSenderId?.toString());
                
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
                  >
                    <div className={`flex gap-2.5 max-w-[85%] md:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      {!isOwnMessage && showAvatar && (
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
                          {otherUser?.profileImage ? (
                            <img src={otherUser.profileImage} alt="" className="w-full h-full rounded-xl object-cover" />
                          ) : '🛟'}
                        </div>
                      )}
                      {!isOwnMessage && !showAvatar && <div className="w-8 flex-shrink-0" />}
                      
                      <div className="flex flex-col">
                        <div className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                          isOwnMessage
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                        }`}>
                          <p>{msg.text}</p>
                          {msg.status === 'sending' && (
                            <span className="text-xs text-white/60 mr-2">⏳</span>
                          )}
                          {msg.status === 'error' && (
                            <span className="text-xs text-red-400 mr-2">❌</span>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400 ${isOwnMessage ? 'justify-end' : ''}`}>
                          <span>{formatTime(msg.createdAt)}</span>
                          {isOwnMessage && (
                            <>
                              {msg.seen ? (
                                <span className="text-indigo-500 font-bold">✓✓</span>
                              ) : msg.status === 'sending' ? (
                                <span className="animate-pulse">⏳</span>
                              ) : (
                                <span>✓</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        <AnimatePresence>
          {adminTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="px-6 py-2 bg-white text-xs text-indigo-600 font-medium border-t border-gray-50 flex items-center gap-2 flex-shrink-0"
            >
              <div className="flex gap-1 bg-indigo-50 px-2 py-1.5 rounded-full items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <span>{otherUser?.username || 'فريق الدعم'} يكتب الآن...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input Box */}
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
                placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
                rows="1"
                className="w-full pl-4 pr-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none resize-none text-sm text-gray-700 placeholder-gray-400 transition-all min-h-[48px] max-h-[100px]"
                style={{ height: 'auto' }}
                disabled={!isConnected}
              />
              {!isConnected && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-amber-500 font-medium">
                  جاري الاتصال...
                </span>
              )}
            </div>
            
            <motion.button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim() || !isConnected}
              whileHover={newMessage.trim() && isConnected ? { scale: 1.02 } : {}}
              whileTap={newMessage.trim() && isConnected ? { scale: 0.98 } : {}}
              className="h-[48px] px-5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-indigo-100"
            >
              <span className="hidden sm:inline">إرسال</span>
              <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}