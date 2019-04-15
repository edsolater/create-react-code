import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'

import { Button } from '@material-ui/core'
import { AddIcon } from '@material-ui/icons'
import { getUser, getHaha } from '../redux/selectors'
import { getAction } from '../redux/actionCreators'

const FileStyle = styled.div`
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
const FileComponent = ({ user, haha, getAction }) => {
  const classes = useStyles()
  return (
    <FileStyle className="object:UserBoards">
      <Button className={classes.root}>UserBoards</Button>
    </FileStyle>
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
)(FileComponent)
