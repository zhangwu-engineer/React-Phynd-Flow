import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NodeCard } from 'components/NodeCard';

describe('To test the Sidebar Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let nodeCardComponent;

  beforeEach(() => {
    nodeCardComponent = shallow(<NodeCard />);
  });

  it("renders without crashing", () => {
    expect(nodeCardComponent).not.toBeUndefined();
  });

});
