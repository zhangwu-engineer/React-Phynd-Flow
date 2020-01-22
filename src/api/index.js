import dataDashboard from 'static/SampleJsonObject'
import dataField from 'static/FieldsPerEntity'

const getDashboardDataRequest = () => dataDashboard
const getEntityDataRequest = () => dataField

export {
  getDashboardDataRequest,
  getEntityDataRequest
}
