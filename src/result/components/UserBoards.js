import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import User from './User'
import TTT from './TTT'

const Wrapper = styled.div``

const UserBoards = ({ user, haha, getAction }) => {
  return (
    <Wrapper className="UserBoards">
      <span>this is UserBoards</span>
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
)(UserBoards)
