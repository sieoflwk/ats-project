import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function EducationModal({ post, onClose }) {
  const { addEducationPost, updateEducationPost } = useData()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData(post)
    }
  }, [post])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('제목과 내용을 모두 입력해주세요.', 'error')
      return
    }

    try {
      if (post) {
        updateEducationPost(post.id, formData)
        showToast('게시물이 수정되었습니다.', 'success')
      } else {
        addEducationPost(formData)
        showToast('새 게시물이 작성되었습니다.', 'success')
      }
      onClose()
    } catch (error) {
      showToast('오류가 발생했습니다.', 'error')
    }
  }

  return (
    <div className="modal active">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {post ? '게시물 편집' : '새 게시물 작성'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="markdown-editor">
            <div className="editor-tabs">
              <button
                type="button"
                className={`editor-tab ${!showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(false)}
              >
                ✏️ 편집
              </button>
              <button
                type="button"
                className={`editor-tab ${showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(true)}
              >
                👁️ 미리보기
              </button>
            </div>
            
            {!showPreview ? (
              <textarea
                className="markdown-input"
                placeholder="마크다운으로 작성하세요..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
              />
            ) : (
              <div className="markdown-preview">
                {formData.content ? (
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                ) : (
                  <p>미리보기가 여기에 표시됩니다...</p>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="btn">저장</button>
        </form>
      </div>
    </div>
  )
}

export default EducationModal
