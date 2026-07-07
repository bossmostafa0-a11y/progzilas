// App.jsx

import 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import NotificationProvider from './context/NotificationProvider.jsx';
import { AppRoutes } from './routes';
import { AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;