import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'
import { ConfirmProvider } from 'material-ui-confirm'
import { muiTheme, styledTheme } from 'services/bootstrap';
import Routes from 'Routes'
import { HashRouter } from 'react-router-dom'

import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { App } from '../App';
import { AppContainer } from '../App';

describe('To test the App Component functionality.', () => {
  configure({ adapter: new Adapter() });
  let rootComponent;

  beforeEach(() => {
    rootComponent = mount(<App />);
  });

  it("renders without crashing", () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });

  it(`should mount and check if Provider component exists.`, () => {
    const isReduxProvider = rootComponent.find(Provider);
    expect(isReduxProvider).toHaveLength(1);
  });

  it(`should mount and check if PersistGate component exists.`, () => {
    const isPersistGate = rootComponent.find(PersistGate);
    expect(isPersistGate).toHaveLength(1);
  });

  it(`should mount and check if AppContainer component exists.`, () => {
    const isApplicationProvider = rootComponent.find(AppContainer);
    expect(isApplicationProvider).toHaveLength(1);
  });

  it(`should mount and check if AppContainer children components exist.`, () => {
    const appContainer = shallow(
      <AppContainer />
    );
    expect(appContainer.find(MuiThemeProvider).prop('theme')).toBe(muiTheme);
    expect(appContainer.find(ThemeProvider).prop('theme')).toBe(styledTheme);
    expect(appContainer.find(ConfirmProvider)).toHaveLength(1);
    expect(appContainer.find(Routes)).toHaveLength(1);
    expect(appContainer.find(HashRouter)).toHaveLength(1);
  })

});
