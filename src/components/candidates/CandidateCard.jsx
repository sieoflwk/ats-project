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
    <article 
      className="candidate-card" 
      data-id={candidate.id}
      role="article"
      aria-labelledby={`candidate-${candidate.id}-name`}
    >
      {/* 상태 표시 - 즉시 인식 가능한 시각적 단서 */}
      <div className={`status-indicator status-${candidate.status}`} 
           aria-label={`상태: ${getStatusLabel(candidate.status)}`}>
      </div>
      
      <div className={`status-badge status-${candidate.status}`}>
        {getStatusLabel(candidate.status)}
      </div>
      
      {/* 지원자 기본 정보 - 명확한 시각적 계층 */}
      <header className="candidate-header">
        <div className="candidate-avatar" aria-hidden="true">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="candidate-info">
          <h3 
            className="candidate-name title3" 
            id={`candidate-${candidate.id}-name`}
          >
            {candidate.name}
          </h3>
          <p className="candidate-position callout">{candidate.position}</p>
        </div>
      </header>

      {/* 연락처 정보 - 논리적 그룹화 */}
      <div className="candidate-details callout">
        {candidate.email && (
          <p>
            <span className="sr-only">이메일: </span>
            {candidate.email}
          </p>
        )}
        {candidate.phone && (
          <p>
            <span className="sr-only">전화번호: </span>
            {candidate.phone}
          </p>
        )}
        <p>
          <span className="sr-only">지원일: </span>
          {formatDate(candidate.createdAt)}
        </p>
      </div>

      {/* 태그 정보 - 관련 정보 그룹화 */}
      {(candidate.technicalTags?.length > 0 || candidate.experienceTag) && (
        <div className="tag-container" role="group" aria-label="지원자 태그">
          {candidate.technicalTags?.map(tag => (
            <span key={tag} className="tag technical" role="text">
              {tag}
            </span>
          ))}
          {candidate.experienceTag && (
            <span className="tag experience" role="text">
              {candidate.experienceTag}
            </span>
          )}
        </div>
      )}

      {/* 노트 - 추가 정보 */}
      {candidate.notes && (
        <div className="candidate-notes callout">
          <span className="sr-only">메모: </span>
          {candidate.notes}
        </div>
      )}

      {/* 액션 영역 - 점진적 공개 원칙 적용 */}
      <div className="candidate-actions" role="group" aria-label="지원자 관리 작업">
        {/* 주요 액션 - 80% 사용 케이스 */}
        <button 
          className="button button-secondary" 
          onClick={onEdit}
          aria-label={`${candidate.name} 정보 편집`}
        >
          편집
        </button>
        <button 
          className="button" 
          onClick={onScheduleInterview}
          aria-label={`${candidate.name} 면접 일정 설정`}
        >
          면접 일정
        </button>
        <button 
          className="button button-secondary" 
          onClick={onEvaluate}
          aria-label={`${candidate.name} 평가하기`}
        >
          평가
        </button>
        
        {/* 상태 변경 - 즉각적 피드백 */}
        <select
          value={candidate.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          aria-label={`${candidate.name}의 상태 변경`}
          className="status-select"
        >
          <option value="new">신규</option>
          <option value="screening">서류심사</option>
          <option value="interview">면접진행</option>
          <option value="offer">제안서발송</option>
          <option value="rejected">불합격</option>
        </select>
        
        {/* 위험한 액션 - 20% 사용 케이스, 구분되는 스타일 */}
        <button 
          className="button button-destructive" 
          onClick={handleDelete}
          aria-label={`${candidate.name} 삭제 (되돌릴 수 없음)`}
        >
          삭제
        </button>
      </div>
    </article>
  )
}

export default CandidateCard
