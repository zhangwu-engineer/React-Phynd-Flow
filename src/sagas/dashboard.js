import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'

import * as queries from 'api'

function* getDashboardDataRequest({ payload }) {
  try {
    const data = yield call(queries.getDashboardDataRequest.bind(null, {
      ...payload,
    }))

    yield put(actions.getDashboardDataSuccess({ data, message: 'Providers have been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.getDashboardDataFailure({ message: e.message }))
  }
}

export default function* () {
  yield takeEvery(constants.GET_DASHBOARD_DATA_REQUEST, getDashboardDataRequest)
}
