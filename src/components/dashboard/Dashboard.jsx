import React from 'react'
import StatsCards from './StatsCards'
import StatusChart from './StatusChart'
import RecentActivities from './RecentActivities'
import TodayInterviews from './TodayInterviews'

function Dashboard() {
  // 샘플 데이터 - 실제로는 API나 컨텍스트에서 가져올 데이터
  const sampleStatusCounts = {
    new: 45,
    screening: 32,
    interview: 28,
    offer: 15,
    rejected: 23
  }

  const sampleActivities = [
    {
      id: 1,
      type: 'candidate_added',
      message: '김철수 지원자가 추가되었습니다',
      time: '2시간 전',
      icon: '👤'
    },
    {
      id: 2,
      type: 'interview_scheduled',
      message: '이영희 면접이 오늘 오후 2시로 예정되었습니다',
      time: '4시간 전',
      icon: '📅'
    },
    {
      id: 3,
      type: 'offer_sent',
      message: '박민수에게 제안서가 발송되었습니다',
      time: '1일 전',
      icon: '📧'
    }
  ]

  const sampleInterviews = [
    {
      id: 1,
      candidate: '김철수',
      position: '프론트엔드 개발자',
      time: '오후 2:00',
      status: 'scheduled',
      avatar: '👨‍💻'
    },
    {
      id: 2,
      candidate: '이영희',
      position: '백엔드 개발자',
      time: '오후 3:30',
      status: 'scheduled',
      avatar: '👩‍💻'
    },
    {
      id: 3,
      candidate: '박민수',
      position: 'UI/UX 디자이너',
      time: '오후 5:00',
      status: 'completed',
      avatar: '🎨'
    }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">대시보드</h1>
        <p className="dashboard-subtitle">
          오늘의 채용 현황과 주요 지표를 한눈에 확인하세요
        </p>
      </div>
      
      <StatsCards />
      
      <div className="dashboard-grid">
        <div className="chart-section">
          <StatusChart statusCounts={sampleStatusCounts} />
        </div>
        
        <div className="activities-section">
          <RecentActivities activities={sampleActivities} />
        </div>
      </div>
      
      <div className="interviews-section">
        <TodayInterviews interviews={sampleInterviews} />
      </div>
    </div>
  )
}

export default Dashboard
