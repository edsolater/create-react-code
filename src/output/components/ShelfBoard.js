import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getUser, getHaha } from '../functions/selectors'

const Wrapper = styled.div``

const ShelfBoard = ({ user, haha }) => {
  return <Wrapper className="ShelfBoard">unmodified</Wrapper>
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
