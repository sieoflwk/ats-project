import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser, login } = useAuth()

  // 이미 로그인된 경우 대시보드로 리디렉션
  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.')
      setLoading(false)
      return
    }

    const result = login(username.trim(), password.trim())
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-logo">🚀</div>
        <h1 className="login-title">ATS 시스템</h1>
        <p className="login-subtitle">지원자 관리부터 면접관 교육까지</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error" style={{ display: 'block' }}>
              {error}
            </div>
          )}
          
          <input
            type="text"
            className="login-input"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="login-footer">
          <p><strong>테스트 계정:</strong></p>
          <p>admin / admin123 (관리자)</p>
          <p>hr1 / hr123 (HR 담당자)</p>
          <p>hr2 / hr123 (HR 담당자)</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
