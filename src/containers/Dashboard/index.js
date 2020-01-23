import React from 'react';
import { assign, map } from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CategoryDialog from 'containers/CategoryDialog';
import DetailsDialog from 'containers/DetailsDialog';
import CaseKeyDialog from 'containers/CaseKeyDialog';
import BlockListDialog from 'containers/BlockListDialog';
import OperationDialog from 'containers/OperationsDialog';
import PanelItem from 'components/PanelItem';
import Sidebar from 'components/Sidebar';

import {
  getNameFromID,
  getNameFromEntity,
  reorder,
} from 'utils/helper';
import hoc from './hoc';

// style
import useStyles from './style';


const refs = [];

const Panel = ({ items, startPoint, panelName, panelIndex, blockedItems, dashboardList, ...props }) => {
  const itemsList = items && map(items, (item, index) => {
    const panelInfo = panelIndex ? panelIndex.toString() : '';
    const indexInfo = index ? index.toString() : '';
    refs[panelInfo+indexInfo] = React.createRef();
    return {
      item,
      ref: refs[panelInfo+indexInfo],
      ...props
    }
  });
  return (
    <Box>
      {
        map(itemsList, (item, index) =>
          <PanelItem
            item={item}
            blockedItems={blockedItems}
            panelName={panelName}
            panelIndex={panelIndex}
            index={index}
            startPoint={startPoint}
            key={`${startPoint}-${panelIndex}-${index}`}
            dashboardList={dashboardList}
          />
        )
      }
    </Box>
  );
};

const Dashboard = ({ dashboardReducer, dashboardList, fieldsReducer, fieldsList, blockList, match, sidebarData, updateDashboard, updateFields }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(null);
  const [activePanel, setActivePanel] = React.useState(null);
  const [activeParent, setActiveParent] = React.useState(null);
  const [activeCard, setActiveCard] = React.useState(null);
  const [activeDetails, setActiveDetails] = React.useState(null);
  const [isCategoryModalShown, setCategoryModalShown] = React.useState(false);
  const [isDetailsModalShown, setDetailsModalShown] = React.useState(false);
  const [isCaseKeyModalShown, setCaseKeyModalShown] = React.useState(false);
  const [isBlockListModalShown, setBlockListModalShown] = React.useState(false);
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

    const fieldsListFromReducer = assign({}, fieldsReducer);
    fieldsListFromReducer.fields[getNameFromID(match.params.module)][getNameFromID(match.params.entity)] = items;
    updateFields(fieldsListFromReducer.fields);
  }

  return (
    <div className={classes.root}>
      <Sidebar data={sidebarData} />
      <main className={classes.content}>
        <Typography
          component="div"
          role="tabpanel"
          id={`scrollable-auto-tabpanel-${0}`}
          aria-labelledby={`scrollable-auto-tab-${0}`}
        >
          {!Array.isArray(dashboardList) &&
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {provided => (
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
                      blockedItems={blockList}
                      dashboardList={dashboardList}
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
                        dashboardSource.dashboard[getNameFromID(match.params.module)] = payload;
                        updateDashboard(dashboardSource.dashboard);
                      }}
                      handleChange={handleChange}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Grid className={classes.addButtonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addButton}
                  onClick={() => {
                    setBlockListModalShown(true);
                  }}
                >
                  Add Field
                </Button>
              </Grid>
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
                        panelIndex={index+1}
                        items={fieldsList}
                        classes={classes}
                        expanded={expanded}
                        blockedItems={blockList}
                        dashboardList={dashboardItem}
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
                            dashboardSource.dashboard[getNameFromID(match.params.module)][getNameFromEntity(match.params.entity)][index] = payload;
                          } else if (dashboardItem.addressIndex) {
                            dashboardSource.dashboard[getNameFromID(match.params.module)]['AddressMaps'][dashboardItem.addressIndex]['ContactMaps'][index] = payload;
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
          {Array.isArray(dashboardList) &&
            blockList.length > 0 &&
            <Grid className={classes.addButtonContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.addButton}
                onClick={() => {
                  setBlockListModalShown(true);
                }}
              >
                Add Field
              </Button>
            </Grid>
          }
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
        <BlockListDialog
          isModalShown={isBlockListModalShown}
          hideModal={() => setBlockListModalShown(false)}
          blockedItems={blockList}
          addField={(fields) => {
            _.remove(blockList, function (item) {
              return fields.indexOf(item) > -1;
            });
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
