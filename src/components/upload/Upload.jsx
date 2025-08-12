import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useToast } from '../../contexts/ToastContext'
import * as XLSX from 'xlsx'

function Upload() {
  const { addCandidate } = useData()
  const { showToast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('파일을 읽고 있습니다...')

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      setUploadStatus('데이터를 처리하고 있습니다...')

      let successCount = 0
      let errorCount = 0

      for (const row of jsonData) {
        try {
          const candidateData = {
            name: row['이름'] || row['성명'] || row['Name'] || '',
            email: row['이메일'] || row['Email'] || '',
            phone: row['전화번호'] || row['연락처'] || row['Phone'] || '',
            position: row['지원직무'] || row['직무'] || row['Position'] || '',
            status: 'new',
            notes: row['메모'] || row['비고'] || '',
            technicalTags: [],
            experienceTag: row['경험'] || row['경력'] || ''
          }

          if (candidateData.name && candidateData.email) {
            addCandidate(candidateData)
            successCount++
          } else {
            errorCount++
          }
        } catch (error) {
          errorCount++
        }
      }

      setUploadStatus(`업로드 완료: ${successCount}명 성공, ${errorCount}명 실패`)
      showToast(`${successCount}명의 지원자가 성공적으로 업로드되었습니다.`, 'success')

    } catch (error) {
      setUploadStatus('파일 업로드 중 오류가 발생했습니다.')
      showToast('파일 업로드에 실패했습니다.', 'error')
    } finally {
      setUploading(false)
      event.target.value = '' // 파일 입력 초기화
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleFileUpload(fakeEvent)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <div className="upload-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">데이터 업로드</h1>
          <p className="page-subtitle">
            엑셀 파일을 업로드하여 지원자 정보를 일괄 등록하세요
          </p>
        </div>
      </div>
      
      {/* Upload Area */}
      <div className="upload-section">
        <div 
          className="upload-area"
          onClick={() => document.getElementById('fileInput').click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ 
            opacity: uploading ? 0.5 : 1,
            pointerEvents: uploading ? 'none' : 'auto'
          }}
        >
          <div className="upload-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="upload-title">여기에 엑셀 파일을 드래그하거나 클릭하여 선택하세요</h3>
          <p className="upload-subtitle">지원되는 형식: .xlsx, .xls</p>
          <p className="upload-requirements">필요한 컬럼: 이름, 이메일, 전화번호, 지원직무</p>
          {uploading && (
            <div className="upload-loading">
              <div className="loading-spinner"></div>
              <p>업로드 중...</p>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          id="fileInput" 
          accept=".xlsx,.xls" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </div>
      
      {/* Upload Status */}
      {uploadStatus && (
        <div className="upload-status">
          <h4 className="status-title">업로드 상태</h4>
          <p className="status-message">{uploadStatus}</p>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="upload-instructions">
        <h4 className="instructions-title">업로드 가이드</h4>
        <div className="instructions-grid">
          <div className="instruction-item">
            <div className="instruction-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="instruction-content">
              <h5>엑셀 파일 형식</h5>
              <p>엑셀 파일의 첫 번째 시트가 사용됩니다</p>
            </div>
          </div>

          <div className="instruction-item">
            <div className="instruction-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="instruction-content">
              <h5>헤더 행</h5>
              <p>첫 번째 행은 헤더로 인식됩니다</p>
            </div>
          </div>

          <div className="instruction-item">
            <div className="instruction-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="instruction-content">
              <h5>필수 컬럼</h5>
              <p>이름, 이메일은 반드시 포함되어야 합니다</p>
            </div>
          </div>

          <div className="instruction-item">
            <div className="instruction-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="instruction-content">
              <h5>선택 컬럼</h5>
              <p>전화번호, 지원직무, 메모, 경험은 선택사항입니다</p>
            </div>
          </div>

          <div className="instruction-item">
            <div className="instruction-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="instruction-content">
              <h5>언어 지원</h5>
              <p>컬럼명은 한글 또는 영어를 사용할 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
