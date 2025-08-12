import React from 'react'

function CandidateToolbar({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  onSort, 
  onAddCandidate,
  availableTags,
  selectedTags,
  onToggleTag
}) {
  return (
    <div className="toolbar">
      <h2 className="section-title">지원자 관리</h2>
      <div className="toolbar-actions">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="이름, 이메일, 직무로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="filter-box">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="new">신규</option>
            <option value="screening">서류심사</option>
            <option value="interview">면접진행</option>
            <option value="offer">제안서발송</option>
            <option value="rejected">불합격</option>
          </select>
        </div>
        
        <div className="sort-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={() => onSort('name', 'asc')}
          >
            이름순 ↑
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onSort('date', 'desc')}
          >
            날짜순 ↓
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onSort('status', 'asc')}
          >
            상태순 ↑
          </button>
        </div>
        
        <button className="btn btn-primary" onClick={onAddCandidate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          지원자 추가
        </button>
      </div>
      
      {/* Tag Filters */}
      <div className="tag-filters">
        {availableTags.technical && availableTags.technical.map(tag => (
          <button
            key={tag}
            className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
        {availableTags.experience && availableTags.experience.map(tag => (
          <button
            key={tag}
            className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CandidateToolbar
