import   'react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import {  AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;