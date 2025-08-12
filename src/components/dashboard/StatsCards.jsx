import React from 'react'

function StatsCards() {
  const stats = [
    {
      title: '총 지원자',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      color: 'blue'
    },
    {
      title: '진행중인 채용',
      value: '8',
      change: '+2',
      changeType: 'positive',
      color: 'green'
    },
    {
      title: '이번 달 면접',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      color: 'purple'
    },
    {
      title: '채용 완료율',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      color: 'orange'
    }
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
                  <div key={index} className={`stat-card stat-card--${stat.color}`}>
            <div className="stat-header">
              <h3 className="stat-title">{stat.title}</h3>
              <div className={`stat-change stat-change--${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
          </div>
          
          <div className="stat-chart">
            <div className="stat-progress">
              <div 
                className="stat-progress-bar" 
                style={{ 
                  width: stat.title === '채용 완료율' ? '87%' : 
                         stat.title === '총 지원자' ? '75%' :
                         stat.title === '진행중인 채용' ? '60%' : '45%'
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
