import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { a11yProps } from 'utils/helper';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  moduleBar: {
    boxShadow: 'none'
  }
}));

const moduleRouter = [
  '/provider-module/provider-details',
  '/location-module/location-details',
  '/network-module/network-details',
  '/healthplan-module/healthplan-details'
]

const LayoutContainer = ({ children, history }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);

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
        </Paper>
      </AppBar>
      {children}
    </div>
  )
}

export default LayoutContainer
