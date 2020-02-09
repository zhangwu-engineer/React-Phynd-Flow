import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LayoutContainer from 'components/Layout';
import CompareDialog from 'containers/CompareDialog';

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
import * as queries from 'api'

export const hoc = (Dashboard) => {
  class ProvidersHoc extends Component {
    state = {
      isCompareModalShown: false,
    }

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
      this.props.updateStashesDataRequest({ data });
    }

    revertStore = () => {
      console.log('Revert CTA required');
    }

    submitStore = () => {
      const data = this.props.dashboardReducer.dashboard;
      this.props.submitAllDashboardDataRequest({ data });
      console.log('Submit CTA required');
    }

    compareStore = () => {
      console.log('Compare CTA required');
      this.setState({ isCompareModalShown: true });
    }

    render() {
      const { isCompareModalShown } = this.state;
      return (
        <div>
          <LayoutContainer
            history={this.props.history}
            revertCTA={this.revertStore}
            submitCTA={this.submitStore}
            compareCTA={this.compareStore}
          />
          <Dashboard
            dashboardReducer={this.props.dashboardReducer}
            dashboardList={this.props.dashboardList}
            fieldsList={this.props.fieldsList}
            isContactMap={this.props.isContactMap}
            classes={this.props.classes}
            width={this.props.width}
            updateDashboard={this.updateDashboard}
            stashData={this.stashData}
            updateFields={this.updateFields}
            {...this.props}
          />
          <CompareDialog
            isModalShown={isCompareModalShown}
            stashesList={this.props.stashesList}
            hideModal={() => this.setState({ isCompareModalShown: false })}
            submitCTA={this.submitStore}
          />
        </div>
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

export default (Dashboard) => {
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
    updateStashesDataRequest: actions.updateStashesDataRequest,
    updateFieldsDataRequest: actions.updateFieldsDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(Dashboard)
  )
}
