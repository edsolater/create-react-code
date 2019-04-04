import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { UserBoards, ShelfBoard, Another } from '../components'
import { selector1, selector2 } from '../functions/redux/selectors'

const Wrapper = styled.div`
  // this component has no style
`

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
