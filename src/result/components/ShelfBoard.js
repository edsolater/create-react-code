import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div``

const ShelfBoard = ({}) => {
  return (
    <Wrapper className="ShelfBoard">
      {/* use material-ui coreMain::startTag */}
      <span>this is ShelfBoard</span>

      {/* use material-ui coreMain::endTag */}
    </Wrapper>
  )
}

const mapState = (state) => ({})
const mapDispatch = {}

export default connect(
  mapState,
  mapDispatch
)(ShelfBoard)
