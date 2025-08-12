import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import LoginPage from './components/auth/LoginPage'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './components/dashboard/Dashboard'
import Candidates from './components/candidates/Candidates'
import Upload from './components/upload/Upload'
import Education from './components/education/Education'
import Backup from './components/backup/Backup'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { ToastProvider } from './contexts/ToastContext'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="upload" element={<Upload />} />
              <Route path="education" element={<Education />} />
              <Route path="backup" element={<Backup />} />
            </Route>
          </Routes>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  )
}

export default App