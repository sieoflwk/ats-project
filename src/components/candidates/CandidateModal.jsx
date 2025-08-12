import React, { useState, useEffect } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function CandidateModal({ candidate, onClose }) {
  const { addCandidate, updateCandidate } = useData()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'new',
    notes: '',
    technicalTags: [],
    experienceTag: ''
  })

  useEffect(() => {
    if (candidate) {
      setFormData(candidate)
    }
  }, [candidate])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('이름과 이메일은 필수입니다.', 'error')
      return
    }

    try {
      if (candidate) {
        updateCandidate(candidate.id, formData)
        showToast('지원자 정보가 수정되었습니다.', 'success')
      } else {
        addCandidate(formData)
        showToast('새 지원자가 추가되었습니다.', 'success')
      }
      onClose()
    } catch (error) {
      showToast('오류가 발생했습니다.', 'error')
    }
  }

  const handleTechnicalTagChange = (tag, checked) => {
    setFormData(prev => ({
      ...prev,
      technicalTags: checked 
        ? [...prev.technicalTags, tag]
        : prev.technicalTags.filter(t => t !== tag)
    }))
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {candidate ? '지원자 편집' : '지원자 추가'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">전화번호</label>
            <input
              type="text"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">지원직무</label>
            <input
              type="text"
              className="form-input"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">상태</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="new">신규</option>
              <option value="screening">서류심사</option>
              <option value="interview">면접진행</option>
              <option value="offer">제안서발송</option>
              <option value="rejected">불합격</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>기술 태그</label>
            <div className="tag-selection">
              {['React', 'Node.js', 'Python', 'Java', 'Spring', 'AWS'].map(tag => (
                <div key={tag} className="tag-option">
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    checked={formData.technicalTags.includes(tag)}
                    onChange={(e) => handleTechnicalTagChange(tag, e.target.checked)}
                  />
                  <label htmlFor={`tag-${tag}`}>{tag}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>경험 태그</label>
            <div className="tag-selection">
              {['신입', '경력', '시니어'].map(tag => (
                <div key={tag} className="tag-option">
                  <input
                    type="radio"
                    id={`exp-${tag}`}
                    name="experienceTag"
                    value={tag}
                    checked={formData.experienceTag === tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceTag: e.target.value }))}
                  />
                  <label htmlFor={`exp-${tag}`}>{tag}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn">저장</button>
        </form>
      </div>
    </div>
  )
}

export default CandidateModal
