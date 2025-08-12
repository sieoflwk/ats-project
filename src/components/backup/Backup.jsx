import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'

function Backup() {
  const { exportData, importData, resetData } = useData()
  const { showToast } = useToast()
  const [importing, setImporting] = useState(false)

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ats-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('백업 파일이 다운로드되었습니다.', 'success')
    } catch (error) {
      showToast('백업 다운로드에 실패했습니다.', 'error')
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImporting(true)
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (importData(data)) {
        showToast('백업 데이터가 성공적으로 복원되었습니다.', 'success')
      } else {
        showToast('백업 파일 형식이 올바르지 않습니다.', 'error')
      }
    } catch (error) {
      showToast('백업 파일을 읽을 수 없습니다.', 'error')
    } finally {
      setImporting(false)
      event.target.value = ''
    }
  }

  const handleReset = () => {
    if (window.confirm('모든 데이터가 삭제됩니다. 정말 초기화하시겠습니까?')) {
      if (window.confirm('정말로 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        resetData()
        showToast('모든 데이터가 초기화되었습니다.', 'success')
      }
    }
  }

  return (
    <div className="content-section active">
      <h2 className="section-title">백업/복원</h2>
      <p className="section-subtitle">데이터를 안전하게 백업하고 복원하세요</p>
      
      <div className="backup-actions">
        <div className="backup-card">
          <h3>📤 데이터 백업</h3>
          <p>현재 모든 데이터를 JSON 파일로 다운로드합니다.</p>
          <button className="btn" onClick={handleExport}>
            백업 다운로드
          </button>
        </div>
        
        <div className="backup-card">
          <h3>📥 데이터 복원</h3>
          <p>백업 파일을 업로드하여 데이터를 복원합니다.</p>
          <input 
            type="file" 
            id="backupFile" 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={handleImport}
            disabled={importing}
          />
          <button 
            className="btn" 
            onClick={() => document.getElementById('backupFile').click()}
            disabled={importing}
          >
            {importing ? '복원 중...' : '백업 파일 선택'}
          </button>
        </div>
        
        <div className="backup-card">
          <h3>🗑️ 데이터 초기화</h3>
          <p>모든 데이터를 삭제하고 초기 상태로 되돌립니다.</p>
          <button className="btn btn-danger" onClick={handleReset}>
            데이터 초기화
          </button>
        </div>
      </div>

      <div className="backup-info">
        <h4>💡 백업 안내</h4>
        <ul>
          <li>백업 파일은 JSON 형식으로 저장됩니다</li>
          <li>지원자 정보, 교육 게시물, 활동 기록이 모두 포함됩니다</li>
          <li>정기적인 백업을 권장합니다</li>
          <li>복원 시 기존 데이터는 덮어쓰기됩니다</li>
          <li>데이터 초기화는 되돌릴 수 없으니 신중히 사용하세요</li>
        </ul>
      </div>
    </div>
  )
}

export default Backup
