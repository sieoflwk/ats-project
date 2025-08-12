import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import EducationToolbar from './EducationToolbar'
import EducationGrid from './EducationGrid'
import EducationModal from './EducationModal'

function Education() {
  const { educationPosts } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  const filteredPosts = educationPosts.filter(post =>
    !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPost = () => {
    setEditingPost(null)
    setModalOpen(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setModalOpen(true)
  }

  return (
    <div className="content-section active">
      <EducationToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddPost={handleAddPost}
      />

      <EducationGrid
        posts={filteredPosts}
        onEditPost={handleEditPost}
      />

      {modalOpen && (
        <EducationModal
          post={editingPost}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Education
