import React from 'react';
import { configure, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import hoc from 'containers/Dashboard/hoc';
import WrapperContainer from 'containers/Dashboard/wrapper';

describe('<Hoc />', () => {
  configure({ adapter: new Adapter() });
  let store, DashboardHOCDefault, wrapperDefault, DashboardHOC, wrapper;

  let historyMock = { push: jest.fn() };
  const dashboardProps = {
    history: historyMock,
    dashboardReducer: {},
    dashboardList: [],
    fieldsList: [],
    isContactMap: true,
    updateDashboard: jest.fn(),
    updateFields: jest.fn(),
    stashData: jest.fn(),
    revertCTA: jest.fn(),
    submitCTA: jest.fn(),
    submitOne: jest.fn(),
    revertOne: jest.fn(),
  };

  beforeEach(() => {
    const mockStore = configureStore();

    // creates the store with any initial state or middleware needed
    store = mockStore({
      isLoaded: true,
    });

    DashboardHOCDefault = hoc(<WrapperContainer />);
    wrapperDefault = shallow(<DashboardHOCDefault store={store} />);

    DashboardHOC = hoc(<WrapperContainer {...dashboardProps} />);
    wrapper = shallow(<DashboardHOC store={store} />);
  });

  it('should render the wrapper component only when prop is not null', () => {
    expect(wrapperDefault).not.toBe(null);
    expect(wrapper).not.toBe(null);
  });

  it('should render the hoc with router', () => {
    expect(wrapperDefault.find('withRouter(ProvidersHoc)')).toHaveLength(1);
    expect(wrapper.find('withRouter(ProvidersHoc)')).toHaveLength(1);
  });

  it('should generate default props of wrapper component correctly', () => {
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().dashboardReducer).toBeUndefined();
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().fieldsList).toBeUndefined();
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().stashesList).toBeUndefined();
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().blockList).toBeUndefined();
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().dashboardList).not.toBeUndefined();
    expect(wrapperDefault.find('withRouter(ProvidersHoc)').props().sidebarData).not.toBeUndefined();
  });

});
