import React from 'react'

function EducationToolbar({ searchTerm, onSearchChange, onAddPost }) {
  return (
    <div className="toolbar">
      <h2 className="section-title">면접관 교육</h2>
      <div className="toolbar-actions">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="제목으로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
        <button className="btn" onClick={onAddPost}>
          + 새 게시물 작성
        </button>
      </div>
    </div>
  )
}

export default EducationToolbar
