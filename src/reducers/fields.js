import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'constants/index'

export const initialState = {
  fields: null,

  getFieldsData: {
    message: null,
    status: constants.IDLE,
    statusMeta: update({}, {$setStatusMeta: constants.IDLE})
  },
}

/**
 * GET_PROVIDER_REQUEST
 */

const getFieldsPerEntityRequest = (state, { payload }) => {
  return update(state, {
    getFieldsData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const getFieldsPerEntitySuccess = (state, { payload }) => {
  return update(state, {
    fields: { $set: payload.data },
    getFieldsData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const getFieldsPerEntityFailure = (state, { payload }) => update(state, {
  getFieldsData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const getFieldsPerEntityIdle = (state, { payload }) => update(state, {
  getFieldsData: { $set: initialState.getFieldsData },
})

export default handleActions({
  [constants.GET_FIELDS_PER_ENTITY_REQUEST]: getFieldsPerEntityRequest,
  [constants.GET_FIELDS_PER_ENTITY_SUCCESS]: getFieldsPerEntitySuccess,
  [constants.GET_FIELDS_PER_ENTITY_FAILURE]: getFieldsPerEntityFailure,
  [constants.GET_FIELDS_PER_ENTITY_IDLE]: getFieldsPerEntityIdle,
}, initialState)
