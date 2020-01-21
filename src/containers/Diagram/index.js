import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import CytoscapeComponent from 'react-cytoscapejs';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import {
  generateInitialSource,
  checkNodeEditable,
  checkCategoryEditable,
  getPropertyToMap,
  generateMapping,
} from 'utils/helper';

import useStyles, { nodeStyle, parentEntityStyle, edgeStyle } from './style';

const DIAGRAM_CONF = {
  NODE_WIDTH: 320,
  NODE_HEIGHT: 120,
};

const stylesheet = [
  {
    selector: 'node',
    style: nodeStyle,
  },
  {
    selector: ':parent',
    style: parentEntityStyle,
  },
  {
    selector: 'edge',
    style: edgeStyle,
  }
];

const Diagram = forwardRef(({ source, elementId, triggerModal, triggerDetailsModal, triggerCaseKeyModal, updateDashboard, triggerOperationModal }, ref) => {
  const [elements, setElements] = React.useState([]);

  useEffect(() => {
      cyListener.on('tap', function(e) {
        const isModalShown = e.target._private.group === 'nodes' ? true : false;
        if (e.target._private.data.entity && e.target._private.data.entity === 'Cases') {
          triggerCaseKeyModal(elementId, isModalShown, e.target._private);
        } else if (e.target._private.data.entity && e.target._private.data.entity === 'Operations') {
          triggerOperationModal(elementId, isModalShown, e.target._private);
        } else if (checkNodeEditable(e.target._private)) {
          triggerDetailsModal(elementId, isModalShown, e.target._private);
        } else if (checkCategoryEditable(e.target._private)) {
          triggerModal(elementId, isModalShown, e.target._private);
        } 
      });
      source && setElements(generateMapping(source, 1, 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source]
  );


  let cyListener;
  const layout = {
    name: 'preset',
    fit: false,
    transform: function(node, pos) {
      return (node._private.data.xWeight && node._private.data.yWeight) ? {
        x: node._private.data.xWeight * DIAGRAM_CONF.NODE_WIDTH,
        y: node._private.data.yWeight * DIAGRAM_CONF.NODE_HEIGHT,
      }
      : pos;
    }
  };
  const xWeightMax = elements.length > 0 ?
    Math.max.apply(Math, _.map(elements, o => { return o.data && o.data.xWeight ? o.data.xWeight : 0; }))
    : 0;
  const yWeightMax = elements.length > 0 ?
    Math.max.apply(Math, _.map(elements, o => { return o.data && o.data.yWeight ? o.data.yWeight : 0; }))
    : 0;

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    validate: (element, parent, inputValue) => {
      if (parent) {
        const propertyToFind = getPropertyToMap(parent.data.parentType);
        const findByProperty = (obj, val)=> {
          for (let p in obj) {
            if (!val) {
              // Primary Entity Update.
              const obj2 = generateInitialSource(element, parent, inputValue);
              if (obj['MappingFieldType'] === obj2['MappingFieldType']) {
                // Update only entity details
                const oldProperty = getPropertyToMap(obj['MappingFieldType']);
                const newProperty = getPropertyToMap(obj2['MappingFieldType']);
                if (parent.data.parentType === 'Iteration') {
                  obj['Iterator'][oldProperty.name] = obj2['Iterator'][newProperty.name];
                  if (oldProperty.name1) obj['Iterator'][oldProperty.name1] = obj2['Iterator'][newProperty.name1];
                  if (oldProperty.name2) obj['Iterator'][oldProperty.name2] = obj2['Iterator'][newProperty.name2];
                } else {
                  obj[oldProperty.name] = obj2[newProperty.name];
                  if (oldProperty.name1) obj[oldProperty.name1] = obj2[newProperty.name1];
                  if (oldProperty.name2) obj[oldProperty.name2] = obj2[newProperty.name2];
                }
              }
              return obj;
            } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
              // Internal Entities Update.
              const oldProperty = getPropertyToMap(obj['MappingFieldType']);
              if (parent.data.parentType === 'iteration-info') {
                obj['Iterator'][oldProperty.name] = inputValue.primary;
                if (oldProperty.name1) obj['Iterator'][oldProperty.name1] = inputValue.secondary;
                if (oldProperty.name2) obj['Iterator'][oldProperty.name2] = inputValue.tertiary;
              } else {
                obj[oldProperty.name] = inputValue.primary;
                if (oldProperty.name1) obj[oldProperty.name1] = inputValue.secondary;
                if (oldProperty.name2) obj[oldProperty.name2] = inputValue.tertiary;
              }
              return obj;
            } else if (`iterator-entity-${obj[propertyToFind.id]}` === val) {
              const oldProperty = getPropertyToMap(obj['MappingFieldType']);
              obj['Iterator'][oldProperty.name] = inputValue.secondary;
            } else if (`elementobj-entity-${obj[propertyToFind.id]}` === val) {
              const oldProperty = getPropertyToMap(obj['MappingFieldType']);
              obj[propertyToFind.name][oldProperty.name] = inputValue.primary;
              obj[propertyToFind.name][oldProperty.name1] = inputValue.secondary;
            } else if (typeof obj[p] === 'object') {
              findByProperty(obj[p], val);
            }
          }
        };
        findByProperty(source, parent.data.parent ? parent.data.parent: parent.data.id);
        setElements([]);
        setTimeout(() => {
          setElements(generateMapping(source, 1, 1));
        }, 0);
        updateDashboard(source);
      } else {
        updateDashboard(generateInitialSource(element, parent, inputValue));
      }
    },
    validateNew: (element, parent) => {
      const defaultInput = {
        primary: 'N/A',
        secondary: 'N/A',
        tertiary: 'N/A',
        fourth: 'N/A',
      };
      if (parent) {
        const propertyToFind = getPropertyToMap(parent.data.parentType);
        const findByProperty = (obj, val)=> {
          for (let p in obj) {
            // Case Key Value Update
            if (Array.isArray(obj[p])) {
              for (let ca in obj[p]) {
                if (obj[p][ca]['Key'] && `wrap-${obj[p][ca]['Value'][propertyToFind.id]}` === parent.data.id) {
                  obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, defaultInput);
                } else if (obj[p][ca]['Key'] && obj[p][ca]['Value'][propertyToFind.id] === null && parent.data.dataDetails === parseInt(ca)) {
                  obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, defaultInput);
                }
              }
            }
            if (!val) {
              // Primary Entity Update.
              const obj2 = generateInitialSource(element, parent, defaultInput);
              _.assign(obj, obj2);
              return obj;
            } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
              // Replace the internal entity with another category model.
              const obj2 = generateInitialSource(element, parent, defaultInput);
              obj[propertyToFind.name] = obj2;
              if (parent.data.parentType === 'iteration-source') {
                // Different field structure of Iteration.
                obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, defaultInput);
              }
              return obj;
            } else if (`iterator-entity-${obj[propertyToFind.id]}` === val) {
              obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, defaultInput);
            } else if (typeof obj[p] === 'object') {
              findByProperty(obj[p], val);
            }
          }
        };
        findByProperty(source, parent.data.parent);
        setElements([]);
        setTimeout(() => {
          setElements(generateMapping(source, 1, 1));
        }, 0);
        updateDashboard(source);
      } else {
        updateDashboard(generateInitialSource(element, parent, defaultInput));
      }
    },
    validateCaseKey: (parent, inputKeyValue) => {
      const findByProperty = (obj, val)=> {
        for (let p in obj) {
          if (Array.isArray(obj[p]) && p === 'Cases' && `case-target-${obj['MappingFieldId']}` === val) {
            obj[p].push({
              Key: inputKeyValue.length > 0 ? inputKeyValue : 'N/A',
              Value: {
                MappingFieldId: null,
                MappingFieldType: null,
              },
            });
          } else if (typeof obj[p] === 'object') {
            findByProperty(obj[p], val);
          }
        }
      };
      findByProperty(source, parent.data.id);
      setElements([]);
      setTimeout(() => {
        setElements(generateMapping(source, 1, 1));
      }, 0);
      updateDashboard(source);
    },
    validateOperation: (parent, name, field, value) => {
      const findByProperty = (obj, val)=> {
        for (let p in obj) {
          if (p === 'Element' && `elementoperations-entity-${obj['MappingFieldId']}` === val) {
            obj[p]['Operations'].push({
              name,
              field,
              value,
              Source: {},
            });
          } else if (typeof obj[p] === 'object') {
            findByProperty(obj[p], val);
          }
        }
      };
      findByProperty(source, parent.data.id);
      setElements([]);
      setTimeout(() => {
        setElements(generateMapping(source, 1, 1));
      }, 0);
      updateDashboard(source);
    },
    remove: () => {
      setElements([]);
      updateDashboard({});
    },
  }), [elements]);

  return (
    <Grid>
      {elements.length === 0 &&
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => triggerModal(elementId, true, null)}>
          <AddIcon />
        </Fab>
      }
      <CytoscapeComponent
        cy={(cy) => { cyListener=cy }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        layout={layout}
        stylesheet={stylesheet}
        style={
          {
            width: Math.max(window.innerWidth - 300, (xWeightMax + 0.5) * DIAGRAM_CONF.NODE_WIDTH),
            height: yWeightMax === 0 ? 65 : Math.min(window.innerHeight - 200, (yWeightMax + 1) * DIAGRAM_CONF.NODE_HEIGHT),
            marginTop: yWeightMax === 0 ? 100 : 0,
          }
        }
        minZoom={0.2}
        maxZoom={10}
        wheelSensitivity={0.1}
      />
    </Grid>
    
  );
});

export default Diagram;