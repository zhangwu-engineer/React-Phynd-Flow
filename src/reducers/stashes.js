import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'constants/index'
import { addOrReplaceStash } from 'utils/helper'

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

const addStashesDataRequest = (state, { payload }) => {
  return update(state, {
    getStashesData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const addStashesDataSuccess = (state, { payload }) => {
  return update(state, {
    stashes: {
      $set: state.stashes ?
        addOrReplaceStash(state.stashes, payload.data) :
        [payload.data]
    },
    getStashesData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const addStashesDataFailure = (state, { payload }) => update(state, {
  getStashesData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const setStashesDataRequest = (state, { payload }) => {
  return update(state, {
    getStashesData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const setStashesDataSuccess = (state, { payload }) => {
  return update(state, {
    stashes: { $set: payload.data },
    getStashesData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const setStashesDataFailure = (state, { payload }) => update(state, {
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
  [constants.ADD_STASHES_DATA_REQUEST]: addStashesDataRequest,
  [constants.ADD_STASHES_DATA_SUCCESS]: addStashesDataSuccess,
  [constants.ADD_STASHES_DATA_FAILURE]: addStashesDataFailure,
  [constants.SET_STASHES_DATA_REQUEST]: setStashesDataRequest,
  [constants.SET_STASHES_DATA_SUCCESS]: setStashesDataSuccess,
  [constants.SET_STASHES_DATA_FAILURE]: setStashesDataFailure,
}, initialState)
