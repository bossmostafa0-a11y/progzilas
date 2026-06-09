import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Messages() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Mock data - Replace with API call
    setTimeout(() => {
      const mockChats = [
        {
          id: 1,
          name: 'مستشفى السلام',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          role: 'عميل',
          lastMessage: 'شكراً على المشروع الرائع! نود استكمال العمل معك',
          lastMessageTime: '2024-02-01T10:30:00',
          unreadCount: 2,
          online: true,
          typing: false,
          project: 'نظام إدارة المستشفيات الذكي'
        },
        {
          id: 2,
          name: 'أكاديمية المستقبل',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          role: 'عميل',
          lastMessage: 'هل يمكن إضافة بعض التعديلات على المنصة؟',
          lastMessageTime: '2024-01-31T15:20:00',
          unreadCount: 0,
          online: false,
          typing: false,
          project: 'منصة تعليمية متكاملة'
        },
        {
          id: 3,
          name: 'متجر الأصالة',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          role: 'عميل',
          lastMessage: 'تم استلام المشروع، شكراً جزيلاً',
          lastMessageTime: '2024-01-30T09:15:00',
          unreadCount: 0,
          online: true,
          typing: false,
          project: 'متجر إلكتروني متكامل'
        },
        {
          id: 4,
          name: 'شركة البيانات',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
          role: 'عميل',
          lastMessage: 'متى يمكن تسليم التقرير النهائي؟',
          lastMessageTime: '2024-01-29T14:45:00',
          unreadCount: 1,
          online: false,
          typing: false,
          project: 'لوحة تحكم تحليلات متقدمة'
        }
      ];

      setChats(mockChats);
      setLoading(false);
    }, 1000);
  }, []);

  // Load messages when chat is selected

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: user?.id || 'current',
      senderName: 'أحمد المنصوري',
      senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: newMessage,
      time: new Date().toISOString(),
      status: 'sending'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate message sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
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

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓✓';
      default: return '';
    }
  };

  // Animation variants
  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

 

  if (loading) {
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
                    <h2 className="text-xl font-bold text-gray-800">الرسائل 💬</h2>
                    <button
                      onClick={() => setShowNewChatModal(true)}
                      className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition"
                    >
                      <span className="text-xl">+</span>
                    </button>
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
                    filteredChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible"
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 cursor-pointer transition-all duration-300 ${
                          selectedChat?.id === chat.id
                            ? 'bg-indigo-50 border-r-4 border-indigo-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="relative">
                            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                            {chat.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                              <span className="text-xs text-gray-400">{formatTime(chat.lastMessageTime)}</span>
                            </div>
                            <p className="text-xs text-gray-500">{chat.project}</p>
                            <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">{chat.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              {selectedChat ? (
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
                        {selectedChat.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                        <p className="text-xs text-gray-500">{selectedChat.project}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex ${msg.senderId === (user?.id || 'current') ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${msg.senderId === (user?.id || 'current') ? 'flex-row-reverse' : ''}`}>
                          {msg.senderId !== (user?.id || 'current') && (
                            <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover" />
                          )}
                          <div>
                            <div className={`rounded-2xl p-3 ${
                              msg.senderId === (user?.id || 'current')
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${msg.senderId === (user?.id || 'current') ? 'justify-end' : ''}`}>
                              <span>{formatTime(msg.time)}</span>
                              {msg.senderId === (user?.id || 'current') && (
                                <span>{getMessageStatusIcon(msg.status)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Typing Indicator */}
                  {selectedChat.typing && (
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        <span className="text-xs text-gray-500">{selectedChat.name} يكتب...</span>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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
              <h3 className="text-xl font-bold mb-4">بدء محادثة جديدة</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="اسم العميل أو البريد الإلكتروني"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
                <textarea
                  placeholder="رسالة الترحيب"
                  rows="3"
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    alert('تم إرسال الرسالة');
                    setShowNewChatModal(false);
                  }}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  إرسال
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