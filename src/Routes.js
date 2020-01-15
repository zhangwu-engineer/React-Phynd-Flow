import React, { Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dashboard from 'containers/Dashboard'
import WrapperComponent from 'components/Wrapper'
import CssBaseline from '@material-ui/core/CssBaseline'

const Routes = ({ history }) => (
  <WrapperComponent>
    <Fragment>
      <CssBaseline />
        <Switch>
          <Route path="/:module/:entity" component={Dashboard} />
          <Redirect to="/provider-module/provider-details" />
        </Switch>
    </Fragment>
  </WrapperComponent>
)

export default Routes
