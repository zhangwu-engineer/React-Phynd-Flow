import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CategoryDialog from 'containers/CategoryDialog';

describe('To test the CompareDialog component functionality.', () => {
  configure({ adapter: new Adapter() });
  let dialogComponent;

  beforeEach(() => {
    dialogComponent = shallow(
      <CategoryDialog />
    );
  });

  it("renders without crashing", () => {
    expect(dialogComponent).not.toBe(null);
  });

});
