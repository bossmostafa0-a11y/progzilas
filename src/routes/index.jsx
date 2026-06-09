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

// Developer Pages
import DevDashboard from '../pages/developer/DevDashboard'
import DevProjects from '../pages/developer/DevProjects'
import DevProposals from '../pages/developer/DevProposals'
import DevStore from '../pages/developer/DevStore'
import DevEarnings from '../pages/developer/DevEarnings'
import DevProfileSettings from '../pages/developer/DevProfileSettings'
import AddProject from '../pages/developer/AddProject'
import DevSettings from '../pages/developer/DevSettings'

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

const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
  { path: '/developers', element: <Developers /> },
  { path: '/marketplace', element: <Marketplace /> },
  { path: '/marketplace/:id', element: <MarketplaceItem /> },
  { path: '/dev/:username', element: <DevProfilePublic /> },
  { path: '/how-it-works', element: <HowItWorks /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/privacy', element: <TermsPrivacy /> },
 
  { path: '/login', element: <Login /> },
  { path: '/complete-profile', element: <CompleteProfile /> },
  { path: '/complete-client-profile', element: <CompleteClientProfile /> },
  { path: '/forgot-password', element: <ForgotPassword /> },

  // Developer Routes
  { path: '/dashboard/developer', element: <PrivateRoute allowedTypes={['developer']}><DevDashboard /></PrivateRoute> },
  { path: '/dashboard/developer/projects', element: <PrivateRoute allowedTypes={['developer']}><DevProjects /></PrivateRoute> },
  { path: '/dashboard/developer/proposals', element: <PrivateRoute allowedTypes={['developer']}><DevProposals /></PrivateRoute> },
  { path: '/dashboard/developer/store', element: <PrivateRoute allowedTypes={['developer']}><DevStore /></PrivateRoute> },
  { path: '/dashboard/developer/earnings', element: <PrivateRoute allowedTypes={['developer']}><DevEarnings /></PrivateRoute> },
  { path: '/dashboard/developer/profile', element: <PrivateRoute allowedTypes={['developer']}><DevProfileSettings /></PrivateRoute> },
  { path: '/dashboard/developer/add-project', element: <PrivateRoute allowedTypes={['developer']}><AddProject /></PrivateRoute> },
  { path: '/dashboard/developer/settings', element: <PrivateRoute allowedTypes={['developer']}><DevSettings /></PrivateRoute> },

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
  // 404
  { path: '*', element: <NotFound /> }
])

export const AppRoutes = () => <RouterProvider router={router} />