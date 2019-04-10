import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getUser, getHaha } from '../redux/selectors'

const Wrapper = styled.div``

const ShelfBoard = ({ user, haha }) => {
  return <Wrapper className="ShelfBoard">ShelfBoard</Wrapper>
}

const mapState = state => ({
  user: getUser(state),
  haha: getHaha(state)
})

export default connect(
  mapState,
  undefined
)(ShelfBoard)
