import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const PrivateRoute = ({ children, allowedTypes = [] }) => {
  const { isAuthenticated, userType, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" />
  if (allowedTypes.length > 0 && !allowedTypes.includes(userType)) return <Navigate to="/" />

  return children
}
