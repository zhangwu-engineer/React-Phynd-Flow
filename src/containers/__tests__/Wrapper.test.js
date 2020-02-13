import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { WrapperContainer } from 'containers/Dashboard/wrapper';
import Dashboard from 'containers/Dashboard';

describe('To test the Wrapper Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let wrapperComponent;
  const mockFn = jest.fn();
  let historyMock = { push: new mockFn() };
  const dashboardProps = {
    history: historyMock,
    dashboardReducer: {},
    dashboardList: [],
    fieldsList: [],
    isContactMap: true,
    updateDashboard: new mockFn(),
    updateFields: new mockFn(),
    stashData: new mockFn(),
    revertCTA: new mockFn(),
    submitCTA: new mockFn(),
    submitOne: new mockFn(),
    revertOne: new mockFn(),
  };

  beforeEach(() => {
    wrapperComponent = shallow(
      <WrapperContainer {...dashboardProps} />
    );
  });

  it("renders without crashing", () => {
    expect(wrapperComponent).not.toBe(null);
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

});
