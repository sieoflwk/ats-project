import React, { useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function StatusChart({ statusCounts }) {
  const statusLabels = {
    new: '신규',
    screening: '서류심사',
    interview: '면접진행',
    offer: '제안서발송',
    rejected: '불합격'
  }

  const statusColors = {
    new: '#3B82F6',
    screening: '#F59E0B',
    interview: '#10B981',
    offer: '#8B5CF6',
    rejected: '#EF4444'
  }

  const data = {
    labels: Object.keys(statusCounts).map(status => statusLabels[status] || status),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || '#6B7280'),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed}명 (${percentage}%)`
          }
        }
      }
    },
    cutout: '60%'
  }

  if (Object.keys(statusCounts).length === 0) {
    return (
      <div className="chart-section">
        <div className="chart-container">
          <h3>지원자 상태 분포</h3>
          <div style={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#6B7280'
          }}>
            지원자가 없습니다
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-section">
      <div className="chart-container">
        <h3>지원자 상태 분포</h3>
        <div style={{ height: '300px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  )
}

export default StatusChart
