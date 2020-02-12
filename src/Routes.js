import React, { Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import WrapperContainer from 'containers/Dashboard/Wrapper'
import WrapperComponent from 'components/Wrapper'
import CssBaseline from '@material-ui/core/CssBaseline'

const Routes = ({ history }) => (
  <WrapperComponent>
    <Fragment>
      <CssBaseline />
        <Switch>
          <Route path="/:module/:entity" component={WrapperContainer} />
          <Redirect to="/provider-module/provider-details" />
        </Switch>
    </Fragment>
  </WrapperComponent>
)

export default Routes
