import { all } from 'redux-saga/effects'
import dashboardSaga from './dashboard'
import fieldsSaga from './fields'
import stashesSaga from './stashes'
import iteratorsSaga from './iterators'

export default function* () {
  yield all([
    dashboardSaga(),
    fieldsSaga(),
    stashesSaga(),
    iteratorsSaga()
  ])
}
