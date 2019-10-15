import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import dashboard from './dashboard'

export default (history) => combineReducers({
  dashboard,
  router: connectRouter(history),
})
