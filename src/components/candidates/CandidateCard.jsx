import React from 'react'
import { useData } from '../../contexts/DataContext'

function CandidateCard({ candidate, onEdit, onScheduleInterview, onEvaluate }) {
  const { deleteCandidate, updateCandidate } = useData()

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#3B82F6'
      case 'screening': return '#F59E0B'
      case 'interview': return '#10B981'
      case 'offer': return '#8B5CF6'
      case 'rejected': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return '신규'
      case 'screening': return '서류심사'
      case 'interview': return '면접진행'
      case 'offer': return '제안서발송'
      case 'rejected': return '불합격'
      default: return status
    }
  }

  const handleDelete = () => {
    if (window.confirm(`${candidate.name}님을 삭제하시겠습니까?`)) {
      deleteCandidate(candidate.id)
    }
  }

  const handleStatusChange = (newStatus) => {
    updateCandidate(candidate.id, { status: newStatus })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  return (
    <article 
      className="candidate-card" 
      data-id={candidate.id}
      role="article"
      aria-labelledby={`candidate-${candidate.id}-name`}
    >
      {/* 상태 표시 */}
      <div className={`status-indicator status-${candidate.status}`} 
           aria-label={`상태: ${getStatusLabel(candidate.status)}`}>
      </div>
      
      {/* 지원자 기본 정보 */}
      <header className="candidate-header">
        <div className="candidate-avatar" aria-hidden="true">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="candidate-info">
          <h3 
            className="candidate-name" 
            id={`candidate-${candidate.id}-name`}
          >
            {candidate.name}
          </h3>
          <p className="candidate-position">{candidate.position}</p>
        </div>
        <div className="candidate-status">
          <span className={`status-badge status-${candidate.status}`}>
            {getStatusLabel(candidate.status)}
          </span>
        </div>
      </header>

      {/* 핵심 정보 */}
      <div className="candidate-details">
        <div className="detail-item">
          <span className="detail-label">이메일:</span>
          <span className="detail-value">{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="detail-item">
            <span className="detail-label">연락처:</span>
            <span className="detail-value">{candidate.phone}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">지원일:</span>
          <span className="detail-value">{formatDate(candidate.createdAt)}</span>
        </div>
      </div>

      {/* 태그 정보 */}
      {(candidate.technicalTags?.length > 0 || candidate.experienceTag) && (
        <div className="tag-container">
          {candidate.technicalTags?.slice(0, 3).map(tag => (
            <span key={tag} className="tag technical">
              {tag}
            </span>
          ))}
          {candidate.technicalTags?.length > 3 && (
            <span className="tag-more">+{candidate.technicalTags.length - 3}</span>
          )}
          {candidate.experienceTag && (
            <span className="tag experience">
              {candidate.experienceTag}
            </span>
          )}
        </div>
      )}

      {/* 액션 영역 */}
      <div className="candidate-actions">
        <div className="action-buttons">
          <button 
            className="button button-secondary" 
            onClick={onEdit}
            title="편집"
          >
            편집
          </button>
          <button 
            className="button button-primary" 
            onClick={onScheduleInterview}
            title="면접 일정"
          >
            면접
          </button>
          <button 
            className="button button-secondary" 
            onClick={onEvaluate}
            title="평가"
          >
            평가
          </button>
        </div>
        
        <div className="action-controls">
          <select
            value={candidate.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
            title="상태 변경"
          >
            <option value="new">신규</option>
            <option value="screening">서류심사</option>
            <option value="interview">면접진행</option>
            <option value="offer">제안서발송</option>
            <option value="rejected">불합격</option>
          </select>
          
          <button 
            className="button button-destructive" 
            onClick={handleDelete}
            title="삭제"
          >
            삭제
          </button>
        </div>
      </div>
    </article>
  )
}

export default CandidateCard
