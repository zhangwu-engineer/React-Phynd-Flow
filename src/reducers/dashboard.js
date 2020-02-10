import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { cloneDeep, set, get } from 'lodash';
import * as constants from 'constants/index'
import {
  getPathFromPayload,
} from 'utils/helper';

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

const submitAllDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const submitAllDashboardDataSuccess = (state, { payload }) => {
  return update(state, {
    origin: { $set: cloneDeep(payload.data) },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const submitAllDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const submitOneDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const submitOneDashboardDataSuccess = (state, { payload }) => {
  const originData = cloneDeep(state.origin);
  const nestedSub = getPathFromPayload(payload.data);
  set(originData, nestedSub, payload.data.itemContent);
  return update(state, {
    origin: { $set: originData },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const submitOneDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})


const revertAllDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const revertAllDashboardDataSuccess = (state, { payload }) => {
  return update(state, {
    dashboard: { $set: cloneDeep(payload.data) },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const revertAllDashboardDataFailure = (state, { payload }) => update(state, {
  getDashboardData: {
    message: { $set: payload.message },
    status: { $set: constants.FAILURE },
    statusMeta: { $setStatusMeta: constants.FAILURE },
  }
})

const revertOneDashboardDataRequest = (state, { payload }) => {
  return update(state, {
    getDashboardData: {
      status: { $set: constants.LOADING },
      statusMeta: { $setStatusMeta: constants.LOADING },
    },
  })
}

const revertOneDashboardDataSuccess = (state, { payload }) => {
  const currentDashboard = cloneDeep(state.dashboard);
  const originData = cloneDeep(state.origin);
  const nestedSub = getPathFromPayload(payload.data);
  const dataToRevert = get(originData, nestedSub);
  set(currentDashboard, nestedSub, dataToRevert);
  return update(state, {
    dashboard: { $set: currentDashboard },
    getDashboardData: {
      message: { $set: payload.message },
      status: { $set: constants.SUCCESS },
      statusMeta: { $setStatusMeta: constants.SUCCESS },
    },
  })
}

const revertOneDashboardDataFailure = (state, { payload }) => update(state, {
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
  [constants.SUBMIT_ALL_DASHBOARD_DATA_REQUEST]: submitAllDashboardDataRequest,
  [constants.SUBMIT_ALL_DASHBOARD_DATA_SUCCESS]: submitAllDashboardDataSuccess,
  [constants.SUBMIT_ALL_DASHBOARD_DATA_FAILURE]: submitAllDashboardDataFailure,
  [constants.SUBMIT_ONE_DASHBOARD_DATA_REQUEST]: submitOneDashboardDataRequest,
  [constants.SUBMIT_ONE_DASHBOARD_DATA_SUCCESS]: submitOneDashboardDataSuccess,
  [constants.SUBMIT_ONE_DASHBOARD_DATA_FAILURE]: submitOneDashboardDataFailure,
  [constants.REVERT_ALL_DASHBOARD_DATA_REQUEST]: revertAllDashboardDataRequest,
  [constants.REVERT_ALL_DASHBOARD_DATA_SUCCESS]: revertAllDashboardDataSuccess,
  [constants.REVERT_ALL_DASHBOARD_DATA_FAILURE]: revertAllDashboardDataFailure,
  [constants.REVERT_ONE_DASHBOARD_DATA_REQUEST]: revertOneDashboardDataRequest,
  [constants.REVERT_ONE_DASHBOARD_DATA_SUCCESS]: revertOneDashboardDataSuccess,
  [constants.REVERT_ONE_DASHBOARD_DATA_FAILURE]: revertOneDashboardDataFailure,
}, initialState)
