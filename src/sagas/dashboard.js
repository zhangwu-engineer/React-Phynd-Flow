import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'

import * as queries from 'api'

function* getDashboardDataRequest({ payload }) {
  try {
    const data = yield call(queries.getDashboardDataRequest.bind(null, {
      ...payload,
    }))

    yield put(actions.getDashboardDataSuccess({ data, message: 'Dashboard data has been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.getDashboardDataFailure({ message: e.message }))
  }
}

function* updateDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    yield put(actions.updateDashboardDataSuccess({ data, message: 'Dashboard data has been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.updateDashboardDataFailure({ message: e.message }))
  }
}

function* submitAllDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    yield put(actions.submitAllDashboardDataSuccess({ data, message: 'Dashboard data has been submitted' }))
  } catch (e) {
    console.error(e)
    yield put(actions.submitAllDashboardDataFailure({ message: e.message }))
  }
}

export default function* () {
  yield takeEvery(constants.GET_DASHBOARD_DATA_REQUEST, getDashboardDataRequest)
  yield takeEvery(constants.UPDATE_DASHBOARD_DATA_REQUEST, updateDashboardDataRequest)
  yield takeEvery(constants.SUBMIT_ALL_DASHBOARD_DATA_REQUEST, submitAllDashboardDataRequest)
}
