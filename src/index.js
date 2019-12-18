import 'babel-polyfill';
import 'services/immutability'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'
import { store, persistor, history } from 'services/redux'
import Routes from 'Routes'
import { muiTheme, styledTheme } from 'services/bootstrap';
import * as serviceWorker from './serviceWorker';

const AppContainer = () => (
  <MuiThemeProvider theme={muiTheme}>
    <ThemeProvider theme={styledTheme}>
      <HashRouter basename='/' history={history}>
        <Routes />
      </HashRouter>
    </ThemeProvider>
  </MuiThemeProvider>
)

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading="null" persistor={persistor}>
      <AppContainer />
    </PersistGate>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
