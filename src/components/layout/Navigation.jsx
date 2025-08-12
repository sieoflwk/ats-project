import React from 'react'
import { Link } from 'react-router-dom'

function Navigation({ currentPath, collapsed }) {
  const navItems = [
          { 
        path: '/dashboard', 
        label: '대시보드',
        id: 'dashboard',
        description: '전체 현황과 통계를 확인하세요'
      },
      { 
        path: '/candidates', 
        label: '지원자 관리',
        id: 'candidates',
        description: '지원자 정보를 관리하고 평가하세요'
      },
      { 
        path: '/upload', 
        label: '데이터 업로드',
        id: 'upload',
        description: '엑셀 파일로 데이터를 가져오세요'
      },
      { 
        path: '/education', 
        label: '면접관 교육',
        id: 'education',
        description: '면접 스킬을 향상시키세요'
      },
      { 
        path: '/backup', 
        label: '백업 관리',
        id: 'backup',
        description: '데이터를 안전하게 보관하세요'
      }
  ]

  return (
    <nav className="sidebar-navigation" role="navigation" aria-label="메인 네비게이션">
      {navItems.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
          aria-current={currentPath === item.path ? 'page' : undefined}
          title={collapsed ? item.description : undefined}
        >
          {!collapsed && (
            <>
              <span className="nav-label">{item.label}</span>
              {currentPath === item.path && (
                <div className="active-indicator"></div>
              )}
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
