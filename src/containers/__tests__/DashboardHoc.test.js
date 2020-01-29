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
      dashboardReducer: {},
    });
  });
  it('should render the component only when prop is not null', () => {
    const DashboardHOC = hoc(<Dashboard />);
    const wrapper = shallow(<DashboardHOC store={store} />);
    expect(wrapper).not.toBe(null);
  });
});
