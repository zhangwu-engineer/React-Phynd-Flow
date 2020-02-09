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

function* updateStashesDataRequest({ payload }) {
  try {
    const data = payload.data;
    yield put(actions.updateStashesDataSuccess({ data, message: 'Stashes have been updated' }))
  } catch (e) {
    console.error(e)
    yield put(actions.updateStashesDataFailure({ message: e.message }))
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
  yield takeEvery(constants.UPDATE_STASHES_DATA_REQUEST, updateStashesDataRequest);
  yield takeEvery(constants.SET_STASHES_DATA_REQUEST, setStashesDataRequest);
}
