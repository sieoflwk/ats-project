import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function InterviewModal({ candidate, onClose }) {
  const { updateCandidate } = useData()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    date: '',
    type: '1차',
    location: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.date) {
      showToast('면접 날짜를 선택해주세요.', 'error')
      return
    }

    const interview = {
      ...formData,
      id: Date.now().toString(),
      scheduledAt: new Date().toISOString()
    }

    const interviews = candidate.interviews || []
    updateCandidate(candidate.id, { 
      interviews: [...interviews, interview],
      status: 'interview'
    })

    showToast(`${candidate.name}님의 면접이 예약되었습니다.`, 'success')
    onClose()
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">면접 일정 등록</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>지원자</label>
              <input type="text" value={candidate?.name || ''} readOnly />
            </div>
            
            <div className="form-group">
              <label>면접 날짜</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>면접 유형</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="1차">1차 면접</option>
                <option value="2차">2차 면접</option>
                <option value="최종">최종 면접</option>
                <option value="기술">기술 면접</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>면접 장소</label>
              <input
                type="text"
                placeholder="면접 장소를 입력하세요"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>면접 메모</label>
              <textarea
                rows="3"
                placeholder="면접 관련 메모를 입력하세요"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>취소</button>
          <button className="btn btn-primary" onClick={handleSubmit}>저장</button>
        </div>
      </div>
    </div>
  )
}

export default InterviewModal
