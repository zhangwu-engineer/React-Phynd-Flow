import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import dashboard from './dashboard'
import fields from './fields'

export default (history) => combineReducers({
  dashboard,
  fields,
  router: connectRouter(history),
})
