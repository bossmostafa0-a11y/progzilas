/* eslint-disable no-unused-vars */
// src/pages/shared/ProjectWorkspace.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  FiHome,
  FiFolder,
  FiFile,
  FiDollarSign,
  FiActivity,
  FiClock,
  FiUpload,
  FiMoreHorizontal,
  FiGithub,
  FiExternalLink,
  FiUserPlus,
  FiX,
  FiMessageSquare,
  FiShield,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiEdit,
  FiMessageCircle,
  FiFlag,
  FiUserX,
  FiDownload,
  FiEye,
  FiCheck,
  FiTarget,
  FiStar
} from 'react-icons/fi';
import {
  getProjectRoom,
  getProjectTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getProjectMembers,
  inviteDeveloper,
  removeTeamMember,
  createFolder,
  getFolderFiles,
  getProjectFolders,
  uploadFile,
  deleteFile,
  deleteFolder,
  getProjectActivity,
  updateProjectLinks,
  getProjectFeaturesAndGoals,
  addFeature,
  addGoal,
  addPayment,
  approveProject
} from '../../services/projectRoom.service';
import { useAuth } from '../../context/AuthContext';

// ✅ Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white ${bgColor}`}>
      {message}
    </div>
  );
};

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ جلب بيانات المستخدم من الـ Context
  const { user, userType, isAuthenticated } = useAuth();
  
  // eslint-disable-next-line no-unused-vars
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRepoModal, setShowRepoModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: ''
  });
  
  const [inviteData, setInviteData] = useState({
    developerId: '',
    email: '',
    message: ''
  });
  const [repoLink, setRepoLink] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState(null);
  const hasFetched = useRef(false);
  
  // ✅ نظام الملفات
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // ✅ أنشطة المشروع
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ✅ المميزات والأهداف
  const [features, setFeatures] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loadingFeaturesGoals, setLoadingFeaturesGoals] = useState(false);

  // ✅ نموذج الدفع
  const [paymentData, setPaymentData] = useState({
    amount: '',
    walletName: '',
    transferNumber: '',
    wallettype: '',
  });

  // ✅ نموذج الميزة
  const [featureData, setFeatureData] = useState({
    feature: ''
  });

  // ✅ نموذج الهدف
  const [goalData, setGoalData] = useState({
    objective: ''
  });

  // ✅ تحديد دور المستخدم من الـ Context
  const getUserRoleFromContext = () => {
    if (!userType) return 'client';
    if (userType === 'developer') return 'main_developer';
    if (userType === 'client') return 'client';
    return 'assistant_developer';
  };

  const userRoleFromContext = getUserRoleFromContext();
  const isMainDeveloper = userRoleFromContext === 'main_developer';
  const isClient = userRoleFromContext === 'client';
  const isAssistantDeveloper = userRoleFromContext === 'assistant_developer';

  // ✅ الحصول على دور المستخدم للعرض
  const getUserRole = () => {
    if (isMainDeveloper) {
      return {
        label: 'مبرمج رئيسي',
        icon: '👨‍💻',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        textColor: 'text-indigo-700',
        description: '🔑 لديك صلاحية كاملة على المشروع'
      };
    } else if (isClient) {
      return {
        label: 'عميل',
        icon: '👤',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        textColor: 'text-blue-700',
        description: '👀 يمكنك متابعة التقدم وإضافة ملاحظاتك'
      };
    } else {
      return {
        label: 'مبرمج مساعد',
        icon: '👨‍💻',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        textColor: 'text-gray-700',
        description: '🔍 يمكنك فقط مشاهدة المحتوى'
      };
    }
  };

  const userRole = getUserRole();

  // ✅ Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // ✅ دالة مساعدة لاستخراج البيانات من الـ Response
  const extractDataFromResponse = (response) => {
    if (!response) return [];
    
    if (Array.isArray(response)) return response;
    
    if (response.data) {
      if (Array.isArray(response.data)) return response.data;
      if (typeof response.data === 'object') {
        return Object.values(response.data).filter(item => 
          item && typeof item === 'object' && item._id
        );
      }
    }
    
    if (typeof response === 'object') {
      return Object.values(response).filter(item => 
        item && typeof item === 'object' && item._id
      );
    }
    
    return [];
  };

  // ✅ جلب أعضاء الفريق
  const fetchProjectMembers = useCallback(async () => {
    try {
      console.log('📤 Fetching project members for ID:', id);
      const response = await getProjectMembers(id);
      console.log('📥 Members Response:', response);
      
      if (response?.members) {
        const formattedMembers = response.members.map(member => ({
          id: member.idmember?._id || member._id,
          name: member.idmember?.username || member.username || 'مستخدم',
          avatar: member.idmember?.profileImage || member.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
          role: member.role || 'عضو',
          invitedAt: member.invitedAt,
          email: member.idmember?.email || member.email || '',
          isMain: false
        }));
        
        setMembers(formattedMembers);
        
        setProject(prev => ({
          ...prev,
          team: formattedMembers
        }));
      }
    } catch (error) {
      console.error('❌ Error fetching members:', error);
      showToast('حدث خطأ أثناء جلب أعضاء الفريق', 'error');
    }
  }, [id]);

  // ✅ جلب المجلدات
  const fetchFolders = useCallback(async () => {
    try {
      const response = await getProjectFolders(id);
      console.log('📥 Folders Response:', response);
      
      const foldersData = extractDataFromResponse(response);
      console.log('📥 Folders Data:', foldersData);
      setFolders(foldersData);
    } catch (error) {
      console.error('❌ Error fetching folders:', error);
      showToast('حدث خطأ أثناء جلب المجلدات', 'error');
      setFolders([]);
    }
  }, [id]);

  // ✅ جلب ملفات مجلد معين
  const fetchFolderFiles = useCallback(async (folderId) => {
    try {
      setLoadingFiles(true);
      const response = await getFolderFiles(id, folderId);
      console.log('📥 Folder files Response:', response);
      
      const filesData = extractDataFromResponse(response);
      console.log('📥 Files Data:', filesData);
      setCurrentFiles(filesData);
      setCurrentFolder(folderId);
    } catch (error) {
      console.error('❌ Error fetching files:', error);
      showToast('حدث خطأ أثناء جلب الملفات', 'error');
      setCurrentFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  }, [id]);

  // ✅ جلب أنشطة المشروع
  const fetchProjectActivities = useCallback(async () => {
    try {
      setLoadingActivities(true);
      const response = await getProjectActivity(id);
      console.log('📥 Activities Response:', response);
      
      const activitiesData = extractDataFromResponse(response);
      console.log('📥 Activities Data:', activitiesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, [id]);

  // ✅ جلب المميزات والأهداف
  const fetchFeaturesAndGoals = useCallback(async () => {
    try {
      setLoadingFeaturesGoals(true);
      const response = await getProjectFeaturesAndGoals(id);
      console.log('📥 Features & Goals Response:', response);
      
      const data = response?.data || response || {};
      
      // ✅ استخدام feature و objective (الحقول الصحيحة)
      setFeatures(data.feature || data.features || []);
      setGoals(data.objective || data.objectives || []);
      
      console.log('✅ Features:', data.feature || data.features || []);
      console.log('✅ Goals:', data.objective || data.objectives || []);
    } catch (error) {
      console.error('❌ Error fetching features and goals:', error);
      setFeatures([]);
      setGoals([]);
    } finally {
      setLoadingFeaturesGoals(false);
    }
  }, [id]);

  // ✅ جلب بيانات المشروع من الباك اند
  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📤 Fetching project workspace for ID:', id);

      const roomResponse = await getProjectRoom(id);
      console.log('📥 Full Room Response:', roomResponse);

      if (!roomResponse) {
        throw new Error('لم يتم استلام بيانات من الخادم');
      }

      let projectData = null;
      let clientData = null;
      let developerData = null;
      let chatIdData = null;

      if (roomResponse.data) {
        projectData = roomResponse.data.project || roomResponse.data;
        clientData = roomResponse.data.client;
        developerData = roomResponse.data.developer;
        chatIdData = roomResponse.data.chatId;
      } else {
        projectData = roomResponse.project || roomResponse;
        clientData = roomResponse.client;
        developerData = roomResponse.developer;
        chatIdData = roomResponse.chatId;
      }

      console.log('✅ Project Data:', projectData);
      console.log('✅ Chat ID:', chatIdData);

      setChatId(chatIdData);
      setRepoLink(projectData?.githubRepo || '');
      setDemoLink(projectData?.demoUrl || '');

      // ✅ جلب المهام
      let tasksData = [];
      try {
        const tasksResponse = await getProjectTasks(id);
        console.log('📥 Full Tasks Response:', tasksResponse);

        if (tasksResponse) {
          if (tasksResponse.data) {
            if (Array.isArray(tasksResponse.data)) {
              tasksData = tasksResponse.data;
            } else if (tasksResponse.data.tasks) {
              tasksData = tasksResponse.data.tasks;
            } else if (tasksResponse.data.task) {
              tasksData = tasksResponse.data.task;
            } else {
              tasksData = tasksResponse.data;
            }
          } else if (Array.isArray(tasksResponse)) {
            tasksData = tasksResponse;
          } else if (tasksResponse.tasks) {
            tasksData = tasksResponse.tasks;
          } else if (tasksResponse.task) {
            tasksData = tasksResponse.task;
          } else {
            tasksData = tasksResponse;
          }
        }
        
        if (!Array.isArray(tasksData)) {
          tasksData = [];
        }
        
        tasksData = tasksData.map(task => ({
          _id: task._id || task.id,
          title: task.title || 'مهمة بدون عنوان',
          description: task.description || '',
          status: task.status || 'pending',
          dueDate: task.dueDate || '',
          createdAt: task.createdAt || '',
          updatedAt: task.updatedAt || '',
          project: task.project || '',
          createdBy: task.createdBy || ''
        }));
        
      } catch (taskErr) {
        console.warn('⚠️ Could not fetch tasks:', taskErr);
        tasksData = [];
      }

      // ✅ بناء كائن المشروع - استخدم feature و objective
      const formattedProject = {
        _id: projectData?._id || id,
        name: projectData?.projectName || projectData?.name || 'مشروع بدون اسم',
        status: projectData?.status || 'in_progress',
        progress: projectData?.progress || 0,
        description: projectData?.description || projectData?.projectDescription || 'لا يوجد وصف',
        objective: projectData?.objective || projectData?.objectives || [],
        feature: projectData?.feature || projectData?.features || [],
        techStack: projectData?.techStack || projectData?.technologies || [],
        client: {
          _id: clientData?._id || 'client123',
          name: clientData?.username || clientData?.name || 'عميل',
          avatar: clientData?.profileImage || clientData?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
          email: clientData?.email || ''
        },
        developer: {
          _id: developerData?._id || 'dev456',
          name: developerData?.username || developerData?.name || 'مبرمج رئيسي',
          avatar: developerData?.profileImage || developerData?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          email: developerData?.email || '',
          isMain: true
        },
        startDate: projectData?.startDate || projectData?.createdAt || new Date().toISOString(),
        deadline: projectData?.dueDate || projectData?.deadline || projectData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget: projectData?.budget || projectData?.amount || 0,
        paidAmount: projectData?.paidAmount || projectData?.paid || 0,
        githubRepo: projectData?.githubRepo || '',
        demoUrl: projectData?.demoUrl || '',
        team: [
          { 
            _id: developerData?._id || 'dev456',
            name: developerData?.username || 'مبرمج رئيسي', 
            role: 'مطور رئيسي', 
            online: true, 
            avatar: developerData?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
            email: developerData?.email || '',
            isMain: true
          }
        ],
        milestones: tasksData,
        files: projectData?.files || [],
        payments: projectData?.payments || [],
        transactions: projectData?.transactions || [],
        activity: projectData?.activity || []
      };

      setProject(formattedProject);
      setTasks(tasksData);

      await fetchProjectMembers();
      await fetchFolders();
      await fetchProjectActivities();
      await fetchFeaturesAndGoals();

    } catch (err) {
      console.error('❌ Error fetching project data:', err);
      
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('ليس لديك صلاحية للوصول إلى هذا المشروع');
      } else if (err.response?.status === 404) {
        setError('المشروع غير موجود');
      } else {
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء تحميل بيانات المشروع');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, fetchProjectMembers, fetchFolders, fetchProjectActivities, fetchFeaturesAndGoals]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProjectData();
    }
  }, [fetchProjectData]);
  const getPaymentStatusColor = (status) => {
  const map = {
    'paid': 'bg-green-100 text-green-700 border-green-200',
    'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'failed': 'bg-red-100 text-red-700 border-red-200'
  };
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};


const getPaymentStatusText = (status) => {
  const map = {
    'paid': 'مدفوع ✅',
    'pending': 'قيد الانتظار ⏳',
    'failed': 'فشل ❌'
  };
  return map[status] || status || 'غير معروف';
};

const getWalletTypeLabel = (type) => {
  const map = {
    'vodafone_cash': '📱 فودافون كاش',
    'instapay': '💳 إنستا باي',
    'etisalat_cash': '📱 اتصالات كاش',
    'orange_cash': '📱 اورنج كاش'
  };
  return map[type] || type || 'غير محدد';
};

// ✅ تحميل وصل الدفعة (PDF/صورة)
const handleDownloadReceipt = async (payment) => {
  try {
    showToast('⏳ جاري إنشاء الوصل...', 'info');

    // ✅ استخدم تاريخ ثابت من payment أو التاريخ الحالي
    const timestamp = payment.createdAt || new Date().toISOString();
    const invoiceNumber = payment._id ;

    // ✅ إنشاء عنصر HTML للوصل
    const receiptHTML = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>وصل الدفعة</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          .receipt {
            background: white;
            max-width: 500px;
            width: 100%;
            border-radius: 24px;
            padding: 40px 35px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px dashed #e2e8f0;
            padding-bottom: 25px;
            margin-bottom: 25px;
          }
          .receipt-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
          }
          .receipt-header .subtitle {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 4px;
          }
          .receipt-logo {
            font-size: 32px;
            font-weight: 800;
            color: #4f46e5;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .receipt-logo span {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 4px 14px;
            border-radius: 10px;
            font-size: 14px;
          }
          .receipt-status {
            display: inline-block;
            padding: 6px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 12px;
          }
          .status-paid { background: #dcfce7; color: #16a34a; }
          .status-pending { background: #fef9c3; color: #ca8a04; }
          .status-failed { background: #fee2e2; color: #dc2626; }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .receipt-row:last-child { border-bottom: none; }
          .receipt-label { color: #64748b; font-size: 14px; }
          .receipt-value { color: #0f172a; font-size: 14px; font-weight: 500; }
          .receipt-amount { font-size: 24px; font-weight: 700; color: #4f46e5; }
          .receipt-footer {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px dashed #e2e8f0;
            text-align: center;
          }
          .receipt-footer .company {
            font-size: 18px;
            font-weight: 700;
            color: #4f46e5;
          }
          .receipt-footer .company span {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 2px 12px;
            border-radius: 6px;
            font-size: 12px;
          }
          .receipt-footer .thanks { color: #94a3b8; font-size: 13px; margin-top: 6px; }
          .receipt-footer .powered { color: #cbd5e1; font-size: 11px; margin-top: 8px; }
          @media print {
            body { background: white; padding: 0; }
            .receipt { box-shadow: none; border: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt" id="receipt">
          <div class="receipt-header">
            <div class="receipt-logo">
              DevHire
              <span>💼</span>
            </div>
            <h1>وصل الدفعة</h1>
            <p class="subtitle">#${invoiceNumber}</p>
            <div class="receipt-status ${payment.status === 'paid' ? 'status-paid' : payment.status === 'failed' ? 'status-failed' : 'status-pending'}">
              ${payment.status === 'paid' ? '✅ مدفوع' : payment.status === 'failed' ? '❌ فشل' : '⏳ قيد الانتظار'}
            </div>
          </div>

          <div class="receipt-body">
            <div class="receipt-row">
              <span class="receipt-label">📅 التاريخ</span>
              <span class="receipt-value">${new Date(timestamp).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">💰 المبلغ</span>
              <span class="receipt-value receipt-amount">$${payment.amount?.toLocaleString() || 0}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">🏦 نوع المحفظة</span>
              <span class="receipt-value">${getWalletTypeLabel(payment.typewallet)}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">👤 صاحب المحفظة</span>
              <span class="receipt-value">${payment.namePayment || 'غير محدد'}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">📱 رقم المحفظة</span>
              <span class="receipt-value">${payment.transferNumber || 'غير محدد'}</span>
            </div>
           
            <div class="receipt-row">
              <span class="receipt-label">📋 الحالة</span>
              <span class="receipt-value">${getPaymentStatusText(payment.status)}</span>
            </div>
          </div>

          <div class="receipt-footer">
            <div class="company">
              DevHire <span>💼</span>
            </div>
            <p class="thanks">شكراً لثقتكم بنا 🙏</p>
            <p class="powered">تم إنشاء هذا الوصل بواسطة DevHire</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ✅ إنشاء Blob من HTML
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // ✅ فتح في نافذة جديدة للطباعة/الحفظ
    const printWindow = window.open(url, '_blank', 'width=600,height=800');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };
    } else {
      // ✅ لو النافذة منفتحتش، نستخدم طريقة تانية
      const link = document.createElement('a');
      link.href = url;
      link.download = `وصل_الدفعة_${invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    showToast('✅ تم إنشاء الوصل بنجاح', 'success');

  } catch (error) {
    console.error('❌ Error generating receipt:', error);
    showToast('حدث خطأ أثناء إنشاء الوصل', 'error');
  }
};
  // ✅ إنشاء مهمة جديدة - فقط للمبرمج الرئيسي
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه إضافة مراحل', 'error');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await createTask({
        projectId: id,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate
      });

      console.log('✅ Task created:', response);
      showToast('✅ تم إنشاء المرحلة بنجاح');

      const tasksResponse = await getProjectTasks(id);
      let tasksData = [];
      
      if (tasksResponse) {
        if (tasksResponse.data) {
          if (Array.isArray(tasksResponse.data)) {
            tasksData = tasksResponse.data;
          } else if (tasksResponse.data.tasks) {
            tasksData = tasksResponse.data.tasks;
          } else if (tasksResponse.data.task) {
            tasksData = tasksResponse.data.task;
          } else {
            tasksData = tasksResponse.data;
          }
        } else if (Array.isArray(tasksResponse)) {
          tasksData = tasksResponse;
        } else if (tasksResponse.tasks) {
          tasksData = tasksResponse.tasks;
        } else if (tasksResponse.task) {
          tasksData = tasksResponse.task;
        } else {
          tasksData = tasksResponse;
        }
      }
      
      if (!Array.isArray(tasksData)) {
        tasksData = [];
      }
      
      tasksData = tasksData.map(task => ({
        _id: task._id || task.id,
        title: task.title || 'مهمة بدون عنوان',
        description: task.description || '',
        status: task.status || 'pending',
        dueDate: task.dueDate || '',
        createdAt: task.createdAt || '',
        updatedAt: task.updatedAt || '',
        project: task.project || '',
        createdBy: task.createdBy || ''
      }));
      
      setTasks(tasksData);
      setProject(prev => ({ ...prev, milestones: tasksData }));

      if (response?.data?.progress !== undefined) {
        setProject(prev => ({ ...prev, progress: response.data.progress }));
      } else if (response?.progress !== undefined) {
        setProject(prev => ({ ...prev, progress: response.progress }));
      }

      setShowAddTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '' });

    } catch (error) {
      console.error('❌ Error creating task:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إنشاء المرحلة', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ تحديث حالة المهمة - فقط للمبرمج الرئيسي
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه تحديث حالة المراحل', 'error');
      return;
    }
    
    try {
      const response = await updateTaskStatus(taskId, newStatus);
      console.log('✅ Task status updated:', response);

      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      setProject(prev => ({ ...prev, milestones: updatedTasks }));

      if (response?.data?.progress !== undefined) {
        setProject(prev => ({ ...prev, progress: response.data.progress }));
      } else if (response?.progress !== undefined) {
        setProject(prev => ({ ...prev, progress: response.progress }));
      }

      showToast('✅ تم تحديث حالة المرحلة', 'success');

    } catch (error) {
      console.error('❌ Error updating task:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء تحديث المرحلة', 'error');
    }
  };

  // ✅ حذف مهمة - فقط للمبرمج الرئيسي
  const handleDeleteTask = async (taskId) => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه حذف المراحل', 'error');
      return;
    }
    
    if (!window.confirm('هل أنت متأكد من حذف هذه المرحلة؟')) return;

    try {
      await deleteTask(taskId);
      console.log('✅ Task deleted');

      const remainingTasks = tasks.filter(task => task._id !== taskId);
      setTasks(remainingTasks);
      setProject(prev => ({ ...prev, milestones: remainingTasks }));

      const completed = remainingTasks.filter(t => t.status === 'completed').length;
      const total = remainingTasks.length;
      const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
      setProject(prev => ({ ...prev, progress: newProgress }));

      showToast('✅ تم حذف المرحلة بنجاح', 'success');

    } catch (error) {
      console.error('❌ Error deleting task:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء حذف المرحلة', 'error');
    }
  };

  // ✅ إضافة عضو جديد للفريق - فقط للمبرمج الرئيسي
  const handleAddMember = (e) => {
    e.preventDefault();
    
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه إضافة أعضاء', 'error');
      return;
    }
    
    if (!newMember.name.trim()) {
      showToast('يرجى إدخال اسم العضو', 'error');
      return;
    }

    const member = {
      _id: 'member-' + Date.now(),
      name: newMember.name,
      role: newMember.role || 'عضو فريق',
      online: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=4F46E5&color=fff&size=100`,
      email: newMember.email || '',
      isMain: false
    };

    setProject(prev => ({
      ...prev,
      team: [...prev.team, member]
    }));

    showToast(`✅ تم إضافة ${member.name} إلى الفريق`, 'success');
    setNewMember({ name: '', role: '', email: '' });
    setShowAddMemberModal(false);
  };

  // ✅ حذف عضو من الفريق - فقط للمبرمج الرئيسي
  const handleRemoveMember = async (memberId) => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه حذف أعضاء', 'error');
      return;
    }
    
    if (!memberId) {
      showToast('⚠️ لا يمكن حذف هذا العضو، معرف غير موجود', 'error');
      return;
    }
    
    const member = project?.team?.find(m => {
      const id = m._id || m.id || m.idmember?._id;
      return id === memberId;
    });
    const memberName = member?.name || 'هذا العضو';
    
    if (!window.confirm(`⚠️ هل أنت متأكد من حذف "${memberName}" من الفريق؟`)) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await removeTeamMember(id, memberId);
      console.log('✅ Member removed:', response);
      
      setProject(prev => ({
        ...prev,
        team: prev.team.filter(member => {
          const memberIdCompare = member._id || member.id || member.idmember?._id;
          return memberIdCompare !== memberId;
        })
      }));
      
      setMembers(prev => prev.filter(member => {
        const memberIdCompare = member._id || member.id || member.idmember?._id;
        return memberIdCompare !== memberId;
      }));
      
      showToast(`✅ تم حذف "${memberName}" من الفريق بنجاح`, 'success');
      
      await fetchProjectMembers();
      
    } catch (error) {
      console.error('❌ Error removing member:', error);
      showToast(
        error.response?.data?.message || 'حدث خطأ أثناء حذف العضو', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ إرسال دعوة لمبرمج - فقط للمبرمج الرئيسي
  const handleSendInvite = async (e) => {
    e.preventDefault();
    
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه إرسال دعوات', 'error');
      return;
    }
    
    if (!inviteData.developerId && !inviteData.email) {
      showToast('يرجى إدخال معرف المبرمج أو البريد الإلكتروني', 'error');
      return;
    }
    
    setInviting(true);
    
    try {
      const response = await inviteDeveloper(id, inviteData.developerId || inviteData.email);
      console.log('✅ Invite sent:', response);
      
      showToast('✅ تم إرسال الدعوة بنجاح', 'success');
      
      await fetchProjectMembers();
      
      setShowInviteModal(false);
      setInviteData({ developerId: '', email: '', message: '' });
      
    } catch (error) {
      console.error('❌ Error sending invite:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إرسال الدعوة', 'error');
    } finally {
      setInviting(false);
    }
  };

  // ✅ إنشاء مجلد جديد - فقط للمبرمج الرئيسي
  const handleCreateFolder = async () => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه إنشاء مجلدات', 'error');
      return;
    }

    if (!newFolderName.trim()) {
      showToast('يرجى إدخال اسم المجلد', 'error');
      return;
    }

    try {
      const response = await createFolder(id, newFolderName.trim());
      console.log('✅ Folder created:', response);
      showToast('✅ تم إنشاء المجلد بنجاح', 'success');
      setNewFolderName('');
      setShowCreateFolderModal(false);
      await fetchFolders();
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error creating folder:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إنشاء المجلد', 'error');
    }
  };

  // ✅ رفع ملف - فقط للمبرمج الرئيسي
  const handleUploadFile = async () => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه رفع ملفات', 'error');
      return;
    }

    if (!selectedFile) {
      showToast('يرجى اختيار ملف', 'error');
      return;
    }

    if (!currentFolder) {
      showToast('يرجى اختيار مجلد أولاً', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadFile(id, currentFolder, selectedFile);
      console.log('✅ File uploaded:', response);
      showToast('✅ تم رفع الملف بنجاح', 'success');
      setSelectedFile(null);
      setShowUploadModal(false);
      await fetchFolderFiles(currentFolder);
      await fetchFolders();
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء رفع الملف', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ✅ حذف ملف - فقط للمبرمج الرئيسي
  const handleDeleteFile = async (fileId, fileName) => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه حذف ملفات', 'error');
      return;
    }

    if (!window.confirm(`⚠️ هل أنت متأكد من حذف "${fileName}"؟`)) return;

    try {
      await deleteFile(id, fileId);
      showToast('✅ تم حذف الملف بنجاح', 'success');
      await fetchFolderFiles(currentFolder);
      await fetchFolders();
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء حذف الملف', 'error');
    }
  };

  // ✅ حذف مجلد - فقط للمبرمج الرئيسي
  const handleDeleteFolder = async (folderId, folderName) => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه حذف مجلدات', 'error');
      return;
    }

    if (!window.confirm(`⚠️ هل أنت متأكد من حذف المجلد "${folderName}" وجميع محتوياته؟`)) return;

    try {
      await deleteFolder(id, folderId);
      showToast('✅ تم حذف المجلد بنجاح', 'success');
      if (currentFolder === folderId) {
        setCurrentFolder(null);
        setCurrentFiles([]);
      }
      await fetchFolders();
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error deleting folder:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء حذف المجلد', 'error');
    }
  };

  // ✅ حفظ روابط المشروع - فقط للمبرمج الرئيسي
  const handleSaveLinks = async () => {
    if (!isMainDeveloper) {
      showToast('⚠️ فقط المبرمج الرئيسي يمكنه تعديل الروابط', 'error');
      return;
    }

    if (!repoLink.trim() || !demoLink.trim()) {
      showToast('يرجى إدخال جميع الروابط', 'error');
      return;
    }

    try {
      const response = await updateProjectLinks(id, { 
        githubRepo: repoLink.trim(),
        demoUrl: demoLink.trim()
      });
      
      console.log('✅ Links updated:', response);
      
      setProject(prev => ({ 
        ...prev, 
        githubRepo: repoLink.trim(),
        demoUrl: demoLink.trim()
      }));
      
      setShowRepoModal(false);
      setShowDemoModal(false);
      
      showToast('✅ تم حفظ الروابط بنجاح', 'success');
      
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error saving links:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء حفظ الروابط', 'error');
    }
  };

  // ✅ فتح المحادثة
  const handleOpenChat = () => {
    if (!chatId) {
      showToast('⚠️ لا يمكن فتح المحادثة، معرف الشات غير موجود', 'error');
      return;
    }
    navigate(`/messages`);
  };

  // ✅ تحميل الملف - في نفس الصفحة
  const handleDownloadFile = (file) => {
    const fileUrl = file?.url || file?.fileUrl || file?.secure_url || file?.link || file?.path || file?.publicUrl;
    
    if (!fileUrl) {
      showToast('⚠️ رابط الملف غير متوفر', 'error');
      console.log('❌ File object:', file);
      return;
    }
    
    console.log('📥 Downloading file from:', fileUrl);
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name || file.originalName || 'file';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ معاينة الملف
  const handlePreviewFile = (file) => {
    const fileUrl = file?.url || file?.fileUrl || file?.secure_url || file?.link || file?.path || file?.publicUrl;
    
    if (!fileUrl) {
      showToast('⚠️ رابط الملف غير متوفر', 'error');
      console.log('❌ File object:', file);
      return;
    }
    
    console.log('📥 Previewing file from:', fileUrl);
    window.open(fileUrl, '_blank');
  };

  // ==================== دوال العميل ====================

const handleApproveProject = async () => {
  // ✅ التحقق من صلاحية المستخدم (عميل فقط)
  if (!isClient) {
    showToast('⚠️ فقط العميل يمكنه الموافقة على المشروع', 'error');
    return;
  }

  // ✅ التحقق من نسبة الإنجاز (شرط 100%)
  if (project?.progress < 100) {
    showToast(`⚠️ لا يمكن الموافقة على المشروع إلا بعد اكتمال 100% من التقدم (التقدم الحالي: ${project?.progress}%)`, 'error');
    return;
  }

  // ✅ تأكيد الموافقة
  if (!window.confirm('⚠️ هل أنت متأكد من الموافقة على المشروع؟\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه.')) {
    return;
  }

  // ✅ بدء التحميل
  setSubmitting(true);

  try {
    // ✅ استدعاء API الموافقة على المشروع
    const response = await approveProject(project._id);
    console.log('✅ Project approved:', response);

    // ✅ تحديث حالة المشروع محلياً
    setProject(prev => ({ 
      ...prev, 
      status: 'approved',
      approvedAt: new Date().toISOString()
    }));

    // ✅ عرض رسالة نجاح
    showToast('🎉 تمت الموافقة على المشروع بنجاح!', 'success');

    // ✅ تحديث الأنشطة
    await fetchProjectActivities();

  } catch (error) {
    console.error('❌ Error approving project:', error);
    showToast(
      error.response?.data?.message || 'حدث خطأ أثناء الموافقة على المشروع', 
      'error'
    );
  } finally {
    setSubmitting(false);
  }
};
  // ✅ إضافة دفعة جديدة - للعميل فقط
  const handleAddPayment = async () => {
    if (!isClient) {
      showToast('⚠️ فقط العميل يمكنه إضافة دفعات', 'error');
      return;
    }

    // ✅ التحقق من صحة البيانات
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      showToast('⚠️ يرجى إدخال مبلغ صحيح', 'error');
      return;
    }

    if (!paymentData.wallettype) {
      showToast('⚠️ يرجى اختيار نوع المحفظة', 'error');
      return;
    }

    if (!paymentData.walletName.trim()) {
      showToast('⚠️ يرجى إدخال اسم صاحب المحفظة', 'error');
      return;
    }

    if (!paymentData.transferNumber || paymentData.transferNumber.length !== 11) {
      showToast('⚠️ يرجى إدخال رقم محفظة صحيح مكون من 11 رقم', 'error');
      return;
    }

   const phoneRegex = /^01[0125][0-9]{8}$/; // 01 + (0,1,2,5) + 8 أرقام

if (!phoneRegex.test(paymentData.transferNumber)) {
  showToast('⚠️ رقم المحفظة غير صحيح، يجب أن يبدأ بـ 010، 011، 012، أو 015 ويتكون من 11 رقم', 'error');
  return;
}

    setSubmitting(true);

    try {
      const response = await addPayment(id, {
        amount: parseFloat(paymentData.amount),
        type: paymentData.wallettype,
        name: paymentData.walletName.trim(),
        phone: paymentData.transferNumber,
      });

      console.log('✅ Payment added:', response);
      showToast('✅ تم إضافة الدفعة بنجاح', 'success');

      // ✅ تحديث بيانات المشروع
      const updatedProject = response?.data?.project || response?.project || response?.data;
      if (updatedProject) {
        setProject(prev => ({ ...prev, ...updatedProject }));
      }

      // ✅ إعادة تعيين النموذج
      setPaymentData({
        amount: '',
        walletName: '',
        transferNumber: '',
        wallettype: ''
      });
      setShowPaymentModal(false);
      
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error adding payment:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إضافة الدفعة', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ إضافة مميزات جديدة - للعميل فقط
  const handleAddFeature = async () => {
    if (!isClient) {
      showToast('⚠️ فقط العميل يمكنه إضافة مميزات', 'error');
      return;
    }

    if (!featureData.feature.trim()) {
      showToast('⚠️ يرجى إدخال الميزة', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await addFeature(id, {
        feature: featureData.feature.trim()
      });

      console.log('✅ Feature added:', response);
      showToast('✅ تم إضافة الميزة بنجاح', 'success');

      const newFeature = response?.data?.feature || response?.feature || response?.data;
      if (newFeature) {
        setFeatures(prev => [...prev, newFeature]);
      }

      setFeatureData({ feature: '' });
      setShowFeatureModal(false);
      
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error adding feature:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إضافة الميزة', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ إضافة أهداف جديدة - للعميل فقط
  const handleAddGoal = async () => {
    if (!isClient) {
      showToast('⚠️ فقط العميل يمكنه إضافة أهداف', 'error');
      return;
    }

    if (!goalData.objective.trim()) {
      showToast('⚠️ يرجى إدخال الهدف', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await addGoal(id, {
        objective: goalData.objective.trim()
      });

      console.log('✅ Goal added:', response);
      showToast('✅ تم إضافة الهدف بنجاح', 'success');

      const newGoal = response?.data?.goal || response?.goal || response?.data;
      if (newGoal) {
        setGoals(prev => [...prev, newGoal]);
      }

      setGoalData({ objective: '' });
      setShowGoalModal(false);
      
      await fetchProjectActivities();
    } catch (error) {
      console.error('❌ Error adding goal:', error);
      showToast(error.response?.data?.message || 'حدث خطأ أثناء إضافة الهدف', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== دوال عرض الأنشطة ====================

  // ✅ تنسيق الوقت النسبي
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    if (diffWeeks < 4) return `منذ ${diffWeeks} أسبوع`;
    if (diffMonths < 12) return `منذ ${diffMonths} شهر`;
    return `منذ ${diffYears} سنة`;
  };

  // ✅ الحصول على أيقونة النشاط
  const getActivityIcon = (action) => {
    const icons = {
      'project_created': FiHome,
      'project_updated': FiEdit,
      'member_added': FiUserPlus,
      'member_removed': FiUserX,
      'folder_created': FiFolder,
      'folder_deleted': FiTrash2,
      'file_uploaded': FiUpload,
      'file_deleted': FiTrash2,
      'task_created': FiCheckCircle,
      'task_deleted': FiTrash2,
      'payment_added': FiDollarSign,
      'payment_paid': FiDollarSign,
      'payment_updated': FiEdit,
      'payment_deleted': FiTrash2,
      'status_changed': FiAlertCircle,
      'milestone_created': FiFlag,
      'milestone_completed': FiCheckCircle,
      'message_sent': FiMessageCircle
    };
    return icons[action] || FiActivity;
  };

  // ✅ الحصول على لون النشاط
  const getActivityColor = (action) => {
    const colors = {
      'project_created': 'text-indigo-600 bg-indigo-50',
      'project_updated': 'text-blue-600 bg-blue-50',
      'member_added': 'text-orange-600 bg-orange-50',
      'member_removed': 'text-red-600 bg-red-50',
      'folder_created': 'text-purple-600 bg-purple-50',
      'folder_deleted': 'text-red-600 bg-red-50',
      'file_uploaded': 'text-blue-600 bg-blue-50',
      'file_deleted': 'text-red-600 bg-red-50',
      'task_created': 'text-green-600 bg-green-50',
      'task_deleted': 'text-red-600 bg-red-50',
      'payment_added': 'text-yellow-600 bg-yellow-50',
      'payment_paid': 'text-green-600 bg-green-50',
      'payment_updated': 'text-yellow-600 bg-yellow-50',
      'payment_deleted': 'text-red-600 bg-red-50',
      'status_changed': 'text-indigo-600 bg-indigo-50',
      'milestone_created': 'text-purple-600 bg-purple-50',
      'milestone_completed': 'text-green-600 bg-green-50',
      'message_sent': 'text-pink-600 bg-pink-50'
    };
    return colors[action] || 'text-gray-600 bg-gray-50';
  };

  // ✅ الحصول على وصف النشاط
  const getActivityDescription = (activity) => {
    const { action, user, metadata } = activity;
    const username = user?.username || 'مستخدم';

    switch (action) {
      case 'project_created':
        return `قام ${username} بإنشاء المشروع`;
      
      case 'project_updated':
        return `قام ${username} بتحديث بيانات المشروع`;
      
      case 'member_added':
        return `قام ${username} بإضافة عضو جديد: ${metadata?.memberName || 'عضو'} (${metadata?.role || 'بدون دور'})`;
      
      case 'member_removed':
        return `قام ${username} بحذف عضو من المشروع`;
      
      case 'folder_created':
        return `قام ${username} بإنشاء مجلد جديد: "${metadata?.folderName || 'مجلد'}"`;
      
      case 'folder_deleted':
        return `قام ${username} بحذف المجلد "${metadata?.folderName || 'مجلد'}"`;
      
      case 'file_uploaded':
        return `قام ${username} برفع ملف: "${metadata?.fileName || 'ملف'}" داخل "${metadata?.folderName || 'مجلد'}"`;
      
      case 'file_deleted':
        return `قام ${username} بحذف الملف "${metadata?.fileName || 'ملف'}"`;
      
      case 'task_created':
        return `قام ${username} بإنشاء مهمة جديدة: "${metadata?.taskTitle || 'مهمة'}"`;
      
      case 'task_deleted':
        return `قام ${username} بحذف المهمة "${metadata?.taskTitle || 'مهمة'}"`;
      
      case 'payment_added':
        return `قام ${username} بإضافة دفعة جديدة: "${metadata?.title || 'دفعة'}" بقيمة $${metadata?.amount || 0}`;
      
      case 'payment_paid':
        return `تم دفع الدفعة "${metadata?.title || 'دفعة'}" بقيمة $${metadata?.amount || 0}`;
      
      case 'payment_updated':
        return `قام ${username} بتعديل الدفعة "${metadata?.title || 'دفعة'}"`;
      
      case 'payment_deleted':
        return `قام ${username} بحذف الدفعة "${metadata?.title || 'دفعة'}"`;
      
      case 'status_changed':
        return `قام ${username} بتغيير حالة المشروع من "${metadata?.oldStatus || '?'}" إلى "${metadata?.newStatus || '?'}"`;
      
      case 'milestone_created':
        return `قام ${username} بإنشاء مرحلة جديدة: "${metadata?.milestoneName || 'مرحلة'}"`;
      
      case 'milestone_completed':
        return `قام ${username} بإكمال المرحلة "${metadata?.milestoneName || 'مرحلة'}"`;
         case 'feature_created':
        return `قام ${username} باضافة ميزة جديد `;
      
      case 'Objective_created':
        return `قام ${username} باضافة هدف جديد `;
         case 'clientApproved':
        return `قام ${username} العميل وافق علي المشروع `;
      
      default:
        return `قام ${username} بـ ${action}`;
    }
  };

  // وظائف مساعدة
  const formatDate = (date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return date;
    }
  };

  const getStatusColor = (status) => {
    const map = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'paid': 'bg-green-100 text-green-700 border-green-200',
      'unpaid': 'bg-red-100 text-red-700 border-red-200',
      'todo': 'bg-gray-100 text-gray-700 border-gray-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'accepted': 'bg-green-100 text-green-700 border-green-200',
      'approved': 'bg-green-100 text-green-700 border-green-200'
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = (status) => {
    const map = {
      'completed': 'مكتمل ✅',
      'in_progress': 'قيد التنفيذ 🔄',
      'pending': 'قيد الانتظار ⏳',
      'paid': 'مدفوع',
      'unpaid': 'غير مدفوع',
      'todo': 'قيد الانتظار',
      'rejected': 'مرفوض',
      'accepted': 'مقبول',
      'approved': 'موافق عليه ✅'
    };
    return map[status] || status;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const remainingDays = project ? Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  const getTimeProgress = () => {
    if (!project?.startDate || !project?.deadline) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.deadline);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const timeProgress = getTimeProgress();

  const getRiskStatus = () => {
    if (timeProgress < 50) {
      return { 
        level: 'منخفض', 
        color: 'bg-green-50 border-green-200', 
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        message: 'المشروع يسير حسب الخطة',
        icon: '🟢'
      };
    } else if (timeProgress >= 50 && timeProgress < 80) {
      return { 
        level: 'متوسط', 
        color: 'bg-yellow-50 border-yellow-200', 
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        message: 'نصف الوقت تقريباً، يرجى مراجعة التقدم',
        icon: '🟡'
      };
    } else {
      return { 
        level: 'مرتفع', 
        color: 'bg-red-50 border-red-200', 
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        message: 'الوقت المتبقي أقل من 20%، يرجى الإسراع',
        icon: '🔴'
      };
    }
  };

  const riskStatus = getRiskStatus();

  const getTaskCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  // ✅ عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل المشروع...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ عرض الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => {
                hasFetched.current = false;
                fetchProjectData();
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              إعادة المحاولة 🔄
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ لو مفيش بيانات
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">المشروع غير موجود</h3>
            <button
              onClick={() => navigate('/dashboard/developer/projects')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              العودة للمشاريع
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ التابات
  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: FiHome },
    { id: 'milestones', label: 'المراحل', icon: FiClock },
    { id: 'files', label: 'الملفات', icon: FiFolder },
    { id: 'payments', label: 'المدفوعات', icon: FiDollarSign },
    { id: 'activity', label: 'النشاط', icon: FiActivity }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      <Toast message={toast?.message} type={toast?.type} onClose={closeToast} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="hover:text-gray-700 cursor-pointer transition">لوحة التحكم</span>
          <span>/</span>
          <span className="hover:text-gray-700 cursor-pointer transition">المشاريع</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${userRole.color}`}>
                      {userRole.icon} {userRole.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project?.status)}`}>
                      {getStatusText(project?.status)}
                    </span>
                    <span className="text-gray-500 text-sm">📅 {formatDate(project?.startDate)}</span>
                    <span className="text-gray-500 text-sm">⏰ {remainingDays > 0 ? `${remainingDays} يوم متبقي` : 'انتهى الوقت'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                      <circle
                        cx="32" cy="32" r="28"
                        stroke="#4F46E5"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={175.93}
                        strokeDashoffset={175.93 - (project?.progress / 100) * 175.93}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-bold ${getProgressColor(project?.progress)}`}>
                        {project?.progress}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">التقدم</p>
                    <p className="text-gray-900 font-bold text-lg">{project?.progress}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-gray-500 text-xs">الميزانية</p>
                  <p className="text-gray-900 font-semibold">${project?.budget?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">المدفوع</p>
                  <p className="text-green-600 font-semibold">${project?.paidAmount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">المتبقي</p>
                  <p className="text-yellow-600 font-semibold">${(project?.budget - project?.paidAmount)?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">العميل</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={project?.client?.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-gray-900 text-sm">{project?.client?.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex overflow-x-auto border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                        isActive
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-gray-900 font-semibold mb-3">📝 وصف المشروع</h3>
                        <p className="text-gray-600 leading-relaxed">{project?.description || 'لا يوجد وصف'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-500 text-sm font-medium mb-2">🎯 الأهداف</p>
                            <ul className="space-y-1">
                              {(project?.objective && project.objective.length > 0 ? project.objective : ['لا توجد أهداف']).map((obj, i) => (
                                <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                  {obj}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm font-medium mb-2">⚡ المميزات</p>
                            <ul className="space-y-1">
                              {(project?.feature && project.feature.length > 0 ? project.feature : ['لا توجد مميزات']).map((feature, i) => (
                                <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-gray-900 font-semibold mb-3">💻 التقنيات المستخدمة</h3>
                        <div className="flex flex-wrap gap-2">
                          {(project?.techStack && project.techStack.length > 0 ? project.techStack : ['JavaScript', 'React']).map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-900 font-semibold">📦 المستودع</h3>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-200">خاص</span>
                          </div>
                          {project?.githubRepo ? (
                            <a
                              href={project.githubRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
                            >
                              <FiGithub className="w-4 h-4" />
                              <span className="text-sm truncate">{project.githubRepo}</span>
                              <FiExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <p className="text-gray-400 text-sm">لا يوجد مستودع</p>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-gray-900 font-semibold">🌐 العرض التجريبي</h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">نشط</span>
                          </div>
                          {project?.demoUrl ? (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              <span className="text-sm">فتح العرض التجريبي</span>
                            </a>
                          ) : (
                            <p className="text-gray-400 text-sm">لا يوجد عرض تجريبي</p>
                          )}
                          <p className="text-gray-400 text-xs mt-2">بيئة: Production</p>
                        </div>
                      </div>

                      {/* ✅ فريق العمل - مع المطور الرئيسي */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-gray-900 font-semibold">👥 فريق العمل</h3>
                          {isMainDeveloper && (
                            <button
                              onClick={() => setShowAddMemberModal(true)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-1"
                            >
                              <FiUserPlus className="w-4 h-4" />
                              إضافة عضو
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {project?.developer && (
                            <div className="bg-indigo-50 rounded-xl p-4 text-center border-2 border-indigo-300 relative">
                              <img 
                                src={project.developer.avatar} 
                                alt={project.developer.name} 
                                className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-indigo-500" 
                              />
                              <p className="text-gray-900 text-sm font-semibold">{project.developer.name}</p>
                              <p className="text-gray-500 text-xs">{project.developer.role || 'مطور رئيسي'}</p>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                  <FiShield className="w-3 h-3" />
                                  رئيسي
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {project?.team?.filter(m => !m.isMain).map((member, i) => {
                            const memberId = member._id || member.id || member.idmember?._id;
                            return (
                              <div key={i} className="bg-white rounded-xl p-4 text-center border border-gray-200 relative group">
                                {isMainDeveloper && memberId && (
                                  <button
                                    onClick={() => {
                                      if (memberId) {
                                        handleRemoveMember(memberId);
                                      } else {
                                        showToast('⚠️ لا يمكن حذف هذا العضو، معرف غير موجود', 'error');
                                      }
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                                    title="حذف العضو"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                )}
                                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full mx-auto mb-2" />
                                <p className="text-gray-900 text-sm font-medium">{member.name}</p>
                                <p className="text-gray-500 text-xs">{member.role}</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* إحصائيات المراحل */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-green-600">{getTaskCount('completed')}</p>
                          <p className="text-gray-500 text-xs">مكتمل</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-blue-600">{getTaskCount('in_progress')}</p>
                          <p className="text-gray-500 text-xs">قيد التنفيذ</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-yellow-600">{getTaskCount('pending')}</p>
                          <p className="text-gray-500 text-xs">قيد الانتظار</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-indigo-600">{tasks.length}</p>
                          <p className="text-gray-500 text-xs">إجمالي المراحل</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-indigo-600">{project?.progress || 0}%</p>
                          <p className="text-gray-500 text-xs">نسبة الإنجاز</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-2xl font-bold text-purple-600">{remainingDays > 0 ? remainingDays : 0}d</p>
                          <p className="text-gray-500 text-xs">متبقي</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Milestones Tab */}
                  {activeTab === 'milestones' && (
                    <motion.div
                      key="milestones"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {isMainDeveloper && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm flex items-center gap-2"
                          >
                            <span>➕</span>
                            إضافة مرحلة
                          </button>
                        </div>
                      )}

                      {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                          <div key={task._id || index} className="relative">
                            {index < tasks.length - 1 && (
                              <div className="absolute right-6 top-14 bottom-0 w-0.5 bg-indigo-200" />
                            )}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition">
                              <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    task.status === 'completed' ? 'bg-green-100 text-green-600' :
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                    'bg-yellow-100 text-yellow-600'
                                  }`}>
                                    {task.status === 'completed' ? '✓' : 
                                     task.status === 'in_progress' ? '🔄' : '⏳'}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-gray-900 font-semibold">{task.title}</h4>
                                    <p className="text-gray-500 text-sm">{task.description || 'لا يوجد وصف'}</p>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                      <span className="text-gray-500 text-sm">📅 {formatDate(task.dueDate)}</span>
                                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(task.status)}`}>
                                        {getStatusText(task.status)}
                                      </span>
                                      {isMainDeveloper ? (
                                        <select
                                          value={task.status || 'pending'}
                                          onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                          className="px-2 py-0.5 rounded-full text-xs border border-gray-200 focus:outline-none focus:border-indigo-500 bg-white"
                                        >
                                          <option value="pending">⏳ قيد الانتظار</option>
                                          <option value="in_progress">🔄 قيد التنفيذ</option>
                                          <option value="completed">✅ مكتمل</option>
                                        </select>
                                      ) : (
                                        <span className="text-xs text-gray-400">⚠️ للقراءة فقط</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-32">
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                                        style={{ width: `${task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0}%` }}
                                      />
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {task.status === 'completed' ? '100%' : 
                                       task.status === 'in_progress' ? '50%' : '0%'}
                                    </p>
                                  </div>
                                  {isMainDeveloper && (
                                    <button 
                                      onClick={() => handleDeleteTask(task._id)}
                                      className="p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-red-600"
                                    >
                                      <FiMoreHorizontal />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                          <p className="text-5xl mb-3">📋</p>
                          <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مراحل</h3>
                          <p className="text-gray-500 mb-4">لم يتم إضافة أي مراحل للمشروع حتى الآن</p>
                          {isMainDeveloper && (
                            <button 
                              onClick={() => setShowAddTaskModal(true)}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm"
                            >
                              ➕ إضافة مرحلة جديدة
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ✅ Files Tab */}
                  {activeTab === 'files' && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex flex-wrap gap-3 mb-6">
                        {isMainDeveloper && (
                          <button
                            onClick={() => setShowCreateFolderModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm"
                          >
                            <FiPlus className="w-4 h-4" />
                            مجلد جديد
                          </button>
                        )}
                        
                        {isMainDeveloper && currentFolder && (
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm"
                          >
                            <FiUpload className="w-4 h-4" />
                            رفع ملف
                          </button>
                        )}
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">📁 المجلدات</h4>
                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(folders) && folders.length > 0 ? (
                            folders.map((folder) => (
                              <div
                                key={folder._id}
                                onClick={() => fetchFolderFiles(folder._id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${
                                  currentFolder === folder._id
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                }`}
                              >
                                <FiFolder className="w-4 h-4" />
                                <span className="text-sm font-medium">{folder.name}</span>
                                {isMainDeveloper && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(folder._id, folder.name);
                                    }}
                                    className="text-red-400 hover:text-red-600 transition"
                                  >
                                    <FiX className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm">لا توجد مجلدات</p>
                          )}
                        </div>
                      </div>

                      {currentFolder ? (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">📄 الملفات</h4>
                            <span className="text-xs text-gray-400">{currentFiles.length} ملف</span>
                          </div>
                          {loadingFiles ? (
                            <div className="text-center py-8">
                              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <p className="text-gray-400 text-sm">جاري تحميل الملفات...</p>
                            </div>
                          ) : currentFiles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {currentFiles.map((file, i) => (
                                <div key={file._id || i} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        file.type === 'pdf' ? 'bg-red-50 text-red-500' :
                                        file.type === 'excel' ? 'bg-green-50 text-green-500' :
                                        file.type === 'powerpoint' ? 'bg-orange-50 text-orange-500' :
                                        'bg-blue-50 text-blue-500'
                                      }`}>
                                        <FiFile className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <p className="text-gray-900 text-sm font-medium truncate max-w-[120px]">{file.name}</p>
                                        <p className="text-gray-500 text-xs">{file.size || '0 KB'} • {file.uploadedBy?.username || 'مستخدم'}</p>
                                      </div>
                                    </div>
                                    {isMainDeveloper && (
                                      <button
                                        onClick={() => handleDeleteFile(file._id, file.name)}
                                        className="text-red-400 hover:text-red-600 transition"
                                      >
                                        <FiX className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <button
                                      onClick={() => handleDownloadFile(file)}
                                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition text-xs"
                                    >
                                      <FiDownload className="w-3 h-3" />
                                      تحميل
                                    </button>
                                    <button
                                      onClick={() => handlePreviewFile(file)}
                                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition text-xs"
                                    >
                                      <FiEye className="w-3 h-3" />
                                      معاينة
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <p className="text-4xl mb-2">📭</p>
                              <p>لا توجد ملفات في هذا المجلد</p>
                              {isMainDeveloper && (
                                <button
                                  onClick={() => setShowUploadModal(true)}
                                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 transition"
                                >
                                  رفع ملف جديد
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <p className="text-5xl mb-3">📂</p>
                          <p className="text-lg font-medium">اختر مجلداً لعرض ملفاته</p>
                          <p className="text-sm">انقر على أي مجلد من القائمة أعلاه</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Payments Tab */}
                  {activeTab === 'payments' && (
                    <motion.div
                      key="payments"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-gray-500 text-xs">إجمالي الميزانية</p>
                          <p className="text-gray-900 font-bold text-lg">${project?.budget?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-gray-500 text-xs">المدفوع</p>
                          <p className="text-green-600 font-bold text-lg">${project?.paidAmount?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-gray-500 text-xs">في الضمان</p>
                          <p className="text-yellow-600 font-bold text-lg">$0</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                          <p className="text-gray-500 text-xs">المتبقي</p>
                          <p className="text-blue-600 font-bold text-lg">${(project?.budget - project?.paidAmount)?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-right text-gray-500 text-sm">رقم الفاتورة</th>
                              <th className="px-4 py-3 text-right text-gray-500 text-sm">التاريخ</th>
                              <th className="px-4 py-3 text-right text-gray-500 text-sm">المبلغ</th>
                              <th className="px-4 py-3 text-right text-gray-500 text-sm">الحالة</th>
                              <th className="px-4 py-3 text-right text-gray-500 text-sm">إجراء</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(project?.payments && project.payments.length > 0 ? project.payments : []).map((payment) => (
                              <tr key={payment._id} className="border-t border-gray-200">
                                <td className="px-4 py-3 text-gray-900 text-sm">{payment.namePayment}</td>
                                <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(payment.createdAt)}</td>
                                <td className="px-4 py-3 text-gray-900 text-sm">${payment.amount}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(payment.status)}`}>
                                    {getStatusText(payment.status)}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
  <button
    onClick={() => handleDownloadReceipt(payment)}
    className="text-indigo-600 hover:text-indigo-700 transition text-sm flex items-center gap-1"
  >
    <FiDownload className="w-4 h-4" />
    تحميل PDF
  </button>
</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {(!project?.payments || project.payments.length === 0) && (
                          <div className="text-center py-8 text-gray-400">
                            <p>لا توجد مدفوعات</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ✅ Activity Tab */}
                  {activeTab === 'activity' && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {loadingActivities ? (
                        <div className="text-center py-12">
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-gray-400 text-sm">جاري تحميل الأنشطة...</p>
                        </div>
                      ) : activities.length > 0 ? (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                          {activities.map((activity, index) => {
                            const Icon = getActivityIcon(activity.action);
                            const colorClass = getActivityColor(activity.action);
                            const description = getActivityDescription(activity);
                            const time = getRelativeTime(activity.createdAt);
                            const userImage = activity.user?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg';
                            const userName = activity.user?.username || 'مستخدم';

                            return (
                              <motion.div
                                key={activity._id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  {index < activities.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={userImage} 
                                        alt={userName} 
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <span className="text-sm text-gray-900 font-medium">{userName}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{description}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(activity.createdAt).toLocaleString('ar-EG', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                          <div className="text-6xl mb-4">📊</div>
                          <h3 className="text-xl font-bold text-gray-700 mb-2">لا يوجد نشاط</h3>
                          <p className="text-gray-500">لم يتم تسجيل أي نشاط داخل المشروع حتى الآن</p>
                          <p className="text-gray-400 text-sm mt-1">ستظهر هنا جميع الأحداث التي تحدث في المشروع</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* ✅ Project Members */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-gray-900 font-semibold text-sm mb-3">👥 أعضاء المشروع</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={project?.client?.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{project?.client?.name}</p>
                    <p className="text-gray-500 text-xs">عميل</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                
                {project?.developer && (
                  <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-2">
                    <img src={project.developer.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-semibold">{project.developer.name}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <FiShield className="w-3 h-3 text-indigo-600" />
                        مبرمج رئيسي
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )}
                
                {project?.team?.filter(m => !m.isMain).map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={member.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{member.name}</p>
                      <p className="text-gray-500 text-xs">{member.role}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                ))}
                
                {isMainDeveloper && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition text-sm"
                  >
                    <FiUserPlus className="w-4 h-4" />
                    إضافة عضو
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-gray-900 font-semibold text-sm mb-3">⚡ إجراءات سريعة</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleOpenChat}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  فتح المحادثة
                </button>
                
                {isMainDeveloper ? (
                  <>
                    <button 
                      onClick={() => {
                        setRepoLink(project?.githubRepo || '');
                        setDemoLink(project?.demoUrl || '');
                        setShowRepoModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiGithub className="w-4 h-4" />
                      {project?.githubRepo || project?.demoUrl ? 'تعديل روابط المشروع' : 'إضافة روابط المشروع'}
                    </button>
                    
                    <button 
                      onClick={() => setShowAddTaskModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiClock className="w-4 h-4" />
                      إضافة مرحلة
                    </button>
                    
                    <button 
                      onClick={() => setShowAddMemberModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      إضافة عضو
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setPaymentData({
                          amount: '',
                          walletName: '',
                          transferNumber: '',
                          wallettype: ''
                        });
                        setShowPaymentModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiDollarSign className="w-4 h-4" />
                      دفع
                    </button>
                    
                    <button 
                      onClick={() => {
                        setFeatureData({ feature: '' });
                        setShowFeatureModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiStar className="w-4 h-4" />
                      إضافة مميزات
                    </button>
                    
                    <button 
                      onClick={() => {
                        setGoalData({ objective: '' });
                        setShowGoalModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      <FiTarget className="w-4 h-4" />
                      إضافة أهداف
                    </button>
                    
                    {/* ✅ للعميل فقط - زر الموافقة على المشروع */}
{isClient && (
  <button 
    onClick={handleApproveProject}
    disabled={project?.progress < 100 || submitting}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${
      project?.progress >= 100 && !submitting
        ? 'bg-green-50 text-green-700 hover:bg-green-100'
        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
    }`}
  >
    <FiCheck className="w-4 h-4" />
    {submitting ? 'جاري الموافقة...' : 'الموافقة على المشروع'}
    {project?.progress < 100 && (
      <span className="text-xs">({project?.progress}%)</span>
    )}
  </button>
)}
                  </>
                )}

                {isAssistantDeveloper && (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-sm">🔍 يمكنك فقط مشاهدة المحتوى</p>
                    <p className="text-xs mt-1">ليس لديك صلاحية لإجراء تعديلات</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Health */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-gray-900 font-semibold text-sm mb-3">📊 صحة المشروع</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">التقدم</span>
                    <span className="text-gray-900">{project?.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: `${project?.progress || 0}%` }} />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الميزانية المستخدمة</span>
                  <span className="text-gray-900">{project?.budget ? Math.round((project.paidAmount / project.budget) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الميزانية المتبقية</span>
                  <span className="text-green-600">${(project?.budget - project?.paidAmount)?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الوقت المتبقي</span>
                  <span className={`${timeProgress >= 80 ? 'text-red-600' : timeProgress >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {remainingDays > 0 ? `${remainingDays} يوم` : 'انتهى الوقت'}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ Risk Indicator */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 ${riskStatus.color}`}>
              <h3 className="text-gray-900 font-semibold text-sm mb-3">⚠️ المخاطر</h3>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${riskStatus.color}`}>
                <div className={`w-2 h-2 rounded-full ${riskStatus.dotColor}`} />
                <div>
                  <p className={`text-sm font-medium ${riskStatus.textColor}`}>
                    {riskStatus.icon} {riskStatus.level}
                  </p>
                  <p className="text-gray-500 text-xs">{riskStatus.message}</p>
                  <p className="text-gray-400 text-xs mt-1">الوقت المنقضي: {Math.round(timeProgress)}%</p>
                </div>
              </div>
            </div>

            {/* ✅ دور المستخدم */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 ${userRole.color}`}>
              <h3 className="text-gray-900 font-semibold text-sm mb-3">👤 دورك</h3>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${userRole.color}`}>
                <span className="text-2xl">{userRole.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${userRole.textColor}`}>
                    {userRole.label}
                  </p>
                  <p className="text-xs text-gray-500">{userRole.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">➕ إضافة مرحلة جديدة</h3>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">عنوان المرحلة *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="أدخل عنوان المرحلة"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">وصف المرحلة</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                      rows="3"
                      placeholder="وصف تفصيلي للمرحلة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ التسليم</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'جاري الإضافة...' : 'إضافة مرحلة ✅'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">👤 إضافة عضو جديد</h3>
              <form onSubmit={handleAddMember}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم *</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="أدخل اسم العضو"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">الدور</label>
                    <input
                      type="text"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="مثال: مطور Frontend"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                  >
                    إضافة عضو 👤
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Developer Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">📧 إرسال دعوة لمبرمج</h3>
              <form onSubmit={handleSendInvite}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      معرف المبرمج أو البريد الإلكتروني *
                    </label>
                    <input
                      type="text"
                      value={inviteData.developerId}
                      onChange={(e) => setInviteData({ ...inviteData, developerId: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="أدخل ID أو البريد الإلكتروني"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">يمكنك إدخال معرف المبرمج أو البريد الإلكتروني</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">رسالة الدعوة</label>
                    <textarea
                      value={inviteData.message}
                      onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                      rows="3"
                      placeholder="أدخل رسالة ترحيبية للمبرمج..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {inviting ? 'جاري الإرسال...' : 'إرسال الدعوة 📧'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateFolderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">📁 إنشاء مجلد جديد</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">اسم المجلد *</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="أدخل اسم المجلد"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  إنشاء مجلد 📁
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Upload File Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">📤 رفع ملف</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">اختر ملف *</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-500 mt-1">
                      📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUploadFile}
                  disabled={uploading || !selectedFile}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {uploading ? 'جاري الرفع...' : 'رفع ملف 📤'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Add Links Modal */}
      <AnimatePresence>
        {showRepoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRepoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 {project?.githubRepo || project?.demoUrl ? 'تعديل' : 'إضافة'} روابط المشروع</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">رابط المستودع (GitHub)</label>
                  <input
                    type="url"
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">رابط العرض التجريبي</label>
                  <input
                    type="url"
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://your-demo-url.com"
                  />
                </div>

                {(project?.githubRepo || project?.demoUrl) && (
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">الروابط الحالية:</p>
                    {project?.githubRepo && (
                      <a 
                        href={project.githubRepo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm truncate block"
                      >
                        📦 {project.githubRepo}
                      </a>
                    )}
                    {project?.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm truncate block"
                      >
                        🌐 {project.demoUrl}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRepoModal(false);
                    setRepoLink(project?.githubRepo || '');
                    setDemoLink(project?.demoUrl || '');
                  }}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveLinks}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  حفظ الروابط 💾
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">💰 إضافة دفعة جديدة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    المبلغ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="أدخل المبلغ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    نوع المحفظة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentData.wallettype}
                    onChange={(e) => setPaymentData({ ...paymentData, wallettype: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white"
                    required
                  >
                    <option value="">اختر نوع المحفظة</option>
                    <option value="vodafone_cash">📱 فودافون كاش</option>
                    <option value="instapay">💳 إنستا باي</option>
                    <option value="etisalat_cash">📱 اتصالات كاش</option>
                    <option value="orange_cash">📱 اورنج كاش</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    صاحب المحفظة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.walletName}
                    onChange={(e) => setPaymentData({ ...paymentData, walletName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="أدخل اسم صاحب المحفظة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    رقم المحفظة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={paymentData.transferNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        setPaymentData({ ...paymentData, transferNumber: value });
                      }
                    }}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="01125354587"
                    required
                    maxLength={11}
                  />
                  <p className="text-xs text-gray-400 mt-1">📱 رقم محفظة العميل (يبدأ بـ 011)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    رقم التحويل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value="01125354587"
                    readOnly
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">🔒 رقم تحويل ثابت</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentData({
                      amount: '',
                      walletName: '',
                      transferNumber: '',
                      wallettype: ''
                    });
                  }}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={submitting}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? 'جاري الإضافة...' : 'تأكيد الدفع 💳'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Feature Modal */}
      <AnimatePresence>
        {showFeatureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeatureModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">⭐ إضافة ميزة جديدة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الميزة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={featureData.feature}
                    onChange={(e) => setFeatureData({ ...featureData, feature: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="مثال: نظام الدفع الإلكتروني"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFeatureModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddFeature}
                  disabled={submitting}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة ميزة ⭐'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 إضافة هدف جديد</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الهدف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={goalData.objective}
                    onChange={(e) => setGoalData({ ...goalData, objective: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="مثال: زيادة المبيعات 20%"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={submitting}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة هدف 🎯'}
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