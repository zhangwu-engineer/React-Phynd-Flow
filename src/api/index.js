import dashboardData from 'static/SampleJsonObject'
import entityData from 'static/FieldsPerEntity'

const getDashboardDataRequest = () => dashboardData
const getEntityDataRequest = () => entityData

export {
  getDashboardDataRequest,
  getEntityDataRequest
}
