import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
/* import material-ui styles */

/* import material-ui core */
/* import material-ui icons */
/* import child components */
/* import selectors */
/* import actionCreators */

const Wrapper = styled./* wrapperType */ div`
  /* style */
`
/* set material-ui style */

const $TM_FILENAME_BASE = (
  {
    /* get mapState Props */
    /* get mapDispatch Props */
  }
) => {
  /* use material-ui style */

  return (
    <Wrapper className="$TM_FILENAME_BASE">
      {/* use material-ui coreMain::startTag */}
      unmodified
      {/* use child components */}
      {/* use material-ui coreMain::endTag */}
    </Wrapper>
  )
}

/* set mapState with selectors */
/* set mapDispatch with actionCreators */

export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)