import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sidebar from 'components/Sidebar';

describe('To test the Sidebar Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let sidebarComponent;
  const sidebarProps = {
    data: [],
  };

  beforeEach(() => {
    sidebarComponent = shallow(
      <Sidebar {...sidebarProps} />
    );
  });

  it("renders without crashing", () => {
    expect(sidebarComponent).not.toBeUndefined();
  });

});
