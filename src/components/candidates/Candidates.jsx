import React, { useState, useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import CandidateToolbar from './CandidateToolbar'
import CandidateGrid from './CandidateGrid'
import CandidateModal from './CandidateModal'
import InterviewModal from './InterviewModal'
import EvaluationModal from './EvaluationModal'

function Candidates() {
  const { candidates } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedTags, setSelectedTags] = useState([])
  
  // Modal states
  const [candidateModalOpen, setCandidateModalOpen] = useState(false)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      // Search filter
      const searchMatch = !searchTerm || 
        (candidate.name && candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.position && candidate.position.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const statusMatch = statusFilter === 'all' || candidate.status === statusFilter

      // Tag filter
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.every(tag => 
          (candidate.technicalTags && candidate.technicalTags.includes(tag)) || 
          candidate.experienceTag === tag
        )

      return searchMatch && statusMatch && tagMatch
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = (a.name || '').toLowerCase()
          bValue = (b.name || '').toLowerCase()
          break
        case 'date':
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
          break
        case 'status':
          aValue = a.status || ''
          bValue = b.status || ''
          break
        default:
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [candidates, searchTerm, statusFilter, selectedTags, sortBy, sortOrder])

  // Get all unique tags
  const availableTags = useMemo(() => {
    const technical = new Set()
    const experience = new Set()

    candidates.forEach(candidate => {
      if (candidate.technicalTags && Array.isArray(candidate.technicalTags)) {
        candidate.technicalTags.forEach(tag => technical.add(tag))
      }
      if (candidate.experienceTag) {
        experience.add(candidate.experienceTag)
      }
    })

    return {
      technical: Array.from(technical),
      experience: Array.from(experience)
    }
  }, [candidates])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = candidates.length
    const newCount = candidates.filter(c => c.status === 'new').length
    const screeningCount = candidates.filter(c => c.status === 'screening').length
    const interviewCount = candidates.filter(c => c.status === 'interview').length
    const offerCount = candidates.filter(c => c.status === 'offer').length
    const rejectedCount = candidates.filter(c => c.status === 'rejected').length

    return {
      total,
      new: newCount,
      screening: screeningCount,
      interview: interviewCount,
      offer: offerCount,
      rejected: rejectedCount
    }
  }, [candidates])

  // Safe percentage calculation
  const getPercentage = (count, total) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  const handleAddCandidate = () => {
    setEditingCandidate(null)
    setCandidateModalOpen(true)
  }

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate)
    setCandidateModalOpen(true)
  }

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate)
    setInterviewModalOpen(true)
  }

  const handleEvaluateCandidate = (candidate) => {
    setSelectedCandidate(candidate)
    setEvaluationModalOpen(true)
  }

  const handleSort = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
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

  return (
    <div className="candidates-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">지원자 관리</h1>
          <p className="page-subtitle">
            지원자 정보를 관리하고 채용 프로세스를 효율적으로 진행하세요
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleAddCandidate}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            지원자 추가
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">전체 지원자</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">신규 지원자</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.new}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${getPercentage(stats.new, stats.total)}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">면접 진행</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.interview}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${getPercentage(stats.interview, stats.total)}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">채용 완료</h3>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76488 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.offer}</div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${getPercentage(stats.offer, stats.total)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="status-distribution">
        <h3 className="section-title">지원자 상태 분포</h3>
        <div className="status-bars">
          {Object.entries(stats).filter(([key]) => key !== 'total').map(([status, count]) => (
            <div key={status} className="status-bar">
              <div className="status-label">
                <span className="status-dot" style={{ backgroundColor: getStatusColor(status) }}></span>
                {status === 'new' && '신규'}
                {status === 'screening' && '서류심사'}
                {status === 'interview' && '면접진행'}
                {status === 'offer' && '제안서발송'}
                {status === 'rejected' && '불합격'}
              </div>
              <div className="status-count">{count}</div>
              <div className="status-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${getPercentage(count, stats.total)}%`,
                    backgroundColor: getStatusColor(status)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <CandidateToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSort={handleSort}
          onAddCandidate={handleAddCandidate}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />

        <CandidateGrid
          candidates={filteredCandidates}
          onEdit={handleEditCandidate}
          onScheduleInterview={handleScheduleInterview}
          onEvaluate={handleEvaluateCandidate}
        />
      </div>

      {/* Modals */}
      {candidateModalOpen && (
        <CandidateModal
          candidate={editingCandidate}
          onClose={() => setCandidateModalOpen(false)}
        />
      )}

      {interviewModalOpen && (
        <InterviewModal
          candidate={selectedCandidate}
          onClose={() => setInterviewModalOpen(false)}
        />
      )}

      {evaluationModalOpen && (
        <EvaluationModal
          candidate={selectedCandidate}
          onClose={() => setEvaluationModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Candidates
