import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const VALID_ACCOUNTS = {
  'admin': { password: 'admin123', role: '관리자' },
  'hr1': { password: 'hr123', role: 'HR 담당자' },
  'hr2': { password: 'hr123', role: 'HR 담당자' }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 저장된 사용자 정보 확인
    const savedUser = sessionStorage.getItem('ats-user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error)
        sessionStorage.removeItem('ats-user')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    if (VALID_ACCOUNTS[username] && VALID_ACCOUNTS[username].password === password) {
      const user = {
        username: username,
        role: VALID_ACCOUNTS[username].role
      }
      
      setCurrentUser(user)
      sessionStorage.setItem('ats-user', JSON.stringify(user))
      
      console.log('로그인 성공:', username)
      return { success: true }
    } else {
      console.log('로그인 실패:', username)
      return { success: false, error: '잘못된 계정 정보입니다.' }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('ats-user')
    console.log('로그아웃 완료')
  }

  const value = {
    currentUser,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
