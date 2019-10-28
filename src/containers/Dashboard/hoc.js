import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getIDFromName } from 'utils/helper';

import * as actions from 'actions'

const hoc = (Dashboard) => {
  class ProvidersHoc extends React.Component {
    constructor(props) {
      super(props);

      props.getDashboardDataRequest();
      props.getFieldsPerEntityRequest();
    }

    componentDidMount() {
      window.scrollTo(0,0);
    }

    render() {
      return (
        <Dashboard
          dashboardReducer={this.props.dashboardReducer}
          fieldsReducer={this.props.fieldsReducer}
          classes={this.props.classes}
          width={this.props.width}
          {...this.props}
        />
      )
    }
  }

  ProvidersHoc.propTypes = {
    dashboardReducer: PropTypes.object.isRequired,
    fieldsReducer: PropTypes.object.isRequired,
    getProvidersRequest: PropTypes.func,
  }

  return withRouter(ProvidersHoc)
}

export default (Dashboard) => {
  const mapStateToProps = state => ({
    dashboardReducer: state.dashboard,
    fieldsReducer: state.fields,
    sidebarData: state.fields.fields ? Object.keys(state.fields.fields).map(name => ({ name: name, link: getIDFromName(name) })) : {}
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(Dashboard)
  )
}
