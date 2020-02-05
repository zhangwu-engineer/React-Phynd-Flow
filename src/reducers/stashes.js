import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'constants/index'

export const initialState = {
  stashes: null,

  getStashesData: {
    message: null,
    status: constants.IDLE,
    statusMeta: update({}, {$setStatusMeta: constants.IDLE})
  },
}

/**
 * GET_PROVIDER_REQUEST
 */

const getStashesDataRequest = (state, { payload }) => {
  return update(state, {
    getStashesData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const getStashesDataSuccess = (state, { payload }) => {
  return update(state, {
    stashes: { $set: payload.data },
    getStashesData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const getStashesDataFailure = (state, { payload }) => update(state, {
  getStashesData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const getStashesDataIdle = (state, { payload }) => update(state, {
  getStashesData: { $set: initialState.getStashesData },
})

const updateStashesDataRequest = (state, { payload }) => {
  return update(state, {
    getStashesData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const updateStashesDataSuccess = (state, { payload }) => {
  return update(state, {
    stashes: { $set: payload.data },
    getStashesData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const updateStashesDataFailure = (state, { payload }) => update(state, {
  getStashesData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

export default handleActions({
  [constants.GET_STASHES_DATA_REQUEST]: getStashesDataRequest,
  [constants.GET_STASHES_DATA_SUCCESS]: getStashesDataSuccess,
  [constants.GET_STASHES_DATA_FAILURE]: getStashesDataFailure,
  [constants.GET_STASHES_DATA_IDLE]: getStashesDataIdle,
  [constants.UPDATE_STASHES_DATA_REQUEST]: updateStashesDataRequest,
  [constants.UPDATE_STASHES_DATA_SUCCESS]: updateStashesDataSuccess,
  [constants.UPDATE_STASHES_DATA_FAILURE]: updateStashesDataFailure,
}, initialState)
