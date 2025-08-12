import React, { createContext, useContext, useState, useEffect } from 'react'

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
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    }
  }

  const saveData = () => {
    try {
      localStorage.setItem('ats-candidates', JSON.stringify(candidates))
      localStorage.setItem('ats-education-posts', JSON.stringify(educationPosts))
      localStorage.setItem('ats-activities', JSON.stringify(activities))
    } catch (error) {
      console.error('데이터 저장 오류:', error)
    }
  }

  // 자동 저장
  useEffect(() => {
    saveData()
  }, [candidates, educationPosts, activities])

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
