import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Sidebar from 'components/Sidebar';
import Diagram from 'containers/Diagram';
import CategoryDialog from 'containers/Dialog/category';
import DetailsDialog from 'containers/Dialog/details';
import CaseKeyDialog from 'containers/CaseKeyDialog';
// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  getNameFromID,
  getNameFromEntity
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
    width: 'calc(100vw - 260px)',
    overflow: 'scroll',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
}));

const refs = [];
const PanelItem = ({ item, panelName, index, dashboardReducer }) => {
  if (!dashboardReducer.dashboard) return <div />;
  const source = dashboardReducer.dashboard[item.item];
  return (
    <MuiExpansionPanel square key={index} expanded={item.expanded === `${panelName}-${index}`} onChange={item.handleChange(`${panelName}-${index}`)}>
      <MuiExpansionPanelSummary
        aria-controls={`${panelName}-${index}d-content`}
        id={`${panelName}-${index}d-header`}
        expandIcon={source && <ExpandMoreIcon />}
      >
        <Typography>{item.item}</Typography>
      </MuiExpansionPanelSummary>
      <MuiExpansionPanelDetails className={item.classes.details}>
        {item.expanded === `${panelName}-${index}` &&
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
              item.setCategoryModalShown(flag);
              item.setActivePanel(panel);
              item.setActiveParent(parent);
              item.setActiveCard(parent ? parent.data.nextType : null);
            }}
            triggerDetailsModal={(panel, flag, parent) => {
              item.setDetailsModalShown(flag);
              item.setActivePanel(panel);
              item.setActiveParent(parent);
              item.setActiveDetails(parent && parent.data.dataDetails);
              if (parent && !parent.data.parent) {
                item.setActiveCard(parent.data.parentType);
              } else {
                item.setActiveCard(parent ? parent.data.nextType : null);
              }
            }}
            triggerCaseKeyModal={(panel, flag, parent) => {
              item.setCaseKeyModalShown(flag);
              item.setActivePanel(panel);
              item.setActiveParent(parent);
            }}
          />
        }
      </MuiExpansionPanelDetails>
    </MuiExpansionPanel>
  );
};

const Panel = ({ items, startPoint, panelName, dashboardReducer, ...props }) => {
  const itemsList = items.map((item, index) => {
    refs[startPoint+index] = React.createRef();
    return { item, ref: refs[startPoint+index], ...props }
  });
  return (
    <Box>
      {
        itemsList.map((item, index) => <PanelItem item={item} panelName={panelName} index={startPoint+index} key={startPoint+index} dashboardReducer={dashboardReducer} />)
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
  const [isCategoryModalShown, setCategoryModalShown] = React.useState(false);
  const [isDetailsModalShown, setDetailsModalShown] = React.useState(false);
  const [isCaseKeyModalShown, setCaseKeyModalShown] = React.useState(false);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const fieldsList = fieldsReducer.fields && fieldsReducer.fields[getNameFromID(match.params.entity)] && fieldsReducer.fields[getNameFromID(match.params.entity)];
  let dashboardList = dashboardReducer;
  if (match.params.entity !== 'provider-details') {
    if (match.params.entity !== 'contacts') {
      const mapData = dashboardReducer.dashboard[getNameFromEntity(match.params.entity)];
      if (Array.isArray(mapData)) {
        dashboardList = [];
        let startPoint = 0;
        mapData.forEach(m => {
          dashboardList.push({
            dashboard: m,
            startPoint,
          });
          startPoint += parseInt(Object.keys(m).length);
        });
      }
    } else {
      const addressMapData = dashboardReducer.dashboard['AddressMaps'];
      if (Array.isArray(addressMapData)) {
        dashboardList = [];
        let startPoint = 0;
        addressMapData.forEach((am, index) => {
          am.ContactMaps.forEach(cm => {
            dashboardList.push({
              dashboard: cm,
              startPoint,
              addressIndex: index,
            });
            startPoint += parseInt(Object.keys(cm).length);
          });
        });
      }
    }
  }

  return (
    <div className={classes.root}>
      <Sidebar data={sidebarData} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography
          component="div"
          role="tabpanel"
          id={`scrollable-auto-tabpanel-${0}`}
          aria-labelledby={`scrollable-auto-tab-${0}`}
          // {...other}
        >
          {!Array.isArray(dashboardList) &&
            <Panel
              startPoint={0}
              panelName={match.params.entity}
              items={fieldsList}
              classes={classes}
              expanded={expanded}
              dashboardReducer={dashboardReducer}
              setCategoryModalShown={setCategoryModalShown}
              setDetailsModalShown={setDetailsModalShown}
              setCaseKeyModalShown={setCaseKeyModalShown}
              setActivePanel={setActivePanel}
              setActiveParent={setActiveParent}
              setActiveCard={setActiveCard}
              setActiveDetails={setActiveDetails}
              updateDashboard={(payload) => updateDashboard(payload)}
              handleChange={handleChange}
            />
          }
          {Array.isArray(dashboardList) && dashboardList.map((dashboardItem, index) =>
            <MuiExpansionPanel square key={index}>
              <MuiExpansionPanelSummary
                aria-controls={`panel-array${index}d-content`}
                id={`panel-array${index}`}
                expandIcon={dashboardItem && <ExpandMoreIcon />}
              >
                <Typography>{index+1}</Typography>
              </MuiExpansionPanelSummary>
              <MuiExpansionPanelDetails>
                <Panel
                  startPoint={parseInt(dashboardItem.startPoint)}
                  panelName={match.params.entity}
                  items={fieldsList}
                  classes={classes}
                  expanded={expanded}
                  dashboardReducer={dashboardItem}
                  setCategoryModalShown={setCategoryModalShown}
                  setDetailsModalShown={setDetailsModalShown}
                  setCaseKeyModalShown={setCaseKeyModalShown}
                  setActivePanel={setActivePanel}
                  setActiveParent={setActiveParent}
                  setActiveCard={setActiveCard}
                  setActiveDetails={setActiveDetails}
                  updateDashboard={(payload) => {
                    const dashboardSource = Object.assign({}, dashboardReducer);
                    if (match.params.entity !== 'contacts') {
                      dashboardSource.dashboard[getNameFromEntity(match.params.entity)][index] = payload;
                    } else if (dashboardItem.arrayIndex) {
                      dashboardSource.dashboard['AddressMaps'][dashboardItem.arrayIndex]['ContactMaps'][index] = payload;
                    }
                    updateDashboard(dashboardSource.dashboard);
                  }}
                  handleChange={handleChange}
                />
              </MuiExpansionPanelDetails>
            </MuiExpansionPanel>
          )}
        </Typography>
        <CategoryDialog
          isModalShown={isCategoryModalShown}
          hideModal={() => setCategoryModalShown(false)}
          activeParent={activeParent}
          currentCard={activeCard}
          currentDetails={activeDetails}
          setNewElement={(element) => {
            if (refs[activePanel])
              refs[activePanel].current.validateNew(element, activeParent);
          }}
          removeElement={() => {
            if (refs[activePanel])
              refs[activePanel].current.remove();
          }}
        />
        <DetailsDialog
          isModalShown={isDetailsModalShown}
          hideModal={() => setDetailsModalShown(false)}
          activeParent={activeParent}
          currentCard={activeCard}
          currentDetails={activeDetails}
          updateElement={(element, inputValue) => {
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
