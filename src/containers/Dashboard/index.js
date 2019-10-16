import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import hoc from './hoc';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
  box: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const getIDFromName = name => `${name}`.toLowerCase().replace(' ', '-')
const getNameFromID = id => `${id}`.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');

const Dashboard = ({ fieldsReducer, match }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Channel Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {Object.keys(fieldsReducer.fields).map((text, index) => (
            <ListItem button key={text} component={NavLink} to={getIDFromName(text)}>
              {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
              {
                getNameFromID(match.params.entity) === text ?
                  <ListItemText primary={text} />
                :
                  <ListItemText secondary={text} />
              }
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper square>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            value={0}
          >
            <Tab label="Provider Module" {...a11yProps(0)} />
            <Tab label="Location Module" {...a11yProps(1)} />
            <Tab label="Network Module" {...a11yProps(2)} />
            <Tab label="HealthPlan Module" {...a11yProps(3)} />
          </Tabs>
        </Paper>
        <Typography
          component="div"
          role="tabpanel"
          id={`scrollable-auto-tabpanel-${0}`}
          aria-labelledby={`scrollable-auto-tab-${0}`}
          // {...other}
        >
          <Box className={classes.box}>
            {
              fieldsReducer.fields[getNameFromID(match.params.entity)].map((item, index) =>
                <ExpansionPanel square key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                  <ExpansionPanelSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                    <Typography>{item}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )
            }
          </Box>
        </Typography>
      </main>
    </div>
  );
}

export default hoc(Dashboard);
