import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LayoutContainer from 'components/Layout';

import { makeSidebarData, getFieldsList, makeDashboardList } from '../../selectors';

import * as actions from 'actions';

const hoc = (Dashboard) => {
  class ProvidersHoc extends Component {
    constructor(props) {
      super(props);

      props.getDashboardDataRequest();
      props.getFieldsPerEntityRequest();
    }

    componentDidMount() {
      window.scrollTo(0,0);
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

  const mapStateToProps = (state, props) => ({
    dashboardReducer: state.dashboard,
    dashboardList: getDashboardList(state, props),
    fieldsReducer: state.fields,
    fieldsList: getFieldsList(state, props),
    sidebarData: getSidebarData(state, props)
  })

  const mapDispatchToProps = {
    getDashboardDataRequest: actions.getDashboardDataRequest,
    updateDashboardDataRequest: actions.updateDashboardDataRequest,
    updateFieldsDataRequest: actions.updateFieldsDataRequest,
    getFieldsPerEntityRequest: actions.getFieldsPerEntityRequest,
    makeSidebarData,
    getFieldsList,
    makeDashboardList
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    hoc(Dashboard)
  )
}
