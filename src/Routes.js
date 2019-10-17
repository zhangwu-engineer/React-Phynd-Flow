import React from 'react'
import { Route, Switch } from 'react-router-dom'
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
        </Switch>
      </LayoutContainer>
    </React.Fragment>
  </WrapperComponent>
)

export default Routes
