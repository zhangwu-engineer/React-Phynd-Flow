import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dashboard from 'containers/Dashboard'
import LayoutContainer from 'components/Layout'
import WrapperComponent from 'components/Wrapper'
import CssBaseline from '@material-ui/core/CssBaseline'

const Routes = () => (
  <WrapperComponent>
    <React.Fragment>
      <CssBaseline />
      <LayoutContainer>
        <Switch>
          <Route path="/:entity" component={Dashboard} />
          <Redirect to="/provider-details" />
        </Switch>
      </LayoutContainer>
    </React.Fragment>
  </WrapperComponent>
)

export default Routes
