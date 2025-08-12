import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function EvaluationModal({ candidate, onClose }) {
  const { updateCandidate } = useData()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    technicalScore: '',
    communicationScore: '',
    culturalFitScore: '',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const { technicalScore, communicationScore, culturalFitScore } = formData
    
    if (!technicalScore || !communicationScore || !culturalFitScore) {
      showToast('모든 점수를 입력해주세요.', 'error')
      return
    }

    const evaluation = {
      ...formData,
      id: Date.now().toString(),
      evaluatedAt: new Date().toISOString(),
      totalScore: (parseInt(technicalScore) + parseInt(communicationScore) + parseInt(culturalFitScore)) / 3
    }

    const evaluations = candidate.evaluations || []
    updateCandidate(candidate.id, { 
      evaluations: [...evaluations, evaluation]
    })

    showToast(`${candidate.name}님의 평가가 저장되었습니다.`, 'success')
    onClose()
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">면접 평가</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>지원자</label>
              <input type="text" value={candidate?.name || ''} readOnly />
            </div>
            
            <div className="form-group">
              <label>기술력 (1-10점)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.technicalScore}
                onChange={(e) => setFormData(prev => ({ ...prev, technicalScore: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>커뮤니케이션 (1-10점)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.communicationScore}
                onChange={(e) => setFormData(prev => ({ ...prev, communicationScore: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>문화적합성 (1-10점)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.culturalFitScore}
                onChange={(e) => setFormData(prev => ({ ...prev, culturalFitScore: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>평가 메모</label>
              <textarea
                rows="3"
                placeholder="평가 의견을 입력하세요"
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

export default EvaluationModal
