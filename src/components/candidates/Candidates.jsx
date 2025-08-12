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
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const statusMatch = statusFilter === 'all' || candidate.status === statusFilter

      // Tag filter
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.every(tag => 
          candidate.technicalTags?.includes(tag) || 
          candidate.experienceTag === tag
        )

      return searchMatch && statusMatch && tagMatch
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'date':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
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
      if (candidate.technicalTags) {
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

  return (
    <div className="content-section active">
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
        onEditCandidate={handleEditCandidate}
        onScheduleInterview={handleScheduleInterview}
        onEvaluateCandidate={handleEvaluateCandidate}
      />

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
