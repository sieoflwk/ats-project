import React, { useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import StatsCards from './StatsCards'
import StatusChart from './StatusChart'
import RecentActivities from './RecentActivities'
import TodayInterviews from './TodayInterviews'

function Dashboard() {
  const { candidates, activities } = useData()

  const stats = useMemo(() => {
    const total = candidates.length
    const newCandidates = candidates.filter(c => {
      const createdDate = new Date(c.createdAt)
      const today = new Date()
      return createdDate.toDateString() === today.toDateString()
    }).length

    const statusCounts = candidates.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1
      return acc
    }, {})

    return {
      total,
      new: newCandidates,
      interview: statusCounts.interview || 0,
      offer: statusCounts.offer || 0,
      statusCounts
    }
  }, [candidates])

  const todayInterviews = useMemo(() => {
    const today = new Date().toDateString()
    return candidates.filter(candidate => {
      return candidate.interviews?.some(interview => {
        const interviewDate = new Date(interview.date)
        return interviewDate.toDateString() === today
      })
    })
  }, [candidates])

  return (
    <div className="content-section active">
      <h2 className="section-title">대시보드</h2>
      <div className="dashboard-grid">
        <StatsCards
          total={stats.total}
          newCount={stats.new}
          interviewCount={stats.interview}
          offerCount={stats.offer}
        />
        
        <StatusChart statusCounts={stats.statusCounts} />
        
        <RecentActivities activities={activities.slice(0, 10)} />
        
        <TodayInterviews interviews={todayInterviews} />
      </div>
    </div>
  )
}

export default Dashboard
