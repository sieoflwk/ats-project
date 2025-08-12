import React from 'react'
import { Link } from 'react-router-dom'

function Navigation({ currentPath }) {
  const navItems = [
    { path: '/dashboard', label: '📊 대시보드', id: 'dashboard' },
    { path: '/candidates', label: '👥 지원자 관리', id: 'candidates' },
    { path: '/upload', label: '📤 엑셀 업로드', id: 'upload' },
    { path: '/education', label: '📚 면접관 교육', id: 'education' },
    { path: '/backup', label: '💾 백업/복원', id: 'backup' }
  ]

  return (
    <div className="nav-tabs">
      {navItems.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className={`nav-tab ${currentPath === item.path ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default Navigation
