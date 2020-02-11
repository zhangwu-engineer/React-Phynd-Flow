import React from 'react';
import { configure, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import hoc from '../Dashboard/hoc';
import LayoutContainer from 'components/Layout';

let store, LayoutHOCDefault, layoutWrapperDefault;

describe('<Hoc />', () => {
  configure({ adapter: new Adapter() });

  beforeEach(() => {
    const mockStore = configureStore();

    // creates the store with any initial state or middleware needed
    store = mockStore({
      isLoaded: true,
    });

    LayoutHOCDefault = hoc(<LayoutContainer />);
    layoutWrapperDefault = shallow(<LayoutHOCDefault store={store} />);

  });

  it('should render the LayoutContainer component only when prop is not null', () => {
    expect(layoutWrapperDefault).not.toBe(null);
  });

  it('should render the hoc with router', () => {
    expect(layoutWrapperDefault.find('withRouter(ProvidersHoc)')).toHaveLength(1);
  });

  it('should generate default props of Dashboard component correctly', () => {
    expect(layoutWrapperDefault.find('withRouter(ProvidersHoc)').props().history).not.toBe(null);
  });

});
