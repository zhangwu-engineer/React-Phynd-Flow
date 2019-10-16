import { all } from 'redux-saga/effects'
import dashboardSaga from './dashboard'
import fieldsSaga from './fields'

export default function* () {
  yield all([
    dashboardSaga(),
    fieldsSaga(),
  ])
}
