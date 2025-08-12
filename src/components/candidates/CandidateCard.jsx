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
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  return (
    <div className="candidate-card" data-id={candidate.id}>
      <div className="candidate-header">
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-email">{candidate.email}</p>
          <p className="candidate-position">{candidate.position}</p>
        </div>
        <div 
          className="candidate-status"
          style={{ backgroundColor: getStatusColor(candidate.status) }}
        >
          {getStatusLabel(candidate.status)}
        </div>
      </div>

      <div className="candidate-details">
        {candidate.phone && (
          <p className="candidate-phone">📞 {candidate.phone}</p>
        )}
        <p className="candidate-date">📅 {formatDate(candidate.createdAt)}</p>
      </div>

      <div className="candidate-tags">
        {candidate.technicalTags?.map(tag => (
          <span key={tag} className="candidate-tag technical">
            {tag}
          </span>
        ))}
        {candidate.experienceTag && (
          <span className="candidate-tag experience">
            {candidate.experienceTag}
          </span>
        )}
      </div>

      {candidate.notes && (
        <div className="candidate-notes">
          💬 {candidate.notes}
        </div>
      )}

      <div className="candidate-actions">
        <button className="btn btn-sm btn-secondary" onClick={onEdit}>
          ✏️ 편집
        </button>
        <button className="btn btn-sm btn-primary" onClick={onScheduleInterview}>
          📅 면접
        </button>
        <button className="btn btn-sm btn-success" onClick={onEvaluate}>
          📊 평가
        </button>
        <div className="candidate-status-actions">
          <select
            value={candidate.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
          >
            <option value="new">신규</option>
            <option value="screening">서류심사</option>
            <option value="interview">면접진행</option>
            <option value="offer">제안서발송</option>
            <option value="rejected">불합격</option>
          </select>
        </div>
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
          🗑️
        </button>
      </div>
    </div>
  )
}

export default CandidateCard
