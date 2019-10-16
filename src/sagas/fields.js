import { call, put, takeEvery } from 'redux-saga/effects'
import * as constants from 'constants/index'
import * as actions from 'actions'

import * as queries from 'api'

function* getFieldsPerEntityRequest({ payload }) {
  try {
    const data = yield call(queries.getEntityDataRequest.bind(null, {
      ...payload,
    }))

    yield put(actions.getFieldsPerEntitySuccess({ data, message: 'Providers have been fetched' }))
  } catch (e) {
    console.error(e)
    yield put(actions.getFieldsPerEntityFailure({ message: e.message }))
  }
}

export default function* () {
  yield takeEvery(constants.GET_FIELDS_PER_ENTITY_REQUEST, getFieldsPerEntityRequest)
}
