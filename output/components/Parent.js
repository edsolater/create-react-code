import React from 'react'
import { UserBoards, ShelfBoard, Another } from '../components'

const Parent = ({}) => {
  return (
    <div className="container:Parent">
      Parent
      <UserBoards />
      <ShelfBoard />
      <Another />
    </div>
  )
}

export default Parent
