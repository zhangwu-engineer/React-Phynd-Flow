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
      user: {
        isLoaded: true,
      },
    });
  });
  it('should render the component only when prop is true', () => {
    const Component = <Dashboard />;
    const ConditionalHOC = hoc(Component);
    const wrapper = shallow(<ConditionalHOC store={store} />);
    expect(wrapper).not.toBe(null);
  });
});
