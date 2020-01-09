import React, { useEffect } from 'react';
import { assign, map, size } from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CategoryDialog from 'containers/Dialog/category';
import DetailsDialog from 'containers/Dialog/details';
import CaseKeyDialog from 'containers/CaseKeyDialog';
import OperationDialog from 'containers/Dialog/operations';
import PanelItem from 'components/PanelItem';
import Sidebar from 'components/Sidebar';

import {
  getNameFromID,
  getNameFromEntity,
  reorder
} from 'utils/helper';
import hoc from './hoc';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: 112,
  },
  content: {
    flexGrow: 1,
  },
  details: {
    width: 'calc(100vw - 279px)',
    overflow: 'scroll',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
}));

const refs = [];

const Panel = ({ items, startPoint, panelName, dashboardReducer, ...props }) => {
  const itemsList = items && map(items, (item, index) => {
    refs[startPoint+index] = React.createRef();
    return { item, ref: refs[startPoint+index], ...props }
  });
  return (
    <Box>
      {
        map(itemsList, (item, index) => <PanelItem item={item} panelName={panelName} index={index} startPoint={startPoint} key={`${startPoint}+${index}`} dashboardReducer={dashboardReducer} />)
      }
    </Box>
  );
};

const Dashboard = ({ dashboardReducer, fieldsReducer, match, sidebarData, updateDashboard, updateFields }) => {
  const classes = useStyles();
  const [fieldsList, setFieldsList] = React.useState([]);
  const [dashboardList, setDashboardList] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);
  const [activePanel, setActivePanel] = React.useState(null);
  const [activeParent, setActiveParent] = React.useState(null);
  const [activeCard, setActiveCard] = React.useState(null);
  const [activeDetails, setActiveDetails] = React.useState(null);
  const [isCategoryModalShown, setCategoryModalShown] = React.useState(false);
  const [isDetailsModalShown, setDetailsModalShown] = React.useState(false);
  const [isCaseKeyModalShown, setCaseKeyModalShown] = React.useState(false);
  const [isOperationModalShown, setOperationModalShown] = React.useState(false);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const onDragEnd = result => {
    if (!result.destination || !result.source) {
      return;
    }

    const items = reorder(
      fieldsList,
      result.source.index,
      result.destination.index
    );

    setFieldsList(items);
    const fieldsListFromReducer = assign({}, fieldsReducer);
    fieldsListFromReducer.fields[getNameFromID(match.params.entity)] = items;
    updateFields(fieldsListFromReducer.fields);
  }

  useEffect(() => {
    const fieldsListFromReducer = fieldsReducer.fields && fieldsReducer.fields[getNameFromID(match.params.entity)] && fieldsReducer.fields[getNameFromID(match.params.entity)];
    let dashboardListFromReducer = dashboardReducer;

    if (match.params.entity !== 'provider-details') {
      if (match.params.entity !== 'contacts') {
        const mapData = dashboardReducer.dashboard && dashboardReducer.dashboard[getNameFromEntity(match.params.entity)];
        if (Array.isArray(mapData)) {
          dashboardListFromReducer = [];
          let startPoint = 0;
          map(mapData, m => {
            dashboardListFromReducer.push({
              dashboard: m,
              startPoint,
            });
            startPoint += parseInt(size(m));
          });
        }
      } else {
        const addressMapData = dashboardReducer.dashboard && dashboardReducer.dashboard['AddressMaps'];
        if (Array.isArray(addressMapData)) {
          dashboardListFromReducer = [];
          let startPoint = 0;
          addressMapData.forEach((am, index) => {
            am.ContactMaps.forEach(cm => {
              dashboardListFromReducer.push({
                dashboard: cm,
                startPoint,
                addressIndex: index,
              });
              startPoint += parseInt(size(cm));
            });
          });
        }
      }
    }
    setFieldsList(fieldsListFromReducer);
    setDashboardList(dashboardListFromReducer)
  }, [match.params.entity]);

  return (
    <div className={classes.root}>
      <Sidebar data={sidebarData} />
      <main className={classes.content}>
        <Typography
          component="div"
          role="tabpanel"
          id={`scrollable-auto-tabpanel-${0}`}
          aria-labelledby={`scrollable-auto-tab-${0}`}
          // {...other}
        >
          {!Array.isArray(dashboardList) &&
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  >
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
                      setOperationModalShown={setOperationModalShown}
                      setActivePanel={setActivePanel}
                      setActiveParent={setActiveParent}
                      setActiveCard={setActiveCard}
                      setActiveDetails={setActiveDetails}
                      updateDashboard={(payload) => updateDashboard(payload)}
                      handleChange={handleChange}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          }
          {Array.isArray(dashboardList) && map(dashboardList, (dashboardItem, index) =>
            <DragDropContext onDragEnd={onDragEnd} key={`expansion-${index}`}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <MuiExpansionPanel
                    square
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                        setOperationModalShown={setOperationModalShown}
                        setActivePanel={setActivePanel}
                        setActiveParent={setActiveParent}
                        setActiveCard={setActiveCard}
                        setActiveDetails={setActiveDetails}
                        updateDashboard={(payload) => {
                          const dashboardSource = assign({}, dashboardReducer);
                          if (match.params.entity !== 'contacts') {
                            dashboardSource.dashboard[getNameFromEntity(match.params.entity)][index] = payload;
                          } else if (dashboardItem.arrayIndex) {
                            dashboardSource.dashboard['AddressMaps'][dashboardItem.arrayIndex]['ContactMaps'][index] = payload;
                          }
                          updateDashboard(dashboardSource.dashboard);
                        }}
                        handleChange={handleChange}
                      />
                      {provided.placeholder}
                    </MuiExpansionPanelDetails>
                  </MuiExpansionPanel>
                )}
              </Droppable>
            </DragDropContext>
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
        <OperationDialog
          isModalShown={isOperationModalShown}
          hideModal={() => setOperationModalShown(false)}
          setNewOperation={(name, field, value) => {
            if (refs[activePanel])
              refs[activePanel].current.validateOperation(activeParent, name, field, value);
          }}
        />
      </main>
    </div>
  );
}

export default hoc(Dashboard);
