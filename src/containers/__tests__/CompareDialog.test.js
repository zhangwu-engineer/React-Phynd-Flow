import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CompareDialog from 'containers/CompareDialog';
import { Table } from 'react-virtualized';

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

  it('should transfer props to Table correctly', () => {
    const stashListLength = dialogProps.stashesList ? dialogProps.stashesList.length : 0
    expect(dialogComponent.find(Table).props().rowCount).toBe(stashListLength);
  });

});
