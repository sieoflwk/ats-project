import React from 'react'

function TodayInterviews({ interviews = [] }) {
  // 안전한 데이터 처리
  const safeInterviews = interviews || []

  if (safeInterviews.length === 0) {
    return (
      <div className="interview-notifications">
        <h3>오늘 면접</h3>
        <div className="notification-list">
          <div className="empty-interview">
            <div className="empty-interview-icon">📅</div>
            <p>오늘 예정된 면접이 없습니다</p>
            <small>편안한 하루 되세요!</small>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#3B82F6'
      case 'completed':
        return '#10B981'
      case 'cancelled':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return '예정됨'
      case 'completed':
        return '완료됨'
      case 'cancelled':
        return '취소됨'
      default:
        return '알 수 없음'
    }
  }

  return (
    <div className="interview-notifications">
      <h3>오늘 면접</h3>
      <div className="notification-list">
        {safeInterviews.map((interview) => (
          <div key={interview.id} className="notification-item">
            <div className="notification-icon">
              {interview.avatar || '👤'}
            </div>
            <div className="notification-content">
              <div className="notification-title">
                {interview.candidate}
              </div>
              <div className="notification-details">
                <span className="position-badge">
                  {interview.position}
                </span>
                <span className="time-badge">
                  {interview.time}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(interview.status) }}
                >
                  {getStatusText(interview.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodayInterviews
