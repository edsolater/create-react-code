import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.section`
  width: 100;
  height: 200;
  backgroung-color: dodgerBlue;
`

const UserBoards = ({ user, haha, getAction }) => {
  return (
    <Wrapper className="UserBoards">
      <span>this is UserBoards</span>
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
