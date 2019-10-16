import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actions from 'actions'

const hoc = (ProvidersContainer) => {
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
        <ProvidersContainer
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

export default (ProvidersContainer) => {
  const mapStateToProps = state => ({
    dashboardReducer: state.dashboard,
    fieldsReducer: state.fields,
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(ProvidersContainer)
  )
}
