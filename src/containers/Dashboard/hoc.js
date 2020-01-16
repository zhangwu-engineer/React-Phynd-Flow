import React, { Component } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getIDFromName } from 'utils/helper';
import LayoutContainer from 'components/Layout'

import * as actions from 'actions';

const hoc = (Dashboard) => {
  class ProvidersHoc extends Component {
    componentDidMount() {
      window.scrollTo(0,0);
    }

    updateDashboard = data => {
      this.props.updateDashboardDataRequest({ data });
    }

    updateFields = data => {
      this.props.updateFieldsDataRequest({ data });
    }

    getFieldsDashboard = entity => {
      this.props.getFieldsPerEntityRequest({
        module: entity
      });
      this.props.getDashboardDataRequest({
        module: entity
      });
    }

    render() {
      return (
        <div>
          <LayoutContainer history={this.props.history} />
          <Dashboard
            dashboardReducer={this.props.dashboardReducer}
            fieldsReducer={this.props.fieldsReducer}
            classes={this.props.classes}
            width={this.props.width}
            updateDashboard={this.updateDashboard}
            updateFields={this.updateFields}
            getFieldsDashboard={this.getFieldsDashboard}
            {...this.props}
          />
        </div>
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
    sidebarData: state.fields.fields ? map(state.fields.fields, (value, name) => ({ name: name, link: getIDFromName(name) })) : {}
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
    updateDashboardDataRequest: actions.updateDashboardDataRequest,
    updateFieldsDataRequest: actions.updateFieldsDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(Dashboard)
  )
}
