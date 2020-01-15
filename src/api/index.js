import dashboardData from 'static/SampleJsonObject'
import providerData from 'static/FieldsPerEntity'
import locationData from 'static/FieldsPerEntityLocation'

const entityData = {
  'provider-module': providerData,
  'location-module': locationData,
}

const getDashboardDataRequest = () => dashboardData
const getEntityDataRequest = (mod) => entityData[mod.module]

export {
  getDashboardDataRequest,
  getEntityDataRequest
}
