import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { UserBoards, ShelfBoard } from '../components'
import { selector1, selector2 } from '../data/selectors'

const Wrapper = styled.div``

const Parent = ({ hello, hei }) => {
  return (
    <Wrapper className="Parent">
      <span>this is Parent</span>
      <UserBoards />
      <ShelfBoard />
    </Wrapper>
  )
}

const mapState = (state) => ({
  hello: selector1(state),
  hei: selector2(state)
})
const mapDispatch = {}

export default connect(
  mapState,
  mapDispatch
)(Parent)
