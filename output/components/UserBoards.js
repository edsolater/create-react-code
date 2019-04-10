import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { PaperWhite, Button } from '@material-ui/core'
import { AddIcon } from '@material-ui/icons'
import { getUser, getHaha } from '../redux/selectors'
import { getAction } from '../redux/actionCreators'

const Wrapper = styled.div`
  width: 100;
  height: 200;
  background-color: dodgerBlue;
`
const useStyles = makeStyles(theme => ({
  root: {
    width: 10 * theme.spacing.unit,
    height: 10 * theme.spacing.unit
  }
}))
const UserBoards = ({ user, haha, getAction }) => {
  const classes = useStyles()
  return (
    <Wrapper className="element:UserBoards">
      <PaperWhite className={classes.root}>UserBoards</PaperWhite>
    </Wrapper>
  )
}
const mapState = state => ({
  user: getUser(state),
  haha: getHaha(state)
})
const mapDispatch = { getAction }

export default connect(
  mapState,
  mapDispatch
)(UserBoards)
