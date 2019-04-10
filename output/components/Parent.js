import React from 'react'
import styled from 'styled-components'

import { UserBoards, ShelfBoard, Another } from '../components'

const Wrapper = styled.div``

const Parent = ({}) => {
  return (
    <Wrapper className="Parent">
      Parent
      <UserBoards />
      <ShelfBoard />
      <Another />
    </Wrapper>
  )
}

export default Parent
