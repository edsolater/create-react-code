import React from 'react'
import { connect } from 'react-redux'

/* placeholder: import related components */
/* placeholder: import selectors */

const $TM_FILENAME_BASE = (/* placeholder: use mapState */) => {
  return (
    <div className="$TM_FILENAME_BASE">
      <span>this is $TM_FILENAME_BASE</span>
      {/* placeholder: use related component */}
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
)($TM_FILENAME_BASE)
