import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
// Typography
import Typography from '@material-ui/core/Typography';
// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// icon
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Diagram from 'containers/Diagram';

export default ({ item, panelName, blockedItems, startPoint, index, dashboardReducer }) => {
  if (!dashboardReducer.dashboard) return <div />;
  if (blockedItems && blockedItems.indexOf(item.item) > -1) return <div />;
  const source = dashboardReducer.dashboard[item.item];
  return (
    <Draggable
      key={`${startPoint}-${index}`}
      draggableId={`${index}`}
      index={index}
      isDragDisabled={item.expanded === `${panelName}-${index}`}
    >
      {(provided, snapshot) => (
        <MuiExpansionPanel
          square key={`${startPoint}--${index}`}
          expanded={item.expanded === `${panelName}-${index}`}
          onChange={item.handleChange(`${panelName}-${index}`)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
                triggerOperationModal={(panel, flag, parent) => {
                  item.setOperationModalShown(flag);
                  item.setActivePanel(panel);
                  item.setActiveParent(parent);
                }}
              />
            }
          </MuiExpansionPanelDetails>
        </MuiExpansionPanel>
        )}
    </Draggable>
  );
};