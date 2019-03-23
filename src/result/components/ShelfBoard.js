import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div``

const ShelfBoard = ({}) => {
  return (
    <Wrapper className="$TM_FILENAME_BASE">
      <span>this is $TM_FILENAME_BASE</span>
    </Wrapper>
  )
}
const mapState = (state) => ({})
const mapDispatch = {}

export default connect(
  mapState,
  mapDispatch
)($TM_FILENAME_BASE)
