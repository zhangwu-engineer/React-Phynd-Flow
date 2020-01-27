import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
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

  it(`should mount and check if it has got a provider.`, () => {
    rootComponent = mount(<App />);
      const isReduxProvider = rootComponent.find(Provider);
      expect(isReduxProvider).toHaveLength(1);
  });
});
