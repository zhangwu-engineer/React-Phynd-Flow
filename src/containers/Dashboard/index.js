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
import CaseKeyDialog from 'containers/CaseKeyDialog';
// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import AddIcon from '@material-ui/icons/Add';
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
    width: 'calc(100vw - 252px)',
    overflow: 'scroll',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
}));

const refs = [];
const PanelItem = ({ item, index, dashboardReducer }) => {
  if (!dashboardReducer.dashboard) return <div />;
  const source = dashboardReducer.dashboard[item.item];
  return (
    <MuiExpansionPanel square key={index} expanded={item.expanded === `panel${index}`} onChange={item.handleChange(`panel${index}`)}>
      <MuiExpansionPanelSummary
        aria-controls={`panel${index}d-content`}
        id={`panel${index}d-header`}
        expandIcon={!dashboardReducer.dashboard[item.item] && <AddIcon />}
      >
        <Typography>{item.item}</Typography>
      </MuiExpansionPanelSummary>
      <MuiExpansionPanelDetails className={item.classes.details}>
        <Diagram
          item={item.item}
          ref={item.ref}
          elementId={index}
          source={source}
          updateDashboard={payload => {
            const dashboardSource = dashboardReducer.dashboard;
            dashboardSource[item.item] = payload;
            item.updateDashboard(dashboardSource);
          }}
          triggerModal={(panel, flag, parent) => {
            item.setModalShown(flag);
            item.setActivePanel(panel);
            item.setActiveParent(parent);
            item.setActiveCard(parent ? parent.data.nextType : null);
            item.setActiveDetails(parent && parent.data.dataDetails);
            if (parent && parent.data.parentType === 'cases-entity') {
              item.setActiveDetails({
                ...parent.data.dataDetails,
                fourth: parent.data.label,
              });
            }
          }}
          triggerCaseKeyModal={(panel, flag, parent) => {
            item.setCaseKeyModalShown(flag);
            item.setActivePanel(panel);
            item.setActiveParent(parent);
          }}
        />
      </MuiExpansionPanelDetails>
    </MuiExpansionPanel>
  );
};

const Panel = ({ items, dashboardReducer, ...props }) => {
  const itemsList = items.map((item, index) => {
    refs[index] = React.createRef();
    return { item, ref: refs[index], ...props }
  });
  return (
    <Box>
      {
        itemsList.map((item, index) => <PanelItem item={item} index={index} key={index} dashboardReducer={dashboardReducer} />)
      }
    </Box>
  );
};

const Dashboard = ({ dashboardReducer, fieldsReducer, match, sidebarData, updateDashboard }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);
  const [activePanel, setActivePanel] = React.useState(null);
  const [activeParent, setActiveParent] = React.useState(null);
  const [activeCard, setActiveCard] = React.useState(null);
  const [activeDetails, setActiveDetails] = React.useState(null);
  const [isModalShown, setModalShown] = React.useState(false);
  const [isCaseKeyModalShown, setCaseKeyModalShown] = React.useState(false);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const fieldsList = fieldsReducer.fields && fieldsReducer.fields[getNameFromID(match.params.entity)] && fieldsReducer.fields[getNameFromID(match.params.entity)];

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
          <Panel
            items={fieldsList}
            classes={classes}
            expanded={expanded}
            dashboardReducer={dashboardReducer}
            setModalShown={setModalShown}
            setCaseKeyModalShown={setCaseKeyModalShown}
            setActivePanel={setActivePanel}
            setActiveParent={setActiveParent}
            setActiveCard={setActiveCard}
            setActiveDetails={setActiveDetails}
            updateDashboard={(payload) => updateDashboard(payload)}
            handleChange={handleChange}
          />
        </Typography>
        <NodeDialog
          isModalShown={isModalShown}
          hideModal={() => setModalShown(false)}
          activeParent={activeParent}
          currentCard={activeCard}
          currentDetails={activeDetails}
          setNewElement={(element, inputValue) => {
            if (refs[activePanel])
              refs[activePanel].current.validate(element, activeParent, inputValue);
          }}
          removeElement={() => {
            if (refs[activePanel])
              refs[activePanel].current.remove();
          }}
        />
        <CaseKeyDialog
          isModalShown={isCaseKeyModalShown}
          hideModal={() => setCaseKeyModalShown(false)}
          setNewCase={(inputKeyValue) => {
            if (refs[activePanel])
              refs[activePanel].current.validateCaseKey(activeParent, inputKeyValue);
          }}
        />
      </main>
    </div>
  );
}

export default hoc(Dashboard);
