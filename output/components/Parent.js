import React from 'react'

import { UserBoards, ShelfBoard, Another } from '../components'

const FileComponent = ({}) => {
  return (
    <div className="container:Parent">
      Parent
      <UserBoards />
      <ShelfBoard />
      <Another />
    </div>
  )
}

export default FileComponent
