import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Sidebar from 'components/Sidebar';
import Diagram from 'containers/Diagram';
import NodeDialog from 'containers/Dialog';

// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  a11yProps,
  getNameFromID
} from 'utils/helper';
import hoc from './hoc';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
  },
  box: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  details: {
    width: 'calc(100vw - 290px)',
    height: 600,
    overflow: 'scroll',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
}));

const Dashboard = ({ dashboardReducer, fieldsReducer, match, sidebarData }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);
  const [isModalShown, setModalShown] = React.useState(false);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Sidebar data={sidebarData} />
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
              fieldsReducer.fields && fieldsReducer.fields[getNameFromID(match.params.entity)] && fieldsReducer.fields[getNameFromID(match.params.entity)].map((item, index) =>
                <MuiExpansionPanel square key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                  <MuiExpansionPanelSummary
                    aria-controls={`panel${index}d-content`}
                    id={`panel${index}d-header`}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>{item}</Typography>
                  </MuiExpansionPanelSummary>
                  <MuiExpansionPanelDetails className={classes.details}>
                    {dashboardReducer.dashboard[item] && <Diagram source={dashboardReducer.dashboard[item]} triggerModal={(e, flag) => setModalShown(flag)} />}
                    {!dashboardReducer.dashboard[item] && <Typography />}
                  </MuiExpansionPanelDetails>
                </MuiExpansionPanel>
              )
            }
          </Box>
        </Typography>
        <NodeDialog isModalShown={isModalShown} triggerModal={(e, flag) => setModalShown(flag)} />
      </main>
    </div>
  );
}

export default hoc(Dashboard);
