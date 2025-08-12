import React, { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navigation from './Navigation'

function MainLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 키보드 단축키 설정
    const handleKeyDown = (e) => {
      // 입력 필드에서는 특정 단축키만 허용
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur()
        }
        return
      }
      
      // Ctrl+1-5: 탭 전환
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault()
        const routes = ['/dashboard', '/candidates', '/upload', '/education', '/backup']
        const routeIndex = parseInt(e.key) - 1
        if (routes[routeIndex]) {
          navigate(routes[routeIndex])
        }
      }
      
      // ESC: 모든 모달 닫기
      if (e.key === 'Escape') {
        // 모달 닫기 로직은 각 컴포넌트에서 처리
        const activeModal = document.querySelector('.modal.active')
        if (activeModal) {
          const closeButton = activeModal.querySelector('.close-btn, .modal-close')
          if (closeButton) {
            closeButton.click()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="main-content logged-in">
      {/* 로그아웃 버튼 */}
      <button 
        className="logout-btn" 
        onClick={handleLogout}
        style={{ display: 'block' }}
      >
        로그아웃
      </button>
      
      {/* 사용자 정보 */}
      <div className="user-info" style={{ display: 'block' }}>
        {currentUser?.username} ({currentUser?.role})
      </div>
      
      <div className="container">
        <div className="header">
          <h1>ATS 시스템</h1>
          <p>지원자 관리부터 면접관 교육까지, 한 번에 관리하세요</p>
        </div>
        
        <Navigation currentPath={location.pathname} />
        
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
