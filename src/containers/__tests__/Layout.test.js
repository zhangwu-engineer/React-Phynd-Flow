import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Layout from 'components/Layout';


describe('To test the Layout Component functionality.', () => {
  configure({ adapter: new Adapter() });

  it("renders without crashing", () => {
    const layoutComponentDefault = shallow(<Layout />);
    expect(layoutComponentDefault).toMatchSnapshot();
  });

  it("renders with history props", () => {
    const historyMock = { push: jest.fn() };
    const layoutComponent = shallow(<Layout history={historyMock} />);
    expect(layoutComponent).toMatchSnapshot();
  });


});
