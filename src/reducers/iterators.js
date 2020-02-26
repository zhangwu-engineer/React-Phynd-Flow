import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'constants/index'
import { addOrReplaceIterator } from 'utils/helper'

export const initialState = {
  iteratorsList: null,

  getIteratorsList: {
    message: null,
    status: constants.IDLE,
    statusMeta: update({}, {$setStatusMeta: constants.IDLE})
  },
}

/**
 * GET_PROVIDER_REQUEST
 */

const getIteratorsListRequest = (state, { payload }) => {
  return update(state, {
    getIteratorsList: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const getIteratorsListSuccess = (state, { payload }) => {
  return update(state, {
    iteratorsList: { $set: payload.data },
    getIteratorsList: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const getIteratorsListFailure = (state, { payload }) => update(state, {
  getIteratorsList: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const getIteratorsListIdle = (state, { payload }) => update(state, {
  getIteratorsList: { $set: initialState.getIteratorsList },
})

const addIteratorsListRequest = (state, { payload }) => {
  return update(state, {
    getIteratorsList: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const addIteratorsListSuccess = (state, { payload }) => {
  return update(state, {
    iteratorsList: {
      $set: state.IteratorsList ?
      addOrReplaceIterator(state.IteratorsList, payload.data) :
        [payload.data]
    },
    getIteratorsList: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const addIteratorsListFailure = (state, { payload }) => update(state, {
  getIteratorsList: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

export default handleActions({
  [constants.GET_ITERATORS_LIST_REQUEST]: getIteratorsListRequest,
  [constants.GET_ITERATORS_LIST_SUCCESS]: getIteratorsListSuccess,
  [constants.GET_ITERATORS_LIST_FAILURE]: getIteratorsListFailure,
  [constants.GET_ITERATORS_LIST_IDLE]: getIteratorsListIdle,
  [constants.ADD_ITERATORS_LIST_REQUEST]: addIteratorsListRequest,
  [constants.ADD_ITERATORS_LIST_SUCCESS]: addIteratorsListSuccess,
  [constants.ADD_ITERATORS_LIST_FAILURE]: addIteratorsListFailure,
}, initialState)
