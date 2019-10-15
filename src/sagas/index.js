import { all } from 'redux-saga/effects'
import dashboardSaga from './dashboard'

export default function* () {
  yield all([
    dashboardSaga(),
  ])
}
