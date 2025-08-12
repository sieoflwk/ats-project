import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [candidates, setCandidates] = useState([])
  const [educationPosts, setEducationPosts] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // 로컬 스토리지에서 데이터 로드
    loadData()
  }, [])

  const loadData = () => {
    try {
      const savedCandidates = localStorage.getItem('ats-candidates')
      const savedPosts = localStorage.getItem('ats-education-posts')
      const savedActivities = localStorage.getItem('ats-activities')

      if (savedCandidates) {
        setCandidates(JSON.parse(savedCandidates))
      }
      if (savedPosts) {
        setEducationPosts(JSON.parse(savedPosts))
      }
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities))
      }

      // 데이터가 없으면 샘플 데이터 제공
      if (!savedCandidates && !savedPosts && !savedActivities) {
        console.log('샘플 데이터 생성 중...')
        createSampleData()
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error)
      // 오류 발생 시 샘플 데이터 생성
      createSampleData()
    }
  }

  const createSampleData = () => {
    const sampleCandidates = [
      {
        id: '1',
        name: '김개발',
        email: 'kim.dev@example.com',
        phone: '010-1234-5678',
        position: '프론트엔드 개발자',
        status: 'new',
        notes: 'React와 TypeScript에 능숙한 개발자',
        technicalTags: ['React', 'TypeScript', 'Node.js'],
        experienceTag: '경력',
        portfolio: 'https://portfolio.example.com',
        expectedSalary: '4000만원',
        availableDate: '2024-03-01',
        interviewNotes: '기술 면접 준비 필요',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: '이백엔드',
        email: 'lee.backend@example.com',
        phone: '010-2345-6789',
        position: '백엔드 개발자',
        status: 'screening',
        notes: 'Spring Boot와 AWS 경험 풍부',
        technicalTags: ['Java', 'Spring', 'AWS'],
        experienceTag: '시니어',
        portfolio: 'https://backend.example.com',
        expectedSalary: '6000만원',
        availableDate: '2024-02-15',
        interviewNotes: '시스템 설계 경험 확인 필요',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const samplePosts = [
      {
        id: '1',
        title: '효과적인 면접 질문 작성법',
        content: '지원자의 역량을 정확히 파악할 수 있는 면접 질문 작성 방법을 알아봅니다.',
        author: 'HR팀',
        category: '면접',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const sampleActivities = [
      {
        id: '1',
        type: '시스템 시작',
        description: 'Smart ATS 시스템이 시작되었습니다.',
        timestamp: new Date().toISOString()
      }
    ]

    setCandidates(sampleCandidates)
    setEducationPosts(samplePosts)
    setActivities(sampleActivities)

    // 샘플 데이터를 localStorage에 저장
    try {
      localStorage.setItem('ats-candidates', JSON.stringify(sampleCandidates))
      localStorage.setItem('ats-education-posts', JSON.stringify(samplePosts))
      localStorage.setItem('ats-activities', JSON.stringify(sampleActivities))
      console.log('샘플 데이터 생성 및 저장 완료')
    } catch (error) {
      console.error('샘플 데이터 저장 오류:', error)
    }
  }

  const saveData = useCallback(() => {
    try {
      localStorage.setItem('ats-candidates', JSON.stringify(candidates))
      localStorage.setItem('ats-education-posts', JSON.stringify(educationPosts))
      localStorage.setItem('ats-activities', JSON.stringify(activities))
      console.log('데이터 저장 완료:', { candidates: candidates.length, posts: educationPosts.length, activities: activities.length })
    } catch (error) {
      console.error('데이터 저장 오류:', error)
    }
  }, [candidates, educationPosts, activities])

  // 자동 저장
  useEffect(() => {
    if (candidates.length > 0 || educationPosts.length > 0 || activities.length > 0) {
      saveData()
    }
  }, [saveData])

  const addCandidate = (candidateData) => {
    const newCandidate = {
      id: Date.now().toString(),
      ...candidateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCandidates(prev => [...prev, newCandidate])
    addActivity('새 지원자 추가', `${candidateData.name}님이 ${candidateData.position}에 지원했습니다.`)
    return newCandidate
  }

  const updateCandidate = (id, updates) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === id 
        ? { ...candidate, ...updates, updatedAt: new Date().toISOString() }
        : candidate
    ))
    const candidate = candidates.find(c => c.id === id)
    if (candidate) {
      addActivity('지원자 정보 수정', `${candidate.name}님의 정보가 수정되었습니다.`)
    }
  }

  const deleteCandidate = (id) => {
    const candidate = candidates.find(c => c.id === id)
    setCandidates(prev => prev.filter(c => c.id !== id))
    if (candidate) {
      addActivity('지원자 삭제', `${candidate.name}님이 삭제되었습니다.`)
    }
  }

  const addEducationPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEducationPosts(prev => [...prev, newPost])
    addActivity('교육 게시물 작성', `"${postData.title}" 게시물이 작성되었습니다.`)
    return newPost
  }

  const updateEducationPost = (id, updates) => {
    setEducationPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...updates, updatedAt: new Date().toISOString() }
        : post
    ))
  }

  const deleteEducationPost = (id) => {
    const post = educationPosts.find(p => p.id === id)
    setEducationPosts(prev => prev.filter(p => p.id !== id))
    if (post) {
      addActivity('교육 게시물 삭제', `"${post.title}" 게시물이 삭제되었습니다.`)
    }
  }

  const addActivity = (type, description) => {
    const activity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date().toISOString()
    }
    setActivities(prev => [activity, ...prev.slice(0, 99)]) // 최대 100개 활동 저장
  }

  const exportData = () => {
    const data = {
      candidates,
      educationPosts,
      activities,
      exportedAt: new Date().toISOString()
    }
    return data
  }

  const importData = (data) => {
    try {
      if (data.candidates) setCandidates(data.candidates)
      if (data.educationPosts) setEducationPosts(data.educationPosts)
      if (data.activities) setActivities(data.activities)
      addActivity('데이터 복원', '백업 데이터가 성공적으로 복원되었습니다.')
      return true
    } catch (error) {
      console.error('데이터 가져오기 오류:', error)
      return false
    }
  }

  const resetData = () => {
    setCandidates([])
    setEducationPosts([])
    setActivities([])
    localStorage.removeItem('ats-candidates')
    localStorage.removeItem('ats-education-posts')
    localStorage.removeItem('ats-activities')
  }

  const value = {
    candidates,
    educationPosts,
    activities,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addEducationPost,
    updateEducationPost,
    deleteEducationPost,
    addActivity,
    exportData,
    importData,
    resetData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
