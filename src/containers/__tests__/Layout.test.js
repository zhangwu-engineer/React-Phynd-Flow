import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Layout from 'components/Layout';
import StyledButton from 'components/StyledButton';

let layoutComponent;
const historyMock = { push: jest.fn() };

describe('To test the Layout Component functionality.', () => {
  configure({ adapter: new Adapter() });

  beforeEach(() => {
    layoutComponent = shallow(<Layout history={historyMock} />);
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


});
