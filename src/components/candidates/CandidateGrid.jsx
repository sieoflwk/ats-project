import React from 'react'
import CandidateCard from './CandidateCard'

function CandidateGrid({ candidates, onEditCandidate, onScheduleInterview, onEvaluateCandidate }) {
  if (candidates.length === 0) {
    return (
      <div className="candidates-grid">
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>지원자가 없습니다</h3>
          <p>새로운 지원자를 추가하거나 검색 조건을 변경해보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="candidates-grid">
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onEdit={() => onEditCandidate(candidate)}
          onScheduleInterview={() => onScheduleInterview(candidate)}
          onEvaluate={() => onEvaluateCandidate(candidate)}
        />
      ))}
    </div>
  )
}

export default CandidateGrid
