import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { WrapperContainer } from 'containers/Dashboard/wrapper';
import LayoutContainer from 'components/Layout';
import Dashboard from 'containers/Dashboard';
import CompareDialog from 'containers/CompareDialog';
import ReactNofitication from 'react-notifications-component';

describe('To test the Wrapper Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let wrapperComponent;

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
    wrapperComponent = shallow(
      <WrapperContainer {...dashboardProps} />
    );
  });

  it("renders without crashing", () => {
    expect(wrapperComponent).not.toBe(null);
  });

  it('should genrate internal components correctly', () => {
    expect(wrapperComponent.find(ReactNofitication)).toHaveLength(1);
    expect(wrapperComponent.find(LayoutContainer)).toHaveLength(1);
    expect(wrapperComponent.find(CompareDialog)).toHaveLength(1);
    expect(wrapperComponent.find(Dashboard)).toHaveLength(1);
  });

  it('should transfer props to LayoutContainer correctly', () => {
    expect(wrapperComponent.find(LayoutContainer).props().history).toBe(dashboardProps.history);
  });

  it('should have other props in LayoutContainer', () => {
    expect(wrapperComponent.find(LayoutContainer).props().compareCTA).not.toBeUndefined();
  });

  it('should transfer props to Dashboard component correctly', () => {
    expect(wrapperComponent.find(Dashboard).props().dashboardReducer).toBe(dashboardProps.dashboardReducer);
    expect(wrapperComponent.find(Dashboard).props().dashboardList).toBe(dashboardProps.dashboardList);
    expect(wrapperComponent.find(Dashboard).props().fieldsList).toBe(dashboardProps.fieldsList);
    expect(wrapperComponent.find(Dashboard).props().isContactMap).toBe(dashboardProps.isContactMap);
    expect(wrapperComponent.find(Dashboard).props().updateDashboard).toBe(dashboardProps.updateDashboard);
    expect(wrapperComponent.find(Dashboard).props().stashData).toBe(dashboardProps.stashData);
    expect(wrapperComponent.find(Dashboard).props().updateFields).toBe(dashboardProps.updateFields);
  });

  it('should transfer props to CompareDialog correctly', () => {
    expect(wrapperComponent.find(CompareDialog).props().stashesList).toBe(dashboardProps.stashesList);
  });

  it('should have other props in CompareDialog', () => {
    expect(wrapperComponent.find(CompareDialog).props().isModalShown).toBe(false);
    expect(wrapperComponent.find(CompareDialog).props().hideModal).not.toBeUndefined();
  });

});
