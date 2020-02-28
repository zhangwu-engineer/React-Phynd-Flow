import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'
import * as queries from 'api'

function* getIteratorsListRequest({ payload }) {
  try {
    const data = yield call(queries.getEntityDataRequest.bind(null, {
      ...payload,
    }))

    yield put(actions.getIteratorsListSuccess({ data, message: 'Iterators have been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.getIteratorsListFailure({ message: e.message }))
  }
}

function* addIteratorsListRequest({ payload }) {
  try {
    const data = payload.data;
    const message = 'A new iterator has been added';
    yield put(actions.addIteratorsListSuccess({ data, message }))
  } catch (e) {
    console.error(e)
    yield put(actions.addIteratorsListFailure({ message: e.message }))
  }
}

export default function* () {
  yield takeEvery(constants.GET_STASHES_DATA_REQUEST, getIteratorsListRequest);
  yield takeEvery(constants.ADD_ITERATORS_LIST_REQUEST, addIteratorsListRequest);
}
