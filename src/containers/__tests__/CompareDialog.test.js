import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CompareDialog from 'containers/CompareDialog';


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


});
