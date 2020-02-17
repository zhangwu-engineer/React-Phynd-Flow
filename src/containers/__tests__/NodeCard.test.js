import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NodeCard } from 'components/NodeCard';

describe('To test the Sidebar Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let nodeCardComponentActive;
  let nodeCardComponentInactive;

  const activeProps = {
    cardName: 'Column',
    activeCard: 'Column',
  };

  const inactiveProps = {
    cardName: 'Column',
    activeCard: 'Constant',
  };

  beforeEach(() => {
    nodeCardComponentActive = shallow(<NodeCard {...activeProps} />);
    nodeCardComponentInactive = shallow(<NodeCard {...inactiveProps} />);
  });

  it("renders without crashing", () => {
    expect(nodeCardComponentActive).not.toBeUndefined();
    expect(nodeCardComponentInactive).not.toBeUndefined();
  });

});
