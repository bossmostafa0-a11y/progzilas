import 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

// Public Pages
import Home from '../pages/public/Home'
import Developers from '../pages/public/Developers'
import Marketplace from '../pages/public/Marketplace'
import MarketplaceItem from '../pages/public/MarketplaceItem'
import DevProfilePublic from '../pages/public/DevProfilePublic'
import HowItWorks from '../pages/public/HowItWorks'
import Pricing from '../pages/public/Pricing'
import TermsPrivacy from '../pages/public/TermsPrivacy'

// Auth Pages
import Login from '../pages/auth/Login'
import CompleteProfile from '../pages/auth/CompleteProfile'
import CompleteClientProfile from '../pages/auth/CompleteClientProfile'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyAccount from '../pages/auth/VerifyAccount';

// Developer Pages
import DevDashboard from '../pages/developer/DevDashboard'
import DevProjects from '../pages/developer/DevProjects'
import DevProposals from '../pages/developer/DevProposals'
import DevStore from '../pages/developer/DevStore'
import DevEarnings from '../pages/developer/DevEarnings'
import DevProfileSettings from '../pages/developer/DevProfileSettings'
import AddProject from '../pages/developer/AddProject'
import DevSettings from '../pages/developer/DevSettings'
import EditProject from '../pages/developer/EditProject';
import ProjectProposals from '../pages/developer/ProjectProposals'; // ✅ أضف هذا مع بقية الـ imports


// Client Pages
import ClientDashboard from '../pages/client/ClientDashboard'
import ClientProjects from '../pages/client/ClientProjects'
import NewProject from '../pages/client/NewProject'
import ClientProposals from '../pages/client/Proposals'
import Purchases from '../pages/client/Purchases'
import ClientSettings from '../pages/client/ClientSettings'

// Shared Pages
import ProjectRoom from '../pages/shared/ProjectRoom'
import Messages from '../pages/shared/Messages'
import Notifications from '../pages/shared/Notifications'
import NotFound from '../pages/shared/NotFound'
import Payment from '../pages/shared/Payment'
import Support from '../pages/shared/supportchat.jsx'
import Messagesupport from '../pages/developer/messagesupport'
import PreviousProjects from '../pages/developer/PreviousProjects.jsx'
import AddPreviousProjects from '../pages/developer/addPreviousProjects'
import ReportProblem from '../pages/shared/ReportProblem'
import Projects from '../pages/public/projects.jsx'
import Projectitem from '../pages/public/projectItem.jsx'


const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
    { path: '/Messagesupport', element: <Messagesupport /> },
  { path: '/developers', element: <Developers /> },
   { path: '/projects', element: <Projects /> },
      { path: '/projectitem/:id', element: <Projectitem /> },
  { path: '/support/:projectId', element: <Support /> },
  { path: '/marketplace', element: <Marketplace /> },
  { path: '/marketplaceitem/:id', element: <MarketplaceItem /> },
  { path: '/dev/:id', element: <DevProfilePublic /> },
  { path: '/how-it-works', element: <HowItWorks /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/privacy', element: <TermsPrivacy /> },
   { path: '/verify-account', element: <VerifyAccount /> },
  { path: '/login', element: <Login /> },
  { path: '/complete-profile', element: <CompleteProfile /> },
  { path: '/complete-client-profile', element: <CompleteClientProfile /> },
  { path: '/forgot-password', element: <ForgotPassword /> },

  
  // Developer Routes
    { path: '/dashboard/developer/PreviousProjects', element: <PreviousProjects /> },
    { path: '/dashboard/developer/PreviousProjects/AddPreviousProjects', element: <AddPreviousProjects /> },
  { path: '/dashboard/developer', element: <PrivateRoute allowedTypes={['developer']}><DevDashboard /></PrivateRoute> },
  { path: '/dashboard/developer/projects', element: <PrivateRoute allowedTypes={['developer']}><DevProjects /></PrivateRoute> },
  { path: '/dashboard/developer/proposals', element: <PrivateRoute allowedTypes={['developer']}><DevProposals /></PrivateRoute> },
  { path: '/dashboard/developer/store', element: <PrivateRoute allowedTypes={['developer']}><DevStore /></PrivateRoute> },
  { path: '/dashboard/developer/earnings', element: <PrivateRoute allowedTypes={['developer']}><DevEarnings /></PrivateRoute> },
  { path: '/dashboard/developer/profile', element: <PrivateRoute allowedTypes={['developer']}><DevProfileSettings /></PrivateRoute> },
  { path: '/dashboard/developer/add-project', element: <PrivateRoute allowedTypes={['developer']}><AddProject /></PrivateRoute> },
  { path: '/dashboard/developer/settings', element: <PrivateRoute allowedTypes={['developer']}><DevSettings /></PrivateRoute> },
{ path: '/dashboard/developer/edit-project', element: <PrivateRoute allowedTypes={['developer']}><EditProject /></PrivateRoute> },
{ path: '/dashboard/developer/project-proposals', element: <PrivateRoute allowedTypes={['developer']}><ProjectProposals /></PrivateRoute> },
  // Client Routes
  { path: '/dashboard/client', element: <PrivateRoute allowedTypes={['client']}><ClientDashboard /></PrivateRoute> },
  { path: '/dashboard/client/projects', element: <PrivateRoute allowedTypes={['client']}><ClientProjects /></PrivateRoute> },
  { path: '/dashboard/client/new-project', element: <PrivateRoute allowedTypes={['client']}><NewProject /></PrivateRoute> },
  { path: '/dashboard/client/proposals', element: <PrivateRoute allowedTypes={['client']}><ClientProposals /></PrivateRoute> },
  { path: '/dashboard/client/project/:id/proposals', element: <PrivateRoute allowedTypes={['client']}><ClientProposals /></PrivateRoute> },
  { path: '/dashboard/client/purchases', element: <PrivateRoute allowedTypes={['client']}><Purchases /></PrivateRoute> },
  { path: '/dashboard/client/settings', element: <PrivateRoute allowedTypes={['client']}><ClientSettings /></PrivateRoute> },

  // Shared Routes
  { path: '/project/:id', element: <PrivateRoute><ProjectRoom /></PrivateRoute> },
  { path: '/messages', element: <PrivateRoute><Messages /></PrivateRoute> },
  { path: '/notifications', element: <PrivateRoute><Notifications /></PrivateRoute> },
{ path: '/payment', element: <PrivateRoute><Payment /></PrivateRoute> },
{ path: '/ReportProblem', element: <PrivateRoute><ReportProblem /></PrivateRoute> },

  // 404
  { path: '*', element: <NotFound /> }
])

export const AppRoutes = () => <RouterProvider router={router} />