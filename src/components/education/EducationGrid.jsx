import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useData } from '../../contexts/DataContext'

function EducationGrid({ posts, onEditPost }) {
  const { deleteEducationPost } = useData()

  const handleDelete = (post) => {
    if (window.confirm(`"${post.title}" 게시물을 삭제하시겠습니까?`)) {
      deleteEducationPost(post.id)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  if (posts.length === 0) {
    return (
      <div className="posts-grid">
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>게시물이 없습니다</h3>
          <p>새로운 교육 자료를 작성해보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="posts-grid">
      {posts.map(post => (
        <div key={post.id} className="education-post-card">
          <div className="post-header">
            <h3 className="post-title">{post.title}</h3>
            <div className="post-actions">
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => onEditPost(post)}
              >
                ✏️ 편집
              </button>
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleDelete(post)}
              >
                🗑️ 삭제
              </button>
            </div>
          </div>
          
          <div className="post-meta">
            <span className="post-date">📅 {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span className="post-updated">수정됨: {formatDate(post.updatedAt)}</span>
            )}
          </div>
          
          <div className="post-content">
            <ReactMarkdown>{post.content.substring(0, 200)}...</ReactMarkdown>
          </div>
          
          <div className="post-footer">
            <button 
              className="btn btn-primary"
              onClick={() => onEditPost(post)}
            >
              자세히 보기
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EducationGrid
