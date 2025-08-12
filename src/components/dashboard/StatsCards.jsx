import React from 'react'

function StatsCards({ total, newCount, interviewCount, offerCount }) {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-number">{total}</div>
        <div className="stat-label">전체 지원자</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{newCount}</div>
        <div className="stat-label">신규 지원자</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{interviewCount}</div>
        <div className="stat-label">면접 진행</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{offerCount}</div>
        <div className="stat-label">제안서 발송</div>
      </div>
    </div>
  )
}

export default StatsCards
