import React from 'react'

function RecentActivities({ activities }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60 * 1000) {
      return '방금 전'
    } else if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}분 전`
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}시간 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case '새 지원자 추가':
        return '👤'
      case '지원자 정보 수정':
        return '✏️'
      case '지원자 삭제':
        return '🗑️'
      case '교육 게시물 작성':
        return '📝'
      case '교육 게시물 삭제':
        return '🗑️'
      case '데이터 복원':
        return '📥'
      default:
        return '📋'
    }
  }

  return (
    <div className="recent-activities">
      <h3>최근 활동</h3>
      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <div className="activity-title">활동 없음</div>
              <div className="activity-time">아직 활동이 없습니다</div>
            </div>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.type}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">{formatTime(activity.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentActivities
