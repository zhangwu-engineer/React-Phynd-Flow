import React from 'react';
// Typography
import Typography from '@material-ui/core/Typography';
// Expansion Panel
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// icon
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Diagram from 'containers/Diagram';

export default ({ item, panelName, panelIndex, blockedItems, startPoint, index, dashboardList }) => {
  if (!dashboardList.dashboard) return <div />;
  if (blockedItems && blockedItems.indexOf(item.item) > -1) return <div />;
  let source = dashboardList.dashboard[item.item];
  return (
    <MuiExpansionPanel
      square key={`${startPoint}-${panelIndex}-${index}`}
      expanded={item.expanded === `${panelName}-${panelIndex}-${index}`}
      onChange={item.handleChange(`${panelName}-${panelIndex}-${index}`)}
    >
      <MuiExpansionPanelSummary
        aria-controls={`${panelName}-${index}d-content`}
        id={`${panelName}-${index}d-header`}
        expandIcon={source && <ExpandMoreIcon />}
      >
        <Typography>{item.item}</Typography>
      </MuiExpansionPanelSummary>
      <MuiExpansionPanelDetails className={item.classes.details}>
        {item.expanded === `${panelName}-${panelIndex}-${index}` &&
          <Diagram
            item={item.item}
            ref={item.ref}
            elementId={`${panelIndex}${index}`}
            source={source}
            updateDiagram={payload => {
              item.stashChanges(item.item, payload);
              item.updateDashboard(item.item, payload);
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
  );
};