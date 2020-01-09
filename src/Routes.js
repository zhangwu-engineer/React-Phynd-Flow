import React, { Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dashboard from 'containers/Dashboard'
import LayoutContainer from 'components/Layout'
import WrapperComponent from 'components/Wrapper'
import CssBaseline from '@material-ui/core/CssBaseline'

const Routes = () => (
  <WrapperComponent>
    <Fragment>
      <CssBaseline />
      <LayoutContainer>
        <Switch>
          <Route path="/:entity" component={Dashboard} />
          <Redirect to="/provider-details" />
        </Switch>
      </LayoutContainer>
    </Fragment>
  </WrapperComponent>
)

export default Routes
