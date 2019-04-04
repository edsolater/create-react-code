import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { UserBoards, ShelfBoard, Another } from '../components'
import { selector1, selector2 } from '../functions/selectors'

const Wrapper = styled.div``

const Parent = ({ hello, hei }) => {
  return (
    <Wrapper className="Parent">
      unmodified
      <UserBoards />
      <ShelfBoard />
      <Another />
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
