import 'babel-polyfill';
import 'services/immutability'
import React from 'react';
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'
import { store, persistor, history } from 'services/redux'
import Routes from 'Routes'
import { muiTheme, styledTheme } from 'services/bootstrap';

export const AppContainer = () => (
  <MuiThemeProvider theme={muiTheme}>
    <ThemeProvider theme={styledTheme}>
      <HashRouter basename='/' history={history}>
        <Routes history={history} />
      </HashRouter>
    </ThemeProvider>
  </MuiThemeProvider>
)

export const App = () => (
  <Provider store={store}>
    <PersistGate loading="null" persistor={persistor}>
      <AppContainer />
    </PersistGate>
  </Provider>
)

