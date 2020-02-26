import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

import dashboard from './dashboard'
import fields from './fields'
import stashes from './stashes'
import iterators from './iterators'

export default (history) => combineReducers({
  dashboard,
  fields,
  stashes,
  iterators,
  router: connectRouter(history),
})
