import React from 'react'
import { connect } from 'react-redux'

import User from './User'
import TTT from './TTT'

/* placeholder: import selectors */

const UserBoards = (/* placeholder: use mapState */) => {
  return (
    <div className="UserBoards">
      <span>this is UserBoards</span>
      <User />
<TTT />

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
)(UserBoards)
