// src/pages/shared/Messages.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { getChatsupport, getChatMessages, getChatByProject } from '../../services/chatService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// ✅ الدالة المساعدة المعدلة بالكامل - متوافقة مع الباك اند
const getUserStatusHelper = (userId, onlineUsers, chats) => {
  if (!userId) return { online: false, text: '⚪ غير متاح' };

  const currentIdStr = userId.toString();

  // ✅ 1️⃣ التحقق من الـ onlineUsers (السوكت) - من الباك اند
  const isUserOnline = onlineUsers?.some(id => {
    if (!id) return false;
    const onlineIdStr = id.toString();
    return onlineIdStr === currentIdStr;
  });

  if (isUserOnline) {
    return { online: true, text: '🟢 متصل الآن' };
  }

  // ✅ 2️⃣ التحقق من lastSeen من الباك اند
  const chat = chats.find(c => {
    const userId1 = c.user?._id?.toString();
    const userId2 = c.otherUser?._id?.toString();
    return userId1 === currentIdStr || userId2 === currentIdStr;
  });

  if (chat) {
    // ✅ جلب lastSeen من user أو otherUser
    const lastSeen = chat.user?.lastSeen || chat.otherUser?.lastSeen;
    
    if (lastSeen) {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffSeconds = Math.floor((now - date) / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      // ✅ أقل من دقيقة
      if (diffSeconds < 60) {
        return { online: false, text: '🟢 نشط منذ ثوانٍ' };
      }
      // ✅ أقل من ساعة
      else if (diffMinutes < 60) {
        return { online: false, text: `🟡 منذ ${diffMinutes} دقيقة` };
      }
      // ✅ أقل من يوم
      else if (diffHours < 24) {
        return { online: false, text: `🟡 منذ ${diffHours} ساعة` };
      }
      // ✅ أكثر من يوم
      else {
        return { online: false, text: `⚪ آخر ظهور: ${date.toLocaleDateString('ar-EG')}` };
      }
    }
  }

  return { online: false, text: '⚪ غير متاح' };
};

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

export default function Messages() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [projectIdInput, setProjectIdInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isUserAtBottom = useRef(true);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [currentOtherUser, setCurrentOtherUser] = useState(null);

  // ✅ دالة للتحقق إذا كان المستخدم في الأسفل
  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  // ✅ استمع لحدث التمرير
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isUserAtBottom.current = checkIfAtBottom();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ جلب المحادثات
  const loadChats = useCallback(async () => {
    try {
      setIsLoadingChats(true);
      const response = await getChatsupport();
      const chatsData = response?.data?.chats || response?.chats || response?.data || [];
      setChats(chatsData);
    } catch (error) {
      console.error('❌ Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
      setLoading(false);
    }
  }, []);

  // ✅ جلب رسائل الشات
// ✅ اختيار محادثة في Messages.jsx
const selectChat = (chat) => {
  setSelectedChat(chat);
  setOtherUserTyping(false);
  
  const otherUser = chat.user || chat.otherUser;
  setCurrentOtherUser(otherUser);
  
  if (chat.chatId) {
    if (socket) {
      // 1️⃣ تسجيل التواجد أولاً لحفظ socket.userId بالسيرفر
      if (user?._id) {
        socket.emit('user-online', { userId: user._id.toString() });
      }
      
      // 2️⃣ الانضمام الفوري للغرفة بصيغة نصية صريحة
      setTimeout(() => {
        console.log('📡 Admin Joining chat room:', chat.chatId.toString());
        socket.emit('join-chat-support', chat.chatId.toString());
      }, 50);
    }
    loadMessages(chat.chatId);
  }
};

const loadMessages = useCallback(async (chatId) => {
  try {
    const response = await getChatMessages(chatId);
    
    let messagesData = [];
    if (response?.data?.messages) messagesData = response.data.messages;
    else if (response?.messages) messagesData = response.messages;
    else if (Array.isArray(response?.data)) messagesData = response.data;
    else if (Array.isArray(response)) messagesData = response;
    
    const processedMessages = messagesData.map(msg => ({
      ...msg,
      sender: msg.sender || msg.senderId,
      senderId: msg.senderId || msg.sender
    }));
    
    setMessages(processedMessages);
    setCurrentChatId(chatId);
    
    if (selectedChat) {
      const otherUser = selectedChat.user || selectedChat.otherUser;
      setCurrentOtherUser(otherUser);
    }
    
    if (socket && chatId) {
      socket.emit('seen', { chatId: chatId.toString(), userId: user?._id });
    }
    
    setTimeout(() => {
      isUserAtBottom.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    
  } catch (error) {
    console.error('❌ Error loading messages:', error);
    setMessages([]);
  }
}, [socket, user, selectedChat]);

  // ✅ جلب المحادثات عند تحميل الصفحة
  useEffect(() => {
    let isMounted = true;
    
    const fetchChats = async () => {
      if (!isMounted) return;
      await loadChats();
    };
    
    fetchChats();
    
    return () => {
      isMounted = false;
    };
  }, [loadChats]);

  // ✅ اختيار محادثة


  // ✅ استقبال رسالة جديدة
useEffect(() => {
  if (!socket) return;

  const handleReceiveMessage = (message) => {
    
    // استخراج معرف الشات القادم من السيرفر بشكل مرن ونظيف
    const incomingChatId = message.chat?._id || message.chat || message.chatId;
    const msgSenderId = message.sender?._id || message.sender || message.senderId?._id || message.senderId;

    const processedMessage = {
      ...message,
      sender: msgSenderId,
      seen: message.seen || false,
      delivered: message.delivered || true 
    };
    
    // ✅ تحويل لمعرفات نصية صريحة لتجنب عدم التطابق
    if (incomingChatId && currentChatId && incomingChatId.toString() === currentChatId.toString()) {
      if (msgSenderId?.toString() !== user?._id?.toString() && socket) {
        socket.emit('seen', { chatId: currentChatId.toString(), userId: user?._id });
      }

      setMessages(prev => {
        if (!Array.isArray(prev)) return [processedMessage];
        
        if (msgSenderId?.toString() === user?._id?.toString()) {
          const tempMessageIdx = prev.findIndex(msg => 
            msg._id?.toString().startsWith('temp-') && 
            msg.text?.trim() === processedMessage.text?.trim()
          );
          
          if (tempMessageIdx !== -1) {
            const updatedMessages = [...prev];
            updatedMessages[tempMessageIdx] = processedMessage;
            return updatedMessages;
          }
        }
        
        if (prev.some(msg => msg._id?.toString() === processedMessage._id?.toString())) {
          return prev;
        }
        
        return [...prev, processedMessage];
      });
      
      setTimeout(() => {
        if (isUserAtBottom.current) {
          const messageElement = document.getElementById(`message-${processedMessage._id}`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
    
    // تحديث الـ sidebar للـ chats
    setChats(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.map(chat => {
        const checkChatId = chat.chatId || chat._id;
        const isCurrentChat = incomingChatId && currentChatId && incomingChatId.toString() === currentChatId.toString();
        
        return checkChatId && incomingChatId && checkChatId.toString() === incomingChatId.toString()
          ? { 
              ...chat, 
              lastMessage: message.text || '📎 مرفق', 
              updatedAt: message.createdAt,
              unreadCount: isCurrentChat ? 0 : (msgSenderId?.toString() !== user?._id?.toString() ? (chat.unreadCount || 0) + 1 : 0)
            }
          : chat;
      });
    });
  };

  const handleMessagesSeen = ({ chatId: seenChatId, seenBy }) => {
    if (seenChatId && currentChatId && seenChatId.toString() === currentChatId.toString() && seenBy?.toString() !== user?._id?.toString()) {
      setMessages(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(msg => {
          const msgSenderId = msg.sender?._id || msg.sender || msg.senderId?._id || msg.senderId;
          if (msgSenderId?.toString() === user?._id?.toString()) {
            return { ...msg, seen: true };
          }
          return msg;
        });
      });

      setChats(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(chat => {
          const checkChatId = chat.chatId || chat._id;
          return checkChatId && seenChatId && checkChatId.toString() === seenChatId.toString() 
            ? { ...chat, unreadCount: 0 } 
            : chat;
        });
      });
    }
  };

  const handleTyping = ({ chatId: typingChatId, userId }) => {
    if (typingChatId && currentChatId && typingChatId.toString() === currentChatId.toString() && userId?.toString() !== user?._id?.toString()) {
      setOtherUserTyping(true);
    }
  };

  const handleStopTyping = ({ chatId: stopChatId, userId }) => {
    if (stopChatId && currentChatId && stopChatId.toString() === currentChatId.toString() && userId?.toString() !== user?._id?.toString()) {
      setOtherUserTyping(false);
    }
  };

  const handleOnlineUsersUpdate = (usersList) => {
    console.log("🟢 Live Online Users updated:", usersList);
  };

  socket.on('receive-message', handleReceiveMessage);
  socket.on('messages-seen', handleMessagesSeen);
  socket.on('typing', handleTyping);
  socket.on('stop-typing', handleStopTyping);
  socket.on('online-users', handleOnlineUsersUpdate);

  return () => {
    socket.off('receive-message', handleReceiveMessage);
    socket.off('messages-seen', handleMessagesSeen);
    socket.off('typing', handleTyping);
    socket.off('stop-typing', handleStopTyping);
    socket.off('online-users', handleOnlineUsersUpdate);
  };
}, [socket, currentChatId, user?._id]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (messages.length > 0 && isUserAtBottom.current) {
        const lastMessage = messages[messages.length - 1];
        const messageElement = document.getElementById(`message-${lastMessage._id}`);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // ✅ إرسال رسالة
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedChat) return;

    const tempId = 'temp-' + Date.now();

    const messageData = {
      chatId: selectedChat.chatId,
      sender: user?._id,
      text: newMessage.trim(),
    };

    const tempMessage = {
      _id: tempId,
      chat: selectedChat.chatId,
      sender: user?._id,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => {
      if (!Array.isArray(prev)) return [tempMessage];
      return [...prev, tempMessage];
    });
    
    setNewMessage('');
    
    setChats(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.map(chat => 
        chat.chatId === selectedChat.chatId
          ? { ...chat, lastMessage: newMessage.trim(), updatedAt: new Date().toISOString() }
          : chat
      );
    });

    socket.emit('send-message', messageData);

    setTimeout(() => {
      isUserAtBottom.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ✅ Handle typing
  const handleTypingStart = () => {
    if (!isTyping && socket && selectedChat) {
      setIsTyping(true);
      socket.emit('typing', { chatId: selectedChat.chatId, userId: user?._id });
    }
  };

  const handleTypingStop = () => {
    if (isTyping && socket && selectedChat) {
      setIsTyping(false);
      socket.emit('stop-typing', { chatId: selectedChat.chatId, userId: user?._id });
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
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingStop();
      }, 1000);
    } else {
      handleTypingStop();
    }
  };

  // ✅ إنشاء شات جديد
  const handleCreateChat = async () => {
    if (!projectIdInput.trim()) {
      alert('يرجى إدخال معرف المشروع');
      return;
    }

    try {
      const response = await getChatByProject(projectIdInput);
      
      const chat = response?.data?.chat || response?.chat || response?.data;
      if (chat) {
        setChats(prev => [chat, ...prev]);
        selectChat(chat);
        setShowNewChatModal(false);
        setProjectIdInput('');
        alert('✅ تم إنشاء المحادثة بنجاح');
      }
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء إنشاء المحادثة');
    }
  };

  // ✅ معرفة حالة المستخدم
  const getUserStatus = (userId) => {
    return getUserStatusHelper(userId, onlineUsers, chats);
  };

  const formatTime = (timestamp) => {
    return formatTimeHelper(timestamp);
  };

  const filteredChats = chats.filter(chat => {
    const userName = chat.user?.username || chat.otherUser?.username || chat.name || '';
    const projectName = chat.projectName || chat.project?.name || '';
    const search = searchTerm.toLowerCase();
    return userName.toLowerCase().includes(search) || projectName.toLowerCase().includes(search);
  });

  if (loading || isLoadingChats) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل الرسائل...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50/20" dir="rtl">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-120px)]">
            <div className="flex h-full">
              {/* Chats Sidebar */}
              <div className="w-80 border-l border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">رسائل الدعم الخاصة بك 💬</h2>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🔍 بحث في المحادثات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredChats.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-gray-500">لا توجد محادثات</p>
                     
                    </div>
                  ) : (
                    filteredChats.map((chat) => {
                      const isActive = selectedChat?.chatId === chat.chatId;
                      const userData = chat.user || chat.otherUser || {};
                      const userName = userData.username || chat.name || 'مستخدم';
                      const userImage = userData.profileImage || chat.avatar || 'https://randomuser.me/api/portraits/men/32.jpg';
                      const status = getUserStatus(userData._id);
                      
                      return (
                        <motion.div
                          key={chat.chatId}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => selectChat(chat)}
                          className={`p-4 cursor-pointer transition-all duration-300 ${
                            isActive
                              ? 'bg-indigo-50 border-r-4 border-indigo-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="relative">
                              <img src={userImage} alt={userName} className="w-12 h-12 rounded-full object-cover" />
                              {status.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-800 truncate">{userName}</h3>
                                <span className="text-xs text-gray-400">{formatTime(chat.updatedAt || chat.lastMessage?.createdAt)}</span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">{chat.projectName || chat.project?.name || 'مشروع'}</p>
                              <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage?.text || chat.lastMessage || 'ابدأ المحادثة'}</p>
                            </div>
                            {chat.unreadCount > 0 && (
                              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-white">{chat.unreadCount}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1">
                            <span className={`text-xs ${status.online ? 'text-green-500' : 'text-gray-400'}`}>
                              {status.text}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              {selectedChat && currentOtherUser ? (
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={currentOtherUser?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={currentOtherUser?.username || 'مستخدم'} 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        {getUserStatus(currentOtherUser?._id).online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {currentOtherUser?.username || 'مستخدم'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {otherUserTyping ? (
                            <span className="text-indigo-600">يكتب...</span>
                          ) : (
                            getUserStatus(currentOtherUser?._id).text
                          )}
                        </p>
                      </div>
                    </div>
                   
                  </div>

                  {/* Messages Area */}
                  <div 
                    className="flex-1 overflow-y-auto p-4 space-y-4" 
                    ref={messagesContainerRef}
                  >
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>لا توجد رسائل بعد</p>
                        <p className="text-sm">ابدأ المحادثة الآن</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const msgSenderId = msg.sender?._id || msg.sender;
                        const msgSenderIdAlt = msg.senderId?._id || msg.senderId;
                        
                        const isOwnMessage = msgSenderId === user?._id || msgSenderIdAlt === user?._id;
                        
                        const otherUserImage = currentOtherUser?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg';
                        
                        return (
                          <motion.div
                            key={msg._id || idx}
                            id={`message-${msg._id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                              {!isOwnMessage && (
                                <img 
                                  src={otherUserImage}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover" 
                                />
                              )}
                              <div>
                                <div className={`rounded-2xl p-3 ${
                                  isOwnMessage
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  <p className="text-sm break-words">{msg.text}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isOwnMessage ? 'justify-end' : ''}`}>
                                  <span>{formatTime(msg.createdAt)}</span>
                                  {isOwnMessage && msg.seen && <span>✓✓✓</span>}
                                  {isOwnMessage && msg.delivered && !msg.seen && <span>✓✓</span>}
                                  {isOwnMessage && !msg.delivered && !msg.seen && <span>⏳</span>}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Typing Indicator */}
                  {otherUserTyping && (
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        <span className="text-xs text-gray-500">يكتب...</span>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                     
                      <textarea
                        value={newMessage}
                        onChange={handleTextChange}
                        onKeyPress={handleKeyPress}
                        placeholder="اكتب رسالتك هنا..."
                        rows="1"
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        إرسال 📤
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold text-gray-700">اختر محادثة</h3>
                    <p className="text-gray-500 mt-2">لمشاهدة الرسائل</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateChat}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  بدء المحادثة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}