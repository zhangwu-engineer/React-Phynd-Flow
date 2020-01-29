import React from 'react';
import { configure, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import hoc from '../Dashboard/hoc';
import Dashboard from '../Dashboard';

let store;
configure({ adapter: new Adapter() });

describe('<Hoc />', () => {
  beforeEach(() => {
    const mockStore = configureStore();

    // creates the store with any initial state or middleware needed
    store = mockStore({
      isLoaded: true,
    });
  });

  it('should render the component only when prop is not null', () => {
    const DashboardHOC = hoc(<Dashboard />);
    const wrapper = shallow(<DashboardHOC store={store} />);
    expect(wrapper).not.toBe(null);
  });

  it('should render the hoc', () => {
    const DashboardHOC = hoc(<Dashboard />);
    const wrapper = shallow(<DashboardHOC store={store} />);
    expect(wrapper.find('withRouter(ProvidersHoc)')).toHaveLength(1);
  });

  it('should generate props correctly', () => {
    const DashboardHOC = hoc(<Dashboard />);
    const wrapper = shallow(<DashboardHOC store={store} />);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().dashboardReducer).toBe(undefined);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().sidebarData).toStrictEqual({});
    expect(wrapper.find('withRouter(ProvidersHoc)').props().isContactMap).toStrictEqual(false);
    expect(wrapper.find('withRouter(ProvidersHoc)').props().dashboardList).not.toBe(null);
  });

});
