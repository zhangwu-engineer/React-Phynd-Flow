import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Sidebar } from 'components/Sidebar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

describe('To test the Sidebar Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let sidebarComponent;
  const match = {
    params: {
      module: "provider-module",
      entity: "provider-details",
    },
  }
  const data = [
    {
      name: "Provider Details",
      link: "provider-details",
    },
    {
      name: "Addresses",
      link: "addresses",
    },
    {
      name: "Contacts",
      link: "contacts",
    },
  ];

  const sidebarProps = {
    match,
    data,
  };

  beforeEach(() => {
    sidebarComponent = shallow(<Sidebar {...sidebarProps} />);
  });

  it("renders without crashing", () => {
    expect(sidebarComponent).not.toBeUndefined();
  });

  it("renders the wrapping Drawer", () => {
    expect(sidebarComponent.find(Drawer)).toHaveLength(1);
  });

  it("renders ListItems according to the data props", () => {
    expect(sidebarComponent.find(List).find(ListItem)).toHaveLength(sidebarProps.data.length);
  });

  it("renders ListItems with ListItemText", () => {
    expect(sidebarComponent.find(List).find(ListItem).find(ListItemText)).toHaveLength(sidebarProps.data.length);
  });

  it("renders correct menu name", () => {
    sidebarProps.data.forEach((sidebarItem, index) => {
      if (sidebarItem.link === sidebarProps.match.params.entity) {
        expect(sidebarComponent.find(List).find(ListItem).find(ListItemText).get(index).props.primary).toEqual(sidebarItem.name);
        expect(sidebarComponent.find(List).find(ListItem).find(ListItemText).get(index).props.secondary).toBeUndefined();
      } else {
        expect(sidebarComponent.find(List).find(ListItem).find(ListItemText).get(index).props.secondary).toEqual(sidebarItem.name);
        expect(sidebarComponent.find(List).find(ListItem).find(ListItemText).get(index).props.primary).toBeUndefined();
      }
    });
  });

});
