import React from 'react'
import { Route, Switch } from 'react-router-dom'
import WrapperComponent from 'containers/Wrapper'
import LayoutContainer from 'containers/Layout'
import Dashboard from 'containers/Dashboard'
import CssBaseline from '@material-ui/core/CssBaseline'

const Routes = () => {
  
  return (
    <WrapperComponent>
      <React.Fragment>
        <CssBaseline />
        <LayoutContainer>
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </LayoutContainer>
      </React.Fragment>
    </WrapperComponent>
  )
}

export default Routes
