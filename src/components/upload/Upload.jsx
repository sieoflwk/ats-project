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
    <div className="content-section active">
      <h2 className="section-title">엑셀 업로드</h2>
      <p className="section-subtitle">엑셀 파일을 업로드하여 지원자 정보를 일괄 등록하세요</p>
      
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
        <h3>📁 여기에 엑셀 파일을 드래그하거나 클릭하여 선택하세요</h3>
        <p>지원되는 형식: .xlsx, .xls</p>
        <p>필요한 컬럼: 이름, 이메일, 전화번호, 지원직무</p>
        {uploading && <p>⏳ 업로드 중...</p>}
      </div>
      
      <input 
        type="file" 
        id="fileInput" 
        accept=".xlsx,.xls" 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      {uploadStatus && (
        <div className="upload-status">
          <h4>업로드 상태</h4>
          <p>{uploadStatus}</p>
        </div>
      )}

      <div className="upload-instructions">
        <h4>📋 업로드 가이드</h4>
        <ul>
          <li>엑셀 파일의 첫 번째 시트가 사용됩니다</li>
          <li>첫 번째 행은 헤더로 인식됩니다</li>
          <li>필수 컬럼: 이름, 이메일</li>
          <li>선택 컬럼: 전화번호, 지원직무, 메모, 경험</li>
          <li>컬럼명은 한글 또는 영어를 사용할 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}

export default Upload
