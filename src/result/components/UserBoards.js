import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import User from './User'
import TTT from './TTT'

const Wrapper = styled.div``

const UserBoards = ({ user, haha, getAction }) => {
  return (
    <Wrapper className="$TM_FILENAME_BASE">
      <span>this is $TM_FILENAME_BASE</span>
      <User />
      <TTT />
    </Wrapper>
  )
}
const mapState = (state) => ({
  user: getUser(state),
  haha: getHaha(state)
})
const mapDispatch = { getAction }

export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)
