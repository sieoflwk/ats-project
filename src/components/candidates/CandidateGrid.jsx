import React from 'react'

function CandidateGrid({ candidates, onEdit, onScheduleInterview, onEvaluate }) {
  if (candidates.length === 0) {
    return (
      <div className="candidates-table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>지원자가 없습니다</h3>
          <p>새로운 지원자를 추가하거나 검색 조건을 변경해보세요.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'var(--primary)'
      case 'screening': return 'var(--warning)'
      case 'interview': return 'var(--success)'
      case 'offer': return 'var(--primary-dark)'
      case 'rejected': return 'var(--danger)'
      default: return 'var(--gray-500)'
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

  return (
    <div className="candidates-table-container">
      <div className="table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th className="th-name">이름</th>
              <th className="th-position">지원직무</th>
              <th className="th-email">이메일</th>
              <th className="th-phone">연락처</th>
              <th className="th-status">상태</th>
              <th className="th-tags">기술스택</th>
              <th className="th-date">지원일</th>
              <th className="th-actions">관리</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id} className="candidate-row">
                <td className="td-name">
                  <div className="candidate-name-cell">
                    <div className="candidate-avatar">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="candidate-name">{candidate.name}</span>
                  </div>
                </td>
                <td className="td-position">
                  <span className="position-text">{candidate.position || '-'}</span>
                </td>
                <td className="td-email">
                  <span className="email-text">{candidate.email}</span>
                </td>
                <td className="td-phone">
                  <span className="phone-text">{candidate.phone || '-'}</span>
                </td>
                <td className="td-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(candidate.status) + '20', color: getStatusColor(candidate.status) }}
                  >
                    {getStatusLabel(candidate.status)}
                  </span>
                </td>
                <td className="td-tags">
                  <div className="tags-cell">
                    {candidate.technicalTags?.slice(0, 2).map(tag => (
                      <span key={tag} className="tag technical">
                        {tag}
                      </span>
                    ))}
                    {candidate.technicalTags?.length > 2 && (
                      <span className="tag-more">+{candidate.technicalTags.length - 2}</span>
                    )}
                    {candidate.experienceTag && (
                      <span className="tag experience">
                        {candidate.experienceTag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="td-date">
                  <span className="date-text">{formatDate(candidate.createdAt)}</span>
                </td>
                <td className="td-actions">
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEdit(candidate)}
                      title="편집"
                    >
                      편집
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => onScheduleInterview(candidate)}
                      title="면접 일정"
                    >
                      면접
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEvaluate(candidate)}
                      title="평가"
                    >
                      평가
                    </button>
                    <select
                      value={candidate.status}
                      onChange={(e) => {
                        // 상태 변경 로직은 상위 컴포넌트에서 처리
                        console.log('Status change:', candidate.id, e.target.value)
                      }}
                      className="status-select-small"
                      title="상태 변경"
                    >
                      <option value="new">신규</option>
                      <option value="screening">서류심사</option>
                      <option value="interview">면접진행</option>
                      <option value="offer">제안서발송</option>
                      <option value="rejected">불합격</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CandidateGrid
