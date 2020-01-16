import providerDashboard from 'static/SampleJsonObject'
import locationDashboard from 'static/SampleJsonObjectLocation'
import providerData from 'static/FieldsPerEntity'
import locationData from 'static/FieldsPerEntityLocation'

const entityData = {
  'provider-module': providerData,
  'location-module': locationData,
}

const dashboardData = {
  'provider-module': providerDashboard,
  'location-module': locationDashboard,
}

const getDashboardDataRequest = (mod) => dashboardData[mod.module]
const getEntityDataRequest = (mod) => entityData[mod.module]

export {
  getDashboardDataRequest,
  getEntityDataRequest
}
