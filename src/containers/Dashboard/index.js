import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Sidebar from 'components/Sidebar';

// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

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
  toolbar: theme.mixins.toolbar,
}));

const Dashboard = ({ fieldsReducer, match }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Sidebar fieldsReducer={fieldsReducer} />
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
                <MuiExpansionPanel square key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                  <MuiExpansionPanelSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                    <Typography>{item}</Typography>
                  </MuiExpansionPanelSummary>
                  <MuiExpansionPanelDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                  </MuiExpansionPanelDetails>
                </MuiExpansionPanel>
              )
            }
          </Box>
        </Typography>
      </main>
    </div>
  );
}

export default hoc(Dashboard);
