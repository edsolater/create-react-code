import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
// 👇:material-ui core
import { PaperWhite, Button } from '@material-ui/core'
// 👇:material-ui icons
import { AddIcon } from '@material-ui/icons'

import { getUser, getHaha } from '../data/selectors'
import { getAction } from '../data/actionCreators'

const Wrapper = styled.section`
  width: 100;
  height: 200;
  backgroung-color: dodgerBlue;
`

const UserBoards = ({ user, haha, getAction }) => {
  return (
    <Wrapper className="UserBoards">
      <paper_white>
        <span>this is UserBoards</span>
      </paper_white>
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
