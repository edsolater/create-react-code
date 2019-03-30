import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getUser, getHaha } from '../data/selectors'

const Wrapper = styled.div``

const ShelfBoard = ({ user, haha }) => {
  return (
    <Wrapper className="ShelfBoard">
      {/* use material-ui coreMain::startTag */}
      <span>this is ShelfBoard</span>

      {/* use material-ui coreMain::endTag */}
    </Wrapper>
  )
}

const mapState = (state) => ({
  user: getUser(state),
  haha: getHaha(state)
})
const mapDispatch = {}

export default connect(
  mapState,
  mapDispatch
)(ShelfBoard)
