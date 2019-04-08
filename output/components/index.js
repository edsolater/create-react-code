import React from 'react'
import { Provider } from 'react-redux'
import store from '../redux/store'
import MaterialTheme from '../theme/material_ui'

import Parent from './Parent'
import UserBoards from './UserBoards'
import ShelfBoard from './ShelfBoard'
import Another from './Another'

export { Parent, UserBoards, ShelfBoard, Another }
export default () => (
  <Provider store={store}>
    <MaterialTheme>
      <Parent />
    </MaterialTheme>
  </Provider>
)
