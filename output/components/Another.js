import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div``

const Another = ({}) => {
  return <Wrapper className="Another">unmodified</Wrapper>
}

const mapState = (state) => ({})
const mapDispatch = {}

export default connect(
  mapState,
  mapDispatch
)(Another)
