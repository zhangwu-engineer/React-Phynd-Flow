import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getDashboardReducer,
  getFieldsList,
  getStashesList,
  makeSidebarData,
  makeDashboardList,
  makeBlockList,
  isContactMap,
} from '../../selectors';

import * as actions from 'actions';

export const hoc = (WrapperContainer) => {
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

    stashData = data => {
      this.props.addStashesDataRequest({ data });
    }

    revertStore = () => {
      const data = this.props.dashboardReducer.origin;
      this.props.revertAllDashboardDataRequest({ data });
    }

    submitStore = () => {
      const data = this.props.dashboardReducer.dashboard;
      this.props.submitAllDashboardDataRequest({ data });
      
    }

    submitOne = (data) => {
      this.props.submitOneDashboardDataRequest({ data });
    }

    revertOne = (data) => {
      this.props.revertOneDashboardDataRequest({ data });
    }

    render() {
      return (
        <WrapperContainer
          history={this.props.history}
          dashboardReducer={this.props.dashboardReducer}
          dashboardList={this.props.dashboardList}
          fieldsList={this.props.fieldsList}
          isContactMap={this.props.isContactMap}
          updateDashboard={this.updateDashboard}
          updateFields={this.updateFields}
          stashData={this.stashData}
          revertCTA={this.revertStore}
          submitCTA={this.submitStore}
          submitOne={this.submitOne}
          revertOne={this.revertOne}
          classes={this.props.classes}
          width={this.props.width}
          {...this.props}
        />
      )
    }
  }

  ProvidersHoc.propTypes = {
    dashboardReducer: PropTypes.object,
    fieldsList: PropTypes.array,
    getProvidersRequest: PropTypes.func,
  }

  return withRouter(ProvidersHoc)
}

export default (WrapperContainer) => {
  const getSidebarData = makeSidebarData();
  const getDashboardList = makeDashboardList();
  const getBlockList = makeBlockList();

  const mapStateToProps = (state, props) => ({
    dashboardReducer: getDashboardReducer(state),
    dashboardList: getDashboardList(state, props),
    fieldsList: getFieldsList(state, props),
    stashesList: getStashesList(state),
    sidebarData: getSidebarData(state, props),
    blockList: getBlockList(state, props),
    isContactMap: isContactMap(state, props),
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
    updateDashboardDataRequest: actions.updateDashboardDataRequest,
    submitAllDashboardDataRequest: actions.submitAllDashboardDataRequest,
    submitOneDashboardDataRequest: actions.submitOneDashboardDataRequest,
    revertAllDashboardDataRequest: actions.revertAllDashboardDataRequest,
    revertOneDashboardDataRequest: actions.revertOneDashboardDataRequest,
    addStashesDataRequest: actions.addStashesDataRequest,
    updateFieldsDataRequest: actions.updateFieldsDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(WrapperContainer)
  )
}
