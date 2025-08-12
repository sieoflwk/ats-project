import React from 'react'

function TodayInterviews({ interviews }) {
  const getTodayInterviews = () => {
    const today = new Date().toDateString()
    const todayInterviews = []

    interviews.forEach(candidate => {
      if (candidate.interviews) {
        candidate.interviews.forEach(interview => {
          const interviewDate = new Date(interview.date)
          if (interviewDate.toDateString() === today) {
            todayInterviews.push({
              ...interview,
              candidateName: candidate.name,
              candidatePosition: candidate.position
            })
          }
        })
      }
    })

    return todayInterviews.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const todayInterviews = getTodayInterviews()

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case '1차':
        return '#3B82F6'
      case '2차':
        return '#F59E0B'
      case '최종':
        return '#10B981'
      case '기술':
        return '#8B5CF6'
      default:
        return '#6B7280'
    }
  }

  return (
    <div className="interview-notifications">
      <h3>오늘 면접</h3>
      <div className="notification-list">
        {todayInterviews.length === 0 ? (
          <div className="notification-item">
            <div className="notification-icon">📅</div>
            <div className="notification-content">
              <div className="notification-title">오늘 예정된 면접이 없습니다</div>
              <div className="notification-time">편안한 하루 되세요!</div>
            </div>
          </div>
        ) : (
          todayInterviews.map((interview, index) => (
            <div key={index} className="notification-item">
              <div className="notification-icon">🎯</div>
              <div className="notification-content">
                <div className="notification-title">
                  {interview.candidateName} ({interview.candidatePosition})
                </div>
                <div className="notification-details">
                  <span 
                    className="interview-type-badge"
                    style={{ backgroundColor: getTypeColor(interview.type) }}
                  >
                    {interview.type} 면접
                  </span>
                  <span className="notification-time">
                    {formatTime(interview.date)}
                  </span>
                  {interview.location && (
                    <span className="notification-location">
                      📍 {interview.location}
                    </span>
                  )}
                </div>
                {interview.notes && (
                  <div className="notification-notes">
                    💬 {interview.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TodayInterviews
