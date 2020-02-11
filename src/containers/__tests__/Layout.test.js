import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Layout from 'components/Layout';
import StyledButton from 'components/StyledButton';

let layoutComponent;
const historyMock = { push: jest.fn() };
const submitCTA = jest.fn();
const revertCTA = jest.fn();

describe('To test the Layout Component functionality.', () => {
  configure({ adapter: new Adapter() });

  beforeEach(() => {
    layoutComponent = shallow(
      <Layout
        history={historyMock}
        submitCTA={submitCTA}
        revertCTA={revertCTA}
      />
    );
  });

  it("renders without crashing", () => {
    const layoutComponentDefault = shallow(<Layout />);
    expect(layoutComponentDefault).toMatchSnapshot();
  });

  it("renders with history props", () => {
    expect(layoutComponent).toMatchSnapshot();
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


});
