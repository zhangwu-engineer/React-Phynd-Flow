import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NodeCard } from 'components/NodeCard';
import Card from '@material-ui/core/Card';
import { IconsList } from 'utils/iconsList';

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

  it("generates correct class name due to active status", () => {
    expect(nodeCardComponentActive.find(Card).prop('className')).toMatch(/cardActive/);
    expect(nodeCardComponentInactive.find(Card).prop('className')).toMatch(/cardInactive/);
  });

  it("renders CardIcon without crashing", () => {
    const CardIcon = IconsList[activeProps.cardName];
    expect(CardIcon).not.toBeUndefined();
  });
  

});
