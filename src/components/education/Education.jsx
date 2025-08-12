import React, { useState, useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import EducationToolbar from './EducationToolbar'
import EducationGrid from './EducationGrid'
import EducationModal from './EducationModal'

function Education() {
  const { educationPosts } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  const filteredPosts = educationPosts.filter(post =>
    !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const stats = useMemo(() => {
    const total = educationPosts.length
    const published = educationPosts.filter(p => p.status === 'published').length
    const draft = educationPosts.filter(p => p.status === 'draft').length
    const featured = educationPosts.filter(p => p.featured).length

    return {
      total,
      published,
      draft,
      featured
    }
  }, [educationPosts])

  const handleAddPost = () => {
    setEditingPost(null)
    setModalOpen(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setModalOpen(true)
  }

  return (
    <div className="education-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">면접관 교육</h1>
          <p className="page-subtitle">
            면접 스킬을 향상시키고 채용 품질을 높이세요
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleAddPost}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            교육 자료 추가
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">전체 자료</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">발행된 자료</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.published}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${(stats.published / stats.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">초안 자료</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5L13 8L11 6L5.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 8L18.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${(stats.draft / stats.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">추천 자료</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.featured}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${(stats.featured / stats.total) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <EducationToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddPost={handleAddPost}
        />

        <EducationGrid
          posts={filteredPosts}
          onEditPost={handleEditPost}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <EducationModal
          post={editingPost}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Education
