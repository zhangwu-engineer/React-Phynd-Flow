import React from 'react';
import { map } from 'lodash';
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

import hoc from './hoc';

// style
import useStyles from './style';


const refs = [];

const Panel = ({
  items,
  startPoint,
  panelName,
  panelIndex,
  blockedItems,
  dashboardList,
  ...props
}) => {
  const itemsList = items && map(items, (item, index) => {
    refs[`${panelIndex}${index}`] = React.createRef();
    return {
      item,
      ref: refs[`${panelIndex}${index}`],
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

const Dashboard = ({
  dashboardReducer,
  dashboardList,
  fieldsList,
  blockList,
  isContactMap,
  match,
  sidebarData,
  updateDashboard,
  stashData,
}) => {
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
  const [newMapCount, setNewMapCount] = React.useState(0);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleBlockListDialog = () => {
    setBlockListModalShown(true);
  }

  const handleNewMap = () => {
    setNewMapCount(newMapCount+1);
    const newMap = {};
    _.map(fieldsList, function(field) {
      newMap[field] = null;
    });
    stashData({
      itemName: '',
      itemContent: newMap,
      panelIndex: dashboardList.length,
      addressIndex: -1,
      contactIndex: -1,
      module: match.params.module,
      entity: match.params.entity,
    });
    updateDashboard({
      itemName: '',
      itemContent: newMap,
      panelIndex: dashboardList.length,
      addressIndex: -1,
      contactIndex: -1,
      module: match.params.module,
      entity: match.params.entity,
    });
  }

  const handleStashChanges = (itemName, itemContent, indexData) => {
    const { panelIndex, addressIndex, contactIndex } = indexData;
    stashData({
      itemName,
      itemContent,
      panelIndex,
      addressIndex,
      contactIndex,
      module: match.params.module,
      entity: match.params.entity,
    });
  }

  const handleUpdateDashboard = (itemName, itemContent, indexData) => {
    const { panelIndex, addressIndex, contactIndex } = indexData;
    updateDashboard({
      itemName,
      itemContent,
      panelIndex,
      addressIndex,
      contactIndex,
      module: match.params.module,
      entity: match.params.entity,
    });
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
            <div>
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
                stashChanges={(itemName, payload) => 
                  handleStashChanges(
                    itemName,
                    payload,
                    {
                      panelIndex: -1,
                    }
                  )
                }
                updateDashboard={(itemName, payload) => 
                  handleUpdateDashboard(
                    itemName,
                    payload,
                    {
                      panelIndex: -1,
                    }
                  )
                }
                handleChange={handleChange}
              />
              <Grid className={classes.addButtonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addButton}
                  onClick={handleBlockListDialog}
                >
                  Add Field
                </Button>
              </Grid>
            </div>
          }
          {Array.isArray(dashboardList) && map(dashboardList, (dashboardItem, index) =>
            <MuiExpansionPanel square key={`expansion-${index}`}>
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
                  stashChanges={(itemName, payload) =>
                    handleStashChanges(
                      itemName,
                      payload,
                      {
                        panelIndex: index,
                        addressIndex: dashboardItem.addressIndex,
                        contactIndex: dashboardItem.contactIndex,
                      }
                    )
                  }
                  updateDashboard={(itemName, payload) =>
                    handleUpdateDashboard(
                      itemName,
                      payload,
                      {
                        panelIndex: index,
                        addressIndex: dashboardItem.addressIndex,
                        contactIndex: dashboardItem.contactIndex,
                      }
                    )
                  }
                  handleChange={handleChange}
                />
              </MuiExpansionPanelDetails>
            </MuiExpansionPanel>
          )}
          {Array.isArray(dashboardList) &&
            <Grid className={classes.addButtonContainer}>
              {blockList.length > 0 &&
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addButton}
                  onClick={handleBlockListDialog}
                >
                  Add Field
                </Button>
              }
              {!isContactMap &&
              <Button
                variant="contained"
                color="primary"
                className={classes.addButton}
                onClick={handleNewMap}
              >
                New Map
              </Button>
              }
            </Grid>
          }
        </Typography>
        <CategoryDialog
          isModalShown={isCategoryModalShown}
          hideModal={() => setCategoryModalShown(false)}
          activeParent={activeParent}
          currentCard={activeCard}
          setNewElement={(element, inputValue) => {
            if (refs[activePanel] && refs[activePanel].current)
              refs[activePanel].current.validateNew(element, activeParent, inputValue);
          }}
          removeElement={() => {
            if (refs[activePanel] && refs[activePanel].current)
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
            if (refs[activePanel] && refs[activePanel].current)
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
          setNewCase={(inputKeyValue, element, inputValue) => {
            if (refs[activePanel] && refs[activePanel].current)
              refs[activePanel].current.validateCaseKey(activeParent, inputKeyValue, element, inputValue);
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
            if (refs[activePanel] && refs[activePanel].current)
              refs[activePanel].current.validateOperation(activeParent, name, field, value);
          }}
        />
      </main>
    </div>
  );
}

export default hoc(Dashboard);
