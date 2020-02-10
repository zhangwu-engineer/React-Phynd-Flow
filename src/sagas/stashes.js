import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'
import { store } from 'react-notifications-component';
import { NOTIFICATION_FORMAT } from 'utils/helper';
import * as queries from 'api'

function* getStashesDataRequest({ payload }) {
  try {
    const data = yield call(queries.getEntityDataRequest.bind(null, {
      ...payload,
    }))

    yield put(actions.getStashesDataSuccess({ data, message: 'Stashes have been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.getStashesDataFailure({ message: e.message }))
  }
}

function* addStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'A new stash has been added';
    yield put(actions.addStashesDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.addStashesDataFailure({ message: e.message }))
  }
}

function* deleteStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'The stash has been deleted';

    yield put(actions.deleteStashesDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.deleteStashesDataFailure({ message: e.message }))
  }
}

function* setStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'Stashes have been set';
    
    yield put(actions.setStashesDataSuccess({ data, message }))

    store.addNotification({
      ...NOTIFICATION_FORMAT,
      title: 'SUCCESS',
      message,
    })
  } catch (e) {
    console.error(e)
    yield put(actions.setStashesDataFailure({ message: e.message }))
  }
}


export default function* () {
  yield takeEvery(constants.GET_STASHES_DATA_REQUEST, getStashesDataRequest);
  yield takeEvery(constants.ADD_STASHES_DATA_REQUEST, addStashesDataRequest);
  yield takeEvery(constants.DELETE_STASHES_DATA_REQUEST, deleteStashesDataRequest);
  yield takeEvery(constants.SET_STASHES_DATA_REQUEST, setStashesDataRequest);
}
