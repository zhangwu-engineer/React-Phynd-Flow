import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import dashboard from './dashboard'
import fields from './fields'
import stashes from './stashes'

export default (history) => combineReducers({
  dashboard,
  fields,
  stashes,
  router: connectRouter(history),
})
