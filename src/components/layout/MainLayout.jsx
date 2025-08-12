import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navigation from './Navigation'

function MainLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* 사이드바 */}
      <aside className="sidebar" aria-label="메인 네비게이션">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <h1 className="logo-text">Smart ATS</h1>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <Navigation currentPath={location.pathname} collapsed={sidebarCollapsed} />
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">{currentUser?.username}</div>
                <div className="user-role">{currentUser?.role}</div>
              </div>
            )}
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            aria-label="로그아웃"
          >
            {!sidebarCollapsed && '로그아웃'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        <header className="content-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Smart ATS</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {location.pathname === '/dashboard' && '대시보드'}
              {location.pathname === '/candidates' && '지원자 관리'}
              {location.pathname === '/upload' && '데이터 업로드'}
              {location.pathname === '/education' && '면접관 교육'}
              {location.pathname === '/backup' && '백업 관리'}
            </span>
          </div>
          
          <div className="header-actions">
            <div className="current-time">
              {new Date().toLocaleDateString('ko-KR', { 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </header>
        
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
