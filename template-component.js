import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

/* placeholder: import selectors */
/* placeholder: import actionCreators */
/* placeholder: import related components */

const Wrapper = styled.div``

const $TM_FILENAME_BASE = ({/* placeholder: get mapState Props *//* placeholder: get mapDispatch Props */}) => {
  return (
    <Wrapper>
      <span>this is $TM_FILENAME_BASE</span>
      {/* placeholder: use related components */}
    </Wrapper>
  )
}
/* placeholder: set mapState with selectors */
/* placeholder: set mapDispatch with actionCreators */

export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)
