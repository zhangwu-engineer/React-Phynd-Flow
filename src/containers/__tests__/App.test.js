import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { App } from '../App';

describe('To test the App Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let rootComponent = null;

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it(`should mount and check if Provider component exists.`, () => {
    rootComponent = mount(<App />);
    const isReduxProvider = rootComponent.find(Provider);
    expect(isReduxProvider).toHaveLength(1);
  });

  it(`should mount and check if PersistGate component exis`, () => {
    rootComponent = mount(<App />);
    const isPersistGate = rootComponent.find(PersistGate);
    expect(isPersistGate).toHaveLength(1);
  });

});
