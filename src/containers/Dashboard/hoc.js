import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as actions from 'actions'

const hoc = (ProvidersContainer) => {
  class ProvidersHoc extends React.Component {
    constructor(props) {
      super(props);

      props.getDashboardDataRequest({ a: 1 });
    }

    componentDidMount() {
      window.scrollTo(0,0);
    }

    render() {
      return (
        <ProvidersContainer
          dashboardReducer={this.props.dashboardReducer}
          classes={this.props.classes}
          width={this.props.width}
        />
      )
    }
  }

  ProvidersHoc.propTypes = {
    dashboardReducer: PropTypes.object.isRequired,
    getProvidersRequest: PropTypes.func,
  }

  return ProvidersHoc
}

export default (ProvidersContainer) => {

  const mapStateToProps = (state, props) => ({
    dashboardReducer: state.dashboard,
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(ProvidersContainer)
  )
}
