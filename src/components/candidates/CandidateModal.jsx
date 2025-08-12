import React, { useState, useEffect } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function CandidateModal({ candidate, onClose }) {
  const { addCandidate, updateCandidate } = useData()
  const { showToast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'new',
    notes: '',
    technicalTags: [],
    experienceTag: '',
    portfolio: '',
    expectedSalary: '',
    availableDate: '',
    interviewNotes: ''
  })

  useEffect(() => {
    if (candidate) {
      setFormData(candidate)
    }
  }, [candidate])

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // 실시간 유효성 검사
  useEffect(() => {
    console.log('formData changed:', formData)
  }, [formData])

  const totalSteps = 3

  const nextStep = () => {
    console.log('nextStep called, currentStep:', currentStep, 'totalSteps:', totalSteps)
    if (currentStep < totalSteps) {
      console.log('Moving to next step:', currentStep + 1)
      setCurrentStep(currentStep + 1)
    } else {
      console.log('Already at last step')
    }
  }

  const prevStep = () => {
    console.log('prevStep called, currentStep:', currentStep)
    if (currentStep > 1) {
      console.log('Moving to previous step:', currentStep - 1)
      setCurrentStep(currentStep - 1)
    } else {
      console.log('Already at first step')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('이름과 이메일은 필수입니다.', 'error')
      return
    }

    try {
      if (candidate) {
        updateCandidate(candidate.id, formData)
        showToast('지원자 정보가 수정되었습니다.', 'success')
      } else {
        addCandidate(formData)
        showToast('새 지원자가 추가되었습니다.', 'success')
      }
      onClose()
    } catch (error) {
      console.error(error);
      showToast('오류가 발생했습니다.', 'error')
    }
  }

  const handleTechnicalTagChange = (tag, checked) => {
    setFormData(prev => ({
      ...prev,
      technicalTags: checked 
        ? [...prev.technicalTags, tag]
        : prev.technicalTags.filter(t => t !== tag)
    }))
  }

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(step => (
        <div key={step} className={`step ${step <= currentStep ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && '기본정보'}
            {step === 2 && '상세정보'}
            {step === 3 && '확인'}
          </div>
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="step-content">
      <h4 className="step-title">기본 정보 입력</h4>
      <p className="step-description">지원자의 기본적인 정보를 입력해주세요.</p>
      
      <div className="form-group">
        <label className="form-label required">이름</label>
        <input
          type="text"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="지원자 이름을 입력하세요"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label required">이메일</label>
        <input
          type="email"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="이메일 주소를 입력하세요"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">전화번호</label>
        <input
          type="tel"
          className="form-input"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="연락처를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">지원직무</label>
        <input
          type="text"
          className="form-input"
          value={formData.position}
          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          placeholder="지원하는 직무를 입력하세요"
        />
      </div>

      {/* Step Actions */}
      <div className="step-actions">
        <div className="step-actions-right">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={nextStep}
            disabled={!canProceedToNext()}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="step-content">
      <h4 className="step-title">상세 정보 입력</h4>
      <p className="step-description">지원자의 경력과 기술 스택을 입력해주세요.</p>
      
      <div className="form-group">
        <label className="form-label">상태</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="new">신규</option>
          <option value="screening">서류심사</option>
          <option value="interview">면접진행</option>
          <option value="offer">제안서발송</option>
          <option value="rejected">불합격</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">경험 수준</label>
        <div className="tag-selection">
          {['신입', '경력', '시니어'].map(tag => (
            <div key={tag} className="tag-option">
              <input
                type="radio"
                id={`exp-${tag}`}
                name="experienceTag"
                value={tag}
                checked={formData.experienceTag === tag}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceTag: e.target.value }))}
              />
              <label htmlFor={`exp-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">기술 스택</label>
        <div className="tag-selection">
          {['React', 'Node.js', 'Python', 'Java', 'Spring', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Vue.js'].map(tag => (
            <div key={tag} className="tag-option">
              <input
                type="checkbox"
                id={`tag-${tag}`}
                checked={formData.technicalTags.includes(tag)}
                onChange={(e) => handleTechnicalTagChange(tag, e.target.checked)}
              />
              <label htmlFor={`tag-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">포트폴리오 URL</label>
        <input
          type="url"
          className="form-input"
          value={formData.portfolio}
          onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
          placeholder="포트폴리오 링크를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">희망 연봉</label>
        <input
          type="text"
          className="form-input"
          value={formData.expectedSalary}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))}
          placeholder="희망 연봉을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">입사 가능일</label>
        <input
          type="date"
          className="form-input"
          value={formData.availableDate}
          onChange={(e) => setFormData(prev => ({ ...prev, availableDate: e.target.value }))}
        />
      </div>

      {/* Step Actions */}
      <div className="step-actions">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={prevStep}
        >
          이전
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={nextStep}
        >
          다음
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="step-content">
      <h4 className="step-title">정보 확인</h4>
      <p className="step-description">입력한 정보를 확인하고 메모를 추가해주세요.</p>
      
      <div className="summary-section">
        <h5 className="summary-title">입력된 정보</h5>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">이름:</span>
            <span className="summary-value">{formData.name}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">이메일:</span>
            <span className="summary-value">{formData.email}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">전화번호:</span>
            <span className="summary-value">{formData.phone || '미입력'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">지원직무:</span>
            <span className="summary-value">{formData.position || '미입력'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">상태:</span>
            <span className="summary-value">
              {formData.status === 'new' && '신규'}
              {formData.status === 'screening' && '서류심사'}
              {formData.status === 'interview' && '면접진행'}
              {formData.status === 'offer' && '제안서발송'}
              {formData.status === 'rejected' && '불합격'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">경험수준:</span>
            <span className="summary-value">{formData.experienceTag || '미입력'}</span>
          </div>
        </div>
        
        {formData.technicalTags.length > 0 && (
          <div className="summary-item">
            <span className="summary-label">기술스택:</span>
            <div className="summary-tags">
              {formData.technicalTags.map(tag => (
                <span key={tag} className="summary-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">메모</label>
        <textarea
          className="form-textarea"
          rows="4"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="지원자에 대한 추가 메모를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">면접 메모</label>
        <textarea
          className="form-textarea"
          rows="3"
          value={formData.interviewNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, interviewNotes: e.target.value }))}
          placeholder="면접 시 참고할 메모를 입력하세요"
        />
      </div>

      {/* Step Actions */}
      <div className="step-actions">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={prevStep}
        >
          이전
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!canProceedToNext()}
        >
          {candidate ? '수정 완료' : '지원자 추가'}
        </button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  const canProceedToNext = () => {
    if (currentStep === 1) {
      const nameValid = formData.name.trim() !== ''
      const emailValid = formData.email.trim() !== ''
      const canProceed = nameValid && emailValid
      
      console.log('Step 1 validation:', { 
        name: formData.name.trim(), 
        nameValid,
        email: formData.email.trim(), 
        emailValid,
        canProceed 
      })
      return canProceed
    }
    return true
  }

  return (
    <div className="modal active">
      <div className="modal-content candidate-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {candidate ? '지원자 편집' : '지원자 추가'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}
        </form>
      </div>
    </div>
  )
}

export default CandidateModal
