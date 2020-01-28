import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LayoutContainer from 'components/Layout';

import {
  getFieldsReducer,
  getDashboardReducer,
  getFieldsList,
  makeSidebarData,
  makeDashboardList,
  makeBlockList,
  isContactMap,
} from '../../selectors';

import * as actions from 'actions';

export const hoc = (Dashboard) => {
  class ProvidersHoc extends Component {
    constructor(props) {
      super(props);

      props.getDashboardDataRequest();
      props.getFieldsPerEntityRequest();
    }

    updateDashboard = data => {
      this.props.updateDashboardDataRequest({ data });
    }

    updateFields = data => {
      this.props.updateFieldsDataRequest({ data });
    }

    render() {
      return (
        <div>
          <LayoutContainer history={this.props.history} />
          <Dashboard
            dashboardReducer={this.props.dashboardReducer}
            dashboardList={this.props.dashboardList}
            fieldsReducer={this.props.fieldsReducer}
            fieldsList={this.props.fieldsList}
            isContactMap={this.props.isContactMap}
            classes={this.props.classes}
            width={this.props.width}
            updateDashboard={this.updateDashboard}
            updateFields={this.updateFields}
            {...this.props}
          />
        </div>
      )
    }
  }

  ProvidersHoc.propTypes = {
    dashboardReducer: PropTypes.object,
    fieldsReducer: PropTypes.object.isRequired,
    fieldsList: PropTypes.array,
    getProvidersRequest: PropTypes.func,
  }

  return withRouter(ProvidersHoc)
}

export default (Dashboard) => {
  const getSidebarData = makeSidebarData();
  const getDashboardList = makeDashboardList();
  const getBlockList = makeBlockList();

  const mapStateToProps = (state, props) => ({
    dashboardReducer: getDashboardReducer(state, props),
    dashboardList: getDashboardList(state, props),
    fieldsReducer: getFieldsReducer(state, props),
    fieldsList: getFieldsList(state, props),
    sidebarData: getSidebarData(state, props),
    blockList: getBlockList(state, props),
    isContactMap: isContactMap(state, props),
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
