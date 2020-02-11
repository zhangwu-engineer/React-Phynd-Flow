import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StyledButton from 'components/StyledButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { moduleTabNumber, moduleRouter, a11yProps } from 'utils/helper';

import useStyles from './style';

const LayoutContainer = ({ children, history, submitCTA, compareCTA, revertCTA }) => {
  const classes = useStyles();
  const { pathname } = (history && history.location) || {};
  const locationParams = pathname && pathname.split('/');
  const tabNumber = locationParams ? moduleTabNumber[locationParams[1]] : 0
  const [activeTab, setActiveTab] = React.useState(tabNumber);
  
  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
    history.push(moduleRouter[newTab]);
  };

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>Channel Builder</Typography>
        </Toolbar>
        <Paper square className={classes.moduleBar}>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            value={activeTab}
            onChange={handleChange}
          >
            <Tab label="Provider Module" {...a11yProps(0)} />
            <Tab label="Location Module" {...a11yProps(1)} />
            <Tab label="Network Module" {...a11yProps(2)} />
            <Tab label="HealthPlan Module" {...a11yProps(3)} />
          </Tabs>
          <ButtonGroup
            variant="contained"
            size="small"
            color="primary"
            aria-label="contained primary button group"
            className={classes.buttonGroup}
          >
            <StyledButton onClick={submitCTA}>Submit</StyledButton>
            <StyledButton onClick={compareCTA}>Compare</StyledButton>
            <StyledButton onClick={revertCTA}>Revert</StyledButton>
          </ButtonGroup>
        </Paper>
      </AppBar>
      {children}
    </div>
  )
}

export default LayoutContainer
