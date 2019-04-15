import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
/* import material-ui styles */
/* import material-ui core */
/* import material-ui icons */
/* import child components */
/* import selectors */
/* import actionCreators */

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
      <Button className={classes.root}>UserBoards</Button>
    </Wrapper>
  )
}
/* set mapState with selectors */
/* set mapDispatch with actionCreators */

export default connect(
  mapState,
  mapDispatch
)(UserBoards)
