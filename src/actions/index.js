import { createAction } from 'redux-actions'
import * as constants from 'constants/index'

export const getDashboardDataIdle = createAction(constants.GET_DASHBOARD_DATA_IDLE)
export const getDashboardDataRequest = createAction(constants.GET_DASHBOARD_DATA_REQUEST)
export const getDashboardDataSuccess = createAction(constants.GET_DASHBOARD_DATA_SUCCESS)
export const getDashboardDataFailure = createAction(constants.GET_DASHBOARD_DATA_FAILURE)

export const updateDashboardDataRequest = createAction(constants.UPDATE_DASHBOARD_DATA_REQUEST)
export const updateDashboardDataSuccess = createAction(constants.UPDATE_DASHBOARD_DATA_SUCCESS)
export const updateDashboardDataFailure = createAction(constants.UPDATE_DASHBOARD_DATA_FAILURE)

export const submitAllDashboardDataRequest = createAction(constants.SUBMIT_ALL_DASHBOARD_DATA_REQUEST)
export const submitAllDashboardDataSuccess = createAction(constants.SUBMIT_ALL_DASHBOARD_DATA_SUCCESS)
export const submitAllDashboardDataFailure = createAction(constants.SUBMIT_ALL_DASHBOARD_DATA_FAILURE)

export const submitOneDashboardDataRequest = createAction(constants.SUBMIT_ONE_DASHBOARD_DATA_REQUEST)
export const submitOneDashboardDataSuccess = createAction(constants.SUBMIT_ONE_DASHBOARD_DATA_SUCCESS)
export const submitOneDashboardDataFailure = createAction(constants.SUBMIT_ONE_DASHBOARD_DATA_FAILURE)

export const getFieldsPerEntityIdle = createAction(constants.GET_FIELDS_PER_ENTITY_IDLE)
export const getFieldsPerEntityRequest = createAction(constants.GET_FIELDS_PER_ENTITY_REQUEST)
export const getFieldsPerEntitySuccess = createAction(constants.GET_FIELDS_PER_ENTITY_SUCCESS)
export const getFieldsPerEntityFailure = createAction(constants.GET_FIELDS_PER_ENTITY_FAILURE)

export const updateFieldsDataRequest = createAction(constants.UPDATE_FIELDS_DATA_REQUEST)
export const updateFieldsDataSuccess = createAction(constants.UPDATE_FIELDS_DATA_SUCCESS)
export const updateFieldsDataFailure = createAction(constants.UPDATE_FIELDS_DATA_FAILURE)

export const getStashesDataIdle = createAction(constants.GET_STASHES_DATA_IDLE)
export const getStashesDataRequest = createAction(constants.GET_STASHES_DATA_REQUEST)
export const getStashesDataSuccess = createAction(constants.GET_STASHES_DATA_SUCCESS)
export const getStashesDataFailure = createAction(constants.GET_STASHES_DATA_FAILURE)

export const addStashesDataRequest = createAction(constants.ADD_STASHES_DATA_REQUEST)
export const addStashesDataSuccess = createAction(constants.ADD_STASHES_DATA_SUCCESS)
export const addStashesDataFailure = createAction(constants.ADD_STASHES_DATA_FAILURE)

export const setStashesDataRequest = createAction(constants.SET_STASHES_DATA_REQUEST)
export const setStashesDataSuccess = createAction(constants.SET_STASHES_DATA_SUCCESS)
export const setStashesDataFailure = createAction(constants.SET_STASHES_DATA_FAILURE)
