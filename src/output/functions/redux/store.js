import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import multi from 'redux-multi'
import { Board, Item } from '../classes'
const initialState = {
  shelfBoards: {
    all: {
      0: new Board({
        type: 'shelfBoard',
        id: '0',
        name: 'S',
        items: []
      }),
      1: new Board({ type: 'shelfBoard', id: '1', name: 'I' }),
      2: new Board({ type: 'shelfBoard', id: '2', name: 'M' }),
      3: new Board({ type: 'shelfBoard', id: '3', name: 'P' }),
      4: new Board({ type: 'shelfBoard', id: '4', name: 'L' }),
      5: new Board({ type: 'shelfBoard', id: '5', name: 'E' }),
      length: 6
    },
    active: {
      type: 'shelfBoard',
      id: '0',
      name: 'S',
      items: []
    }
  },
  userBoards: {
    all: { 0: new Board({ name: 'default userBoard' }), length: 1 },
    active: {}
  },
  menuBoards: {
    all: {
      0: new Board({ type: 'menuBoard', id: 'menu-0000', name: 'shelf-menu' }),
      length: 1
    }
  },
  items: {
    all: {
      0: new Item({
        id: '0',
        title: 'NO.1 Item',
        subtitle: 'first one'
      }),
      length: 1
    }
  }
}
export default createStore(rootReducer, initialState, applyMiddleware([multi]))
