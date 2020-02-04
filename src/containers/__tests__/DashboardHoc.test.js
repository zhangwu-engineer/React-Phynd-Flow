import React from 'react';
import { configure, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import hoc from '../Dashboard/hoc';
import Dashboard from '../Dashboard';

let store, DashboardHOCDefault, wrapperDefault, DashboardHOC, wrapper;
const mockFn = jest.fn();
const dashboardProps = {
  getDashboardDataRequest: new mockFn(),
  updateDashboardDataRequest: new mockFn(),
  updateFieldsDataRequest: new mockFn(),
  getFieldsPerEntityRequest: new mockFn(),
};

describe('<Hoc />', () => {
  configure({ adapter: new Adapter() });

  beforeEach(() => {
    const mockStore = configureStore();

    // creates the store with any initial state or middleware needed
    store = mockStore({
      isLoaded: true,
    });

    DashboardHOCDefault = hoc(<Dashboard />);

    wrapperDefault = shallow(<DashboardHOCDefault store={store} />);

    DashboardHOC = hoc(<Dashboard {...dashboardProps} />);
    wrapper = shallow(<DashboardHOC store={store} />);
  });

  it('should render the Dashboard component only when prop is not null', () => {
    expect(wrapperDefault).not.toBe(null);
    expect(wrapper).not.toBe(null);
  });

  it('should render the hoc with router', () => {
    expect(wrapperDefault.find('withRouter(ProvidersHoc)')).toHaveLength(1);
    expect(wrapper.find('withRouter(ProvidersHoc)')).toHaveLength(1);
  });

  it('should generate default props of Dashboard component correctly', () => {
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().dashboardReducer).toBe(undefined);
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().dashboardList).not.toBe(null);
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().filedsReducer).toBe(undefined);
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().fieldsList).toBe(undefined);
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().blockList).toBe(undefined);
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().sidebarData).toStrictEqual({});
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().isContactMap).toStrictEqual(false);
  });

});
