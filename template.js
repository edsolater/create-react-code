import React from 'react'
import { connect } from 'react-redux'

// import UserBoard from './UserBoard'
// import { getAllUserBoards } from '../data/selectors'

const FileName = ({ userBoards = [] }) => {
  return (
    <>
      {userBoards.map((userBoard, index) => (
        <UserBoard key={String(index)} self={userBoard} />
      ))}
    </>
  )
}
const mapState = (state) => ({
  userBoards: getAllUserBoards(state.userBoards)
})
export default connect(mapState)(FileName)

