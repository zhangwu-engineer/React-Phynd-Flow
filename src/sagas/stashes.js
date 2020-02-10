import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'

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
    yield put(actions.addStashesDataSuccess({ data, message: 'A new stash has been added' }))
  } catch (e) {
    console.error(e)
    yield put(actions.addStashesDataFailure({ message: e.message }))
  }
}

function* deleteStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    yield put(actions.deleteStashesDataSuccess({ data, message: 'The stash has been deleted' }))
  } catch (e) {
    console.error(e)
    yield put(actions.deleteStashesDataFailure({ message: e.message }))
  }
}

function* setStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    yield put(actions.setStashesDataSuccess({ data, message: 'Stashes have been set' }))
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
