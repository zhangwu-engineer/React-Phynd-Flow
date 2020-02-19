import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Layout from 'components/Layout';
import StyledButton from 'components/StyledButton';

describe('To test the Layout Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let layoutComponent;
  let historyMock = { push: jest.fn() };
  const submitCTA = jest.fn();
  const revertCTA = jest.fn();
  const compareCTA = jest.fn();

  beforeEach(() => {
    layoutComponent = shallow(
      <Layout
        history={historyMock}
        submitCTA={submitCTA}
        revertCTA={revertCTA}
        compareCTA={compareCTA}
      />
    );
  });

  it("renders without crashing", () => {
    const layoutComponentDefault = shallow(<Layout />);
    expect(layoutComponentDefault).toMatchSnapshot();
  });

  it("renders with history props", () => {
    expect(layoutComponent).toMatchSnapshot();
    expect(layoutComponent.find(Tabs).prop('value')).toBe(0);
  });

  it("selects the active tab due to the module", () => {
    expect(layoutComponent.find(Tabs).prop('value')).toBe(0);
    historyMock = {
      location: {
        pathname: "/location-module/location-details"
      },
      push: jest.fn(),
    };
    layoutComponent = shallow(
      <Layout
        history={historyMock}
        submitCTA={submitCTA}
        revertCTA={revertCTA}
        compareCTA={compareCTA}
      />
    );
    expect(layoutComponent.find(Tabs).prop('value')).toBe(1);
  });

  it("generates 5 Tabs", () => {
    expect(layoutComponent.find(Tabs).find(Tab)).toHaveLength(5);    
  });

  it("generates 3 StyledButtons", () => {
    expect(layoutComponent.find(StyledButton)).toHaveLength(3);    
  });

  it("simulate SubmitAll button trigger", () => {
    const submitAllButton = layoutComponent.find(StyledButton).first();
    submitAllButton.simulate('click');
    expect(submitCTA.mock.calls.length).toEqual(1);
  });

  it("simulate RevertAll button trigger", () => {
    const revertAllButton = layoutComponent.find(StyledButton).at(2);
    revertAllButton.simulate('click');
    expect(revertCTA.mock.calls.length).toEqual(1);
  });

  it("simulate Compare button trigger", () => {
    const compareButton = layoutComponent.find(StyledButton).at(1);
    compareButton.simulate('click');
    expect(compareCTA.mock.calls.length).toEqual(1);
  });


});
