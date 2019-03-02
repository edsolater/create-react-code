import React from 'react'
import { connect } from 'react-redux'


/* placeholder: import selectors */

const ShelfBoard = (/* placeholder: use mapState */) => {
  return (
    <div className="ShelfBoard">
      <span>this is ShelfBoard</span>
      
    </div>
  )
}
/* placeholder: set mapState with selector */
const mapState = (state) => ({
  //below is example
  //userBoards: getAllUserBoards(state.userBoards)
})
const mapDispatch = {
  //below is example
  //addShelfBoardItem
}
export default connect(
  /* placeholder: connect mapState */
  mapDispatch
)(ShelfBoard)
