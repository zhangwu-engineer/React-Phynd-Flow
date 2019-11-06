import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

const DIAGRAM_CONF = {
  DIAGRAM_PADDING: 30,
  NODE_WIDTH: 320,
  NODE_HEIGHT: 120,
  NODE_INNER_WIDTH: 220,
};

const nodeStyle = {
  'width': 'label',
  'height': 'label',
  'background-color': 'white',
  'label': 'data(label)',
  'border-style': 'solid',
  'border-width': '1',
  'border-color': 'black',
  'text-halign': 'center',
  'text-valign': 'center',
  'text-max-width': DIAGRAM_CONF.NODE_INNER_WIDTH,
  'text-wrap': 'wrap',
  'padding': 15,
  'shape': 'rectangle',
};

const parentEntityStyle = {
  'width': 'label',
  'height': 'label',
  'font-weight': 'bold',
  'background-opacity': 0.075,
  'padding': DIAGRAM_CONF.DIAGRAM_PADDING,
  'text-valign': 'top',
  'text-halign': 'center',
  'text-margin-y': 25,
};

const edgeStyle = {
  'arrow-scale': 1,
  'target-arrow-shape': 'triangle',
  'target-arrow-color': 'black',
  'curve-style': 'bezier',
};

const stylesheet=[
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

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    textTransform: 'none',
  },
}));

const generateMapping = (source, xWeight, yWeight) => {
  let mappingElements = [];
  switch (source.MappingFieldType) {
    case 'Function':
      mappingElements = generateFunctionMapping(source, xWeight, yWeight);
      break;
    case 'Column':
      mappingElements = generateSingleMapping(source, source.ColumnIdentifier, xWeight, yWeight);
      break;
    case 'Constant':
      mappingElements = generateSingleMapping(source, source.ConstantValue, xWeight, yWeight);
      break;
    case 'HL7Segment':
      mappingElements = generateSingleMapping(source, source.HL7Segment, xWeight, yWeight);
      break;
    case 'Switch':
      mappingElements = generateSwitchMapping(source, xWeight, yWeight);
      break;
    case 'Conditional':
      mappingElements = generateConditionMapping(source, xWeight, yWeight);
      break;
    case 'Combination':
      mappingElements = generateCombinationMapping(source, xWeight, yWeight);
      break;
    case 'Regex':
      mappingElements = generateRegexMapping(source, xWeight, yWeight);
      break;
    case 'Iteration':
      mappingElements = generateIterationMapping(source, xWeight, yWeight);
      break;
    default:
      mappingElements = generateSingleMapping(source, 'N/A', xWeight, yWeight);
      break;
  }
  return mappingElements;
};

const generateNode = (id, label, parent, xWeight, yWeight) => {
  const nodeElement = {
    data: {
      id,
      label,
      xWeight,
      yWeight,
    },
    group: 'nodes',
  };
  if (parent) {
    nodeElement.data.parent = parent;
  }
  return nodeElement;
};

const generateEntity = (id, label, xWeight, yWeight) => {
  return {
    data: {
      id,
      label,
      xWeight,
      yWeight,
    },
    classes: 'entity',
  };
};

const generateEdge = (id, source, target) => {
  return {
    data: {
      id,
      source,
      target,
    },
    classes: 'edges',
  };
};

const getAdditionalWeight = (type) => {
  switch (type) {
    case 'Combination': return 1;
    case 'Switch': return 2;
    case 'Conditional': return 3;
    default: return 0;
  }
}

const generateSingleMapping = (source, identifier, xWeight, yWeight) => {
  const elements = [
    generateNode(source.MappingFieldId, `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`, null, xWeight, yWeight),
  ];
  return elements;
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.FunctionParameter, xWeight+1, yWeight);
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;

  const elements = [
    generateEntity(currentId, `Function: ${source.FunctionName}`, xWeight, yWeight),
    generateNode(`source-${currentId}`, 'SourceParameter', currentId, xWeight, yWeight),
    generateEdge(`edge-source-${functionId}`, `source-${currentId}`, functionId),
  ];
  return elements.concat(nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;

  let elements = [
    generateEntity(currentId, 'Switch:', xWeight, yWeight),
    generateNode(`value-${switchId}`, 'SwitchValue', currentId, xWeight, yWeight),
    generateNode(`default-${defaultId}`, 'DefaultValue', currentId, xWeight, yWeight+1),
    generateNode(`case-source-${currentId}`, 'Cases', currentId, xWeight, yWeight+2),
    generateEntity(`case-target-${currentId}`, 'Cases', xWeight, yWeight),
    generateEdge(`edge-value-${switchId}`, `value-${switchId}`, switchId),
    generateEdge(`edge-default-${defaultId}`, `case-source-${currentId}`, `case-target-${currentId}`),
    generateEdge(`edge-case-${defaultId}`, `default-${defaultId}`, defaultId),
  ];

  const switchValue = generateMapping(source.SwitchValue, xWeight+1, yWeight);
  const switchDefault = generateMapping(source.SwitchDefault, xWeight+1, yWeight+1);

  source.Cases.map((caseItem, index) => {
    const nextMappingField = generateMapping(caseItem.Value, xWeight+3, yWeight+index);
    const valueId = caseItem.Value.MappingFieldId;
    const wrapper = [
      generateNode(`wrap-${valueId}`, `${caseItem.Key}`, `case-target-${currentId}`, xWeight+2, yWeight+index),
      generateEdge(`edge-each-case-${valueId}`, `wrap-${valueId}`, valueId),
    ];
    elements = elements.concat(wrapper.concat(nextMappingField));
    return wrapper;
  });

  return elements.concat(switchDefault).concat(switchValue);
};

const generateConditionMapping = (source, xWeight, yWeight) => {
  const addWeight = getAdditionalWeight(source.TrueField.MappingFieldType);
  const currentId = source.MappingFieldId;
  const trueId = source.TrueField.MappingFieldId;
  const falseId = source.FalseField.MappingFieldId;

  const elements = [
    generateEntity(currentId, 'Conditional:', xWeight, yWeight),
    generateNode(`condition-${currentId}`, 'Condition:', currentId, xWeight, yWeight),
    generateNode(`true-${currentId}`, 'If True:', currentId, xWeight, yWeight+2),
    generateNode(`false-${currentId}`, 'If False:', currentId, xWeight, yWeight+3+addWeight),
    generateEdge(`edge-true-${trueId}`, `true-${currentId}`, trueId),
    generateEdge(`edge-false-${falseId}`, `false-${currentId}`, falseId),
  ];

  const trueMappingField = generateMapping(source.TrueField, xWeight+1, yWeight+2);
  const falseMappingField = generateMapping(source.FalseField, xWeight+1, yWeight+3+addWeight);
  const field1 = source.Condition.Field1;
  const field2 = source.Condition.Field2;

  let fields = [
    generateEntity(`fields-${currentId}`, '', xWeight, yWeight),
    generateNode(`field1-${currentId}`, 'Field 1', `fields-${currentId}`, xWeight+1, yWeight),
    generateNode(`field2-${currentId}`, 'Field 2', `fields-${currentId}`, xWeight+1, yWeight+1),
    generateEdge(`edge-fields-${currentId}`, `condition-${currentId}`, `fields-${currentId}`),
    generateEdge(`edge-field1-${currentId}`, `field1-${currentId}`, field1.MappingFieldId),
    generateEdge(`edge-field2-${currentId}`, `field2-${currentId}`, field2.MappingFieldId),
  ];

  const field1MappingField = generateMapping(field1, xWeight+2, yWeight);
  const field2MappingField = generateMapping(field2, xWeight+2, yWeight+1);
  fields = fields.concat(field1MappingField);
  fields = fields.concat(field2MappingField);

  return elements.concat(fields).concat(trueMappingField).concat(falseMappingField);
};

const generateCombinationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  let elements = [
    generateEntity(currentId, 'Combination', xWeight, yWeight)
  ];

  if (source.Field1) {
    const field1 = source.Field1;
    const field2 = source.Field2;
    const addWeight = getAdditionalWeight(field1.MappingFieldType);
  
    const fields = [
      generateNode(`field1-${currentId}`, 'Field 1', currentId, xWeight, yWeight),
      generateNode(`field2-${currentId}`, 'Field 2', currentId, xWeight, yWeight+1+addWeight),
      generateEdge(`edge-field1-${currentId}`, `field1-${currentId}`, field1.MappingFieldId),
      generateEdge(`edge-field2-${currentId}`, `field2-${currentId}`, field2.MappingFieldId),
    ];

    const field1MappingField = generateMapping(field1, xWeight+2, yWeight);
    const field2MappingField = generateMapping(field2, xWeight+1, yWeight+1+addWeight);

    elements = elements.concat(fields);
    elements = elements.concat(field1MappingField).concat(field2MappingField);
  }

  return elements;
};

const generateRegexMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(currentId, 'Regex', xWeight, yWeight),
    generateNode(`info-${currentId}`, `Pattern: "${source.RegexPattern}", Flags: "${source.RegexFlags}" Group: "${source.RegexGroup}"`, currentId, xWeight, yWeight),
    generateNode(`source-${currentId}`, 'Source:', currentId, xWeight, yWeight+1),
    generateEdge(`edge-source-${currentId}`, `source-${currentId}`, source.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Source, xWeight+1, yWeight+1);

  return elements.concat(sourceMappingField);
};

const generateIterationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(currentId, 'Iteration', xWeight, yWeight),
    generateNode(`info-${currentId}`, `Delimiter: "${source.Iterator.Delimiter}", Index: "${source.Iterator.Index}"`, currentId, xWeight, yWeight),
    generateNode(`source-${source.Iterator.IteratorId}`, 'Source:', currentId, xWeight, yWeight+1),
    generateEdge(`edge-source-${currentId}`, `source-${source.Iterator.IteratorId}`, source.Iterator.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Iterator.Source, xWeight+1, yWeight+1);

  return elements.concat(sourceMappingField);
};

const Diagram = forwardRef(({ source, elementId, triggerModal }, ref) => {
  useEffect(() => {
    cyListener.on('tap', function(e) {
      const isModalShown = e.target._private.group === 'nodes' ? true : false;
      triggerModal(e.target._private, isModalShown);
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);


  let cyListener;
  const elements = source ? generateMapping(source, 1, 1) : [];
  const layout = {
    name: 'preset',
    fit: false,
    transform: function(node, pos) {
      if (node._private.data.xWeight && node._private.data.yWeight)
        return {
          x: node._private.data.xWeight * DIAGRAM_CONF.NODE_WIDTH,
          y: node._private.data.yWeight * DIAGRAM_CONF.NODE_HEIGHT,
        };
      return pos;
    },
  };
  const xWeightMax = elements.length > 0 ?
    Math.max.apply(Math, elements.map(function(o) { return o.data.xWeight ? o.data.xWeight : 0; }))
    : 0;
  const yWeightMax = elements.length > 0 ?
    Math.max.apply(Math, elements.map(function(o) { return o.data.yWeight ? o.data.yWeight : 0; }))
    : 0;

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    validate: (element) => {
      console.log('Finally', element);
    }
  }))

  return (
    <Grid>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => triggerModal(elementId, true)}>
        <AddIcon />
      </Fab>
      <CytoscapeComponent
        cy={(cy) => { cyListener=cy }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        layout={layout}
        stylesheet={stylesheet}
        style={
          {
            width: (xWeightMax + 1) * DIAGRAM_CONF.NODE_WIDTH,
            height: Math.min(500, (yWeightMax + 1) * DIAGRAM_CONF.NODE_HEIGHT),
            marginTop: 60,
          }
        }
      />
    </Grid>
    
  );
});

export default Diagram;