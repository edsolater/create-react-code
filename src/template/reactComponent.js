import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

/* import selectors */
/* import actionCreators */
/* import child components */

const Wrapper = styled./* wrapperType */ div`
  /* style */
`

const $TM_FILENAME_BASE = (
  {
    /* get mapState Props */
    /* get mapDispatch Props */
  }
) => {
  return (
    <Wrapper className="$TM_FILENAME_BASE">
      <span>this is $TM_FILENAME_BASE</span>
      {/* use child components */}
    </Wrapper>
  )
}
/* set mapState with selectors */
/* set mapDispatch with actionCreators */

export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)
