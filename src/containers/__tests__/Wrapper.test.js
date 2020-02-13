import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { WrapperContainer } from 'containers/Dashboard/wrapper';


describe('To test the Wrapper Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let wrapperComponent;


  beforeEach(() => {
    wrapperComponent = shallow(
      <WrapperContainer />
    );
  });

  it("renders without crashing", () => {
    expect(wrapperComponent).not.toBe(null);
  });

});
