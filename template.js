import React from 'react'
import { connect } from 'react-redux'

/* placeholder: import selectors */
/* placeholder: import related components */

const $TM_FILENAME_BASE = (/* placeholder: get mapState Props */) => {
  return (
    <div className="$TM_FILENAME_BASE">
      <span>this is $TM_FILENAME_BASE</span>
      {/* placeholder: use related component */}
    </div>
  )
}
/* placeholder: set mapState with selectors */
/* placeholder: set mapDispatch with actionCreators */
const mapDispatch = {
  //below is example
  //addShelfBoardItem
}

/* placeholder: export component */
export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)
