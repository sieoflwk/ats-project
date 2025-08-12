import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    // 자동 제거
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const value = {
    toasts,
    showToast,
    removeToast
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} show`}
        >
          <div className="toast-content">
            <span className="toast-message" dangerouslySetInnerHTML={{ __html: toast.message }} />
            <button 
              className="toast-close" 
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
