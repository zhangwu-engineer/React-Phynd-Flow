import React from 'react';
import { configure, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import hoc from '../Dashboard/hoc';
import Dashboard from '../Dashboard';

let store, DashboardHOC, wrapper;
configure({ adapter: new Adapter() });

describe('<Hoc />', () => {
  beforeEach(() => {
    const mockStore = configureStore();

    // creates the store with any initial state or middleware needed
    store = mockStore({
      isLoaded: true,
    });

    DashboardHOC = hoc(<Dashboard />);
    wrapper = shallow(<DashboardHOC store={store} />);
  });

  it('should render the component only when prop is not null', () => {
    expect(wrapper).not.toBe(null);
  });

  it('should render the hoc with router', () => {
    expect(wrapper.find('withRouter(ProvidersHoc)')).toHaveLength(1);
  });

  it('should generate default props correctly', () => {
    expect(wrapper.find('withRouter(ProvidersHoc)').props().dashboardReducer).toBe(undefined);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().dashboardList).not.toBe(null);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().filedsReducer).toBe(undefined);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().fieldsList).toBe(undefined);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().blockList).toBe(undefined);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().sidebarData).toStrictEqual({});
    expect(wrapper.find('withRouter(ProvidersHoc)').props().isContactMap).toStrictEqual(false);
  });

});
