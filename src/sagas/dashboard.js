import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'
import { store } from 'react-notifications-component';
import { NOTIFICATION_FORMAT } from 'utils/helper';
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
    yield put(actions.updateDashboardDataSuccess({ data, message: 'Dashboard data has been updated' }))
  } catch (e) {
    console.error(e)
    yield put(actions.updateDashboardDataFailure({ message: e.message }))
  }
}

function* submitAllDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'Dashboard data has been submitted';

    yield put(actions.setStashesDataRequest({ data: [], message: 'Stash list should be empty now' }))
    yield put(actions.submitAllDashboardDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.submitAllDashboardDataFailure({ message: e.message }))
  }
}

function* submitOneDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'A stash has been submitted';

    yield put(actions.deleteStashesDataRequest({ data, message: 'A stash has been deleted from stashes list' }))
    yield put(actions.submitOneDashboardDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.submitOneDashboardDataFailure({ message: e.message }))
  }
}

function* revertAllDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'All dashboard data has been reverted';

    yield put(actions.setStashesDataRequest({ data: [], message: 'Stash list should be empty now' }))
    yield put(actions.revertAllDashboardDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.revertAllDashboardDataFailure({ message: e.message }))
  }
}

function* revertOneDashboardDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'The stash has been reverted';

    yield put(actions.deleteStashesDataRequest({ data, message: 'A stash has been deleted from stashes list' }))
    yield put(actions.revertOneDashboardDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.revertOneDashboardDataFailure({ message: e.message }))
  }
}

export default function* () {
  yield takeEvery(constants.GET_DASHBOARD_DATA_REQUEST, getDashboardDataRequest)
  yield takeEvery(constants.UPDATE_DASHBOARD_DATA_REQUEST, updateDashboardDataRequest)
  yield takeEvery(constants.SUBMIT_ALL_DASHBOARD_DATA_REQUEST, submitAllDashboardDataRequest)
  yield takeEvery(constants.SUBMIT_ONE_DASHBOARD_DATA_REQUEST, submitOneDashboardDataRequest)
  yield takeEvery(constants.REVERT_ALL_DASHBOARD_DATA_REQUEST, revertAllDashboardDataRequest)
  yield takeEvery(constants.REVERT_ONE_DASHBOARD_DATA_REQUEST, revertOneDashboardDataRequest)
}
