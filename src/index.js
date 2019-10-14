import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'
import { store, persistor, history } from 'services/redux'
import Routes from 'Routes'
import * as serviceWorker from './serviceWorker';

const AppContainer = () => (
  <MuiThemeProvider theme={{}}>
    <ThemeProvider theme={{}}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
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
