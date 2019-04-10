import React from 'react'
import { connect } from 'react-redux'
import { getUser, getHaha } from '../redux/selectors'

const ShelfBoard = ({ user, haha }) => {
  return <div className="element:ShelfBoard">ShelfBoard</div>
}
const mapState = state => ({
  user: getUser(state),
  haha: getHaha(state)
})

export default connect(
  mapState,
  undefined
)(ShelfBoard)
