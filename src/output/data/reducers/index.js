import { combineReducers } from 'redux'
import items from './items'
import shelfBoard from './shelfBoard'
import userBoard from './userBoard'
export default combineReducers({ items, shelfBoard, userBoard })
