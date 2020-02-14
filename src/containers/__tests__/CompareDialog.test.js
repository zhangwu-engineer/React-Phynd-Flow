import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dialog from '@material-ui/core/Dialog';
import CompareDialog from 'containers/CompareDialog';
import { Column, Table } from 'react-virtualized';
import DialogActions from '@material-ui/core/DialogActions';
import StyledButton from 'components/StyledButton';

describe('To test the CompareDialog component functionality.', () => {
  configure({ adapter: new Adapter() });
  let dialogComponent;

  const mockFn = jest.fn();
  const dialogProps = {
    isModalShown: true,
    stasjesList: [],
    hideModal: new mockFn(),
    submitCTA: new mockFn(),
    submitOne: new mockFn(),
    revertOne: new mockFn(),
  };

  beforeEach(() => {
    dialogComponent = shallow(
      <CompareDialog {...dialogProps} />
    );
  });

  it("renders without crashing", () => {
    expect(dialogComponent).not.toBe(null);
  });

  it('should show Dialog component', () => {
    expect(dialogComponent.find(Dialog).props().open).toBe(dialogProps.isModalShown);
  });

  it('should transfer props to Table correctly', () => {
    const stashListLength = dialogProps.stashesList ? dialogProps.stashesList.length : 0
    expect(dialogComponent.find(Table).props().rowCount).toBe(stashListLength);
  });

  it('should generate others props in Table', () => {
    expect(dialogComponent.find(Table).props().width).not.toBeUndefined();
    expect(dialogComponent.find(Table).props().height).not.toBeUndefined();
    expect(dialogComponent.find(Table).props().headerHeight).not.toBeUndefined();
    expect(dialogComponent.find(Table).props().rowHeight).not.toBeUndefined();
    expect(dialogComponent.find(Table).props().rowGetter).not.toBeUndefined();
  });

  it('should generate Columns in Table', () => {
    expect(dialogComponent.find(Table).find(Column)).toHaveLength(5);
    expect(dialogComponent.find(Table).find(Column).at(0).props().cellRenderer).not.toBeUndefined();
    expect(dialogComponent.find(Table).find(Column).at(1).props().cellRenderer).not.toBeUndefined();
    expect(dialogComponent.find(Table).find(Column).at(2).props().cellRenderer).not.toBeUndefined();
    expect(dialogComponent.find(Table).find(Column).at(3).props().cellRenderer).not.toBeUndefined();
    expect(dialogComponent.find(Table).find(Column).at(4).props().cellRenderer).not.toBeUndefined();
  });

  it('should generate SubmitAll CTA in DialogActions', () => {
    const findCTA = dialogComponent.find(DialogActions).find(StyledButton);
    expect(findCTA).toHaveLength(1);
    expect(findCTA.first().props().onClick).toBe(dialogProps.submitCTA);
  });

});
