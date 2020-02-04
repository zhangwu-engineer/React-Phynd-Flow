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
  generateMapping,
  findByPropertyNew,
  findByPropertyExisting,
  findByPropertyCase,
  findByPropertyOperation,
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
        const modifedObj = findByPropertyExisting(
          source,
          parent.data.parent ? parent.data.parent: parent.data.id,
          inputValue,
          parent,
          element
        );
        console.log(modifedObj);
        setElements([]);
        setTimeout(() => {
          setElements(generateMapping(source, 1, 1));
        }, 0);
        updateDashboard(source);
      } else {
        updateDashboard(generateInitialSource(element, parent, inputValue));
      }
    },
    validateNew: (element, parent, inputValue) => {
      if (parent) {
        findByPropertyNew(
          source,
          parent.data.parent,
          inputValue,
          parent,
          element
        );
        setElements([]);
        setTimeout(() => {
          setElements(generateMapping(source, 1, 1));
        }, 0);
        updateDashboard(source);
      } else {
        updateDashboard(generateInitialSource(element, parent, inputValue));
      }
    },
    validateCaseKey: (parent, inputKeyValue, element, inputValue) => {
      findByPropertyCase(source, parent.data.id, inputKeyValue, element, inputValue);
      setElements([]);
      setTimeout(() => {
        setElements(generateMapping(source, 1, 1));
      }, 0);
      updateDashboard(source);
    },
    validateOperation: (parent, name, field, value) => {
      findByPropertyOperation(source, parent.data.id, name, field, value);
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