import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { cloneDeep } from 'lodash';
import * as constants from 'constants/index'

export const initialState = {
  dashboard: null,
  origin: null,
  getDashboardData: {
    message: null,
    status: constants.IDLE,
    statusMeta: update({}, {$setStatusMeta: constants.IDLE})
  },
}

/**
 * GET_PROVIDER_REQUEST
 */

const getDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const getDashboardDataSuccess = (state, { payload }) => {
  return update(state, {
    origin: { $set: cloneDeep(payload.data) },
    dashboard: { $set: payload.data },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const getDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const getDashboardDataIdle = (state, { payload }) => update(state, {
  getDashboardData: { $set: initialState.getDashboardData },
})

const updateDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const updateDashboardDataSuccess = (state, { payload }) => {
  return update(state, {
    dashboard: { $set: payload.data },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const updateDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const submitDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const submitDashboardDataSuccess = (state, { payload }) => {
  return update(state, {
    origin: { $set: payload.data },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const submitDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

export default handleActions({
  [constants.GET_DASHBOARD_DATA_REQUEST]: getDashboardDataRequest,
  [constants.GET_DASHBOARD_DATA_SUCCESS]: getDashboardDataSuccess,
  [constants.GET_DASHBOARD_DATA_FAILURE]: getDashboardDataFailure,
  [constants.GET_DASHBOARD_DATA_IDLE]: getDashboardDataIdle,
  [constants.UPDATE_DASHBOARD_DATA_REQUEST]: updateDashboardDataRequest,
  [constants.UPDATE_DASHBOARD_DATA_SUCCESS]: updateDashboardDataSuccess,
  [constants.UPDATE_DASHBOARD_DATA_FAILURE]: updateDashboardDataFailure,
  [constants.SUBMIT_DASHBOARD_DATA_REQUEST]: submitDashboardDataRequest,
  [constants.SUBMIT_DASHBOARD_DATA_SUCCESS]: submitDashboardDataSuccess,
  [constants.SUBMIT_DASHBOARD_DATA_FAILURE]: submitDashboardDataFailure,
}, initialState)
