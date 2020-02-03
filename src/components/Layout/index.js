import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { moduleTabNumber, moduleRouter, a11yProps } from 'utils/helper';
const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  moduleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'none',
  },
  buttonGroup: {
    boxShadow: 'none',
  }
}));

const StyledButton = withStyles({
  root: {
    borderRadius: 0,
    border: 0,
    color: 'white',
    height: 34,
    padding: '0 30px',
    marginRight: 24,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 14,
  },
})(Button);

const LayoutContainer = ({ children, history }) => {
  const classes = useStyles();
  const { pathname } = history.location;
  const locationParams = pathname && pathname.split('/');
  const [activeTab, setActiveTab] = React.useState(moduleTabNumber[locationParams[1]]);
  
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
            <StyledButton>Submit</StyledButton>
            <StyledButton>Compare</StyledButton>
            <StyledButton>Revert</StyledButton>
          </ButtonGroup>
        </Paper>
      </AppBar>
      {children}
    </div>
  )
}

export default LayoutContainer
