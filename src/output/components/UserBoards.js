import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
// 👇:material-ui core
import { PaperWhite, Button } from '@material-ui/core'
// 👇:material-ui icons
import { AddIcon } from '@material-ui/icons'

const Wrapper = styled.section`
  width: 100;
  height: 200;
  backgroung-color: dodgerBlue;
`

const UserBoards = ({ user, haha, getAction }) => {
  return (
    <Wrapper className="UserBoards">
      {/* use material-ui coreMain::startTag */}
      <span>this is UserBoards</span>

      {/* use material-ui coreMain::endTag */}
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
