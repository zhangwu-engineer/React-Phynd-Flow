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

const generateInitialSource = (type, parent, inputValue) => {
  let source = {};
  switch (type) {
    case 'Function':
      source = {
        MappingFieldId: `function-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        FunctionName: inputValue.primary,
        FunctionParameter: {},
      };
      break;
    case 'Column':
      source = {
        MappingFieldId: `column-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        ColumnIdentifier: inputValue.primary,
      };
      break;
    case 'Constant':
      source = {
        MappingFieldId: `constant-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        ConstantValue: inputValue.primary,
      };
      break;
    case 'HL7':
      source = {
        MappingFieldId: `hl7-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        HL7Segment: inputValue.primary,
      };
      break;
    case 'Switch':
      source = {
        MappingFieldId: `switch-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        SwitchDefault: {
        },
        SwitchValue: {
        },
        Cases: [],
      };
      break;
    case 'Conditional':
      source = {
        MappingFieldId: `conditional-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        TrueField: {
        },
        FalseField: {
        },
        Condition: {
          ConditionId: `condition-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          Field1: {
          },
          Field2: {
          },
        }
      };
      break;
    case 'Combination':
      source = {
        MappingFieldId: `combination-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        Field1: {
        },
        Field2: {
        },
      };
      break;
    case 'Regex':
      source = {
        MappingFieldId: `regex-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        RegexPattern: inputValue.primary,
        RegexFlags: inputValue.secondary,
        RegexGroup: inputValue.tertiary,
        Source: {},
      };
      break;
    case 'Iteration':
      source = {
        MappingFieldId: `iteration-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        Iterator: {
          IteratorId: `iterator-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          Source: {},
          Delimiter: inputValue.primary,
          Index: inputValue.secondary,
        },
      };
      break;
    default:
      break;
  }
  return source;
};

const generateMapping = (source, xWeight, yWeight) => {
  let mappingElements = [];
  if (!source) return [];
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
    case 'HL7':
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
      break;
  }
  return mappingElements;
};

const generateNode = (id, label, parent, parentType, xWeight, yWeight) => {
  const nodeElement = {
    data: {
      id,
      label,
      parentType,
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
      entity: label,
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
    case 'Regex': return 1;
    case 'Iteration': return 1;
    case 'Combination': return 1;
    case 'Switch': return 2;
    case 'Conditional': return 3;
    default: return 0;
  }
}

const generateSingleMapping = (source, identifier, xWeight, yWeight) => {
  const elements = [
    generateNode(source.MappingFieldId, `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`, null, source.MappingFieldType, xWeight, yWeight),
  ];
  return elements;
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.FunctionParameter, xWeight+1, yWeight);
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;

  const elements = [
    generateEntity(currentId, `Function: ${source.FunctionName}`, xWeight, yWeight),
    generateNode(`source-${currentId}`, 'SourceParameter', currentId, 'function-source', xWeight, yWeight),
    generateEdge(`edge-source-${functionId}`, `source-${currentId}`, functionId),
  ];
  return elements.concat(nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;
  const addWeight1 = source.SwitchValue && getAdditionalWeight(source.SwitchValue.MappingFieldType);
  const addWeight2 = source.SwitchValue && getAdditionalWeight(source.SwitchDefault.MappingFieldType);

  let elements = [
    generateEntity(currentId, 'Switch:', xWeight, yWeight),
    generateNode(`value-${switchId}`, 'SwitchValue', currentId, 'switch-value', xWeight, yWeight),
    generateNode(`default-${defaultId}`, 'DefaultValue', currentId, 'switch-default', xWeight, yWeight+1+addWeight1),
    generateNode(`case-source-${currentId}`, 'Cases', currentId, 'switch-entity', xWeight, yWeight+2+addWeight1+addWeight2),
    generateEntity(`case-target-${currentId}`, 'Cases', xWeight+2, yWeight+2+addWeight1+addWeight2),
    generateEdge(`edge-value-${switchId}`, `value-${switchId}`, switchId),
    generateEdge(`edge-default-${defaultId}`, `case-source-${currentId}`, `case-target-${currentId}`),
    generateEdge(`edge-case-${defaultId}`, `default-${defaultId}`, defaultId),
  ];

  const switchValue = generateMapping(source.SwitchValue, xWeight+1, yWeight);
  const switchDefault = generateMapping(source.SwitchDefault, xWeight+1, yWeight+1+addWeight1);

  source.Cases.map((caseItem, index) => {
    const nextMappingField = generateMapping(caseItem.Value, xWeight+3, yWeight+2+index+addWeight1+addWeight2);
    const valueId = caseItem.Value.MappingFieldId;
    const wrapper = [
      generateNode(`wrap-${valueId}`, `${caseItem.Key}`, `case-target-${currentId}`, 'cases-entity', xWeight+2, yWeight+2+index+addWeight1+addWeight2),
      generateEdge(`edge-each-case-${valueId}`, `wrap-${valueId}`, valueId),
    ];
    elements = elements.concat(wrapper.concat(nextMappingField));
    return wrapper;
  });

  return elements.concat(switchDefault).concat(switchValue);
};

const generateConditionMapping = (source, xWeight, yWeight) => {
  const addWeight = source.TrueField && getAdditionalWeight(source.TrueField.MappingFieldType);
  const currentId = source.MappingFieldId;
  const trueId = source.TrueField && source.TrueField.MappingFieldId;
  const falseId = source.FalseField && source.FalseField.MappingFieldId;
  const conditionId = source.Condition && source.Condition.ConditionId;

  const elements = [
    generateEntity(currentId, 'Conditional:', xWeight, yWeight),
    generateNode(`condition-${currentId}`, 'Condition:', currentId, 'conditional-entity', xWeight, yWeight),
    generateNode(`true-${currentId}`, 'If True:', currentId, 'conditional-true', xWeight, yWeight+2),
    generateNode(`false-${currentId}`, 'If False:', currentId, 'conditional-false', xWeight, yWeight+3+addWeight),
    generateEdge(`edge-true-${trueId}`, `true-${currentId}`, trueId),
    generateEdge(`edge-false-${falseId}`, `false-${currentId}`, falseId),
  ];

  const trueMappingField = generateMapping(source.TrueField, xWeight+1, yWeight+2);
  const falseMappingField = generateMapping(source.FalseField, xWeight+1, yWeight+3+addWeight);

  const field1 = source.Condition && source.Condition.Field1;
  const field2 = source.Condition && source.Condition.Field2;

  let fields = [
    generateEntity(conditionId, '', xWeight, yWeight),
    generateNode(`field1-${conditionId}`, 'Field 1', conditionId, 'condition1', xWeight+1, yWeight),
    generateNode(`field2-${conditionId}`, 'Field 2', conditionId, 'condition2', xWeight+1, yWeight+1),
    generateEdge(`edge-fields-${currentId}`, `condition-${currentId}`, conditionId),
  ];

  if (field1) {
    const field1MappingField = generateMapping(field1, xWeight+3, yWeight);
    fields = fields.concat(field1MappingField);
    fields.push(generateEdge(`edge-field1-${conditionId}`, `field1-${conditionId}`, field1.MappingFieldId));
  }
  if (field2) {
    const field2MappingField = generateMapping(field2, xWeight+2, yWeight+1);
    fields = fields.concat(field2MappingField);
    fields.push(generateEdge(`edge-field2-${conditionId}`, `field2-${conditionId}`, field2.MappingFieldId));
  }
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
      generateNode(`field1-${currentId}`, 'Field 1', currentId, 'combination1', xWeight, yWeight),
      generateNode(`field2-${currentId}`, 'Field 2', currentId, 'combination2', xWeight, yWeight+1+addWeight),
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
    generateNode(`info-${currentId}`, `Pattern: "${source.RegexPattern}", Flags: "${source.RegexFlags}" Group: "${source.RegexGroup}"`, currentId, 'regex-info', xWeight, yWeight),
    generateNode(`source-${currentId}`, 'Source:', currentId, 'regex-source', xWeight, yWeight+1),
    generateEdge(`edge-source-${currentId}`, `source-${currentId}`, source.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Source, xWeight+1, yWeight+1);

  return elements.concat(sourceMappingField);
};

const generateIterationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(currentId, 'Iteration', xWeight, yWeight),
    generateNode(`info-${currentId}`, `Delimiter: "${source.Iterator.Delimiter}", Index: "${source.Iterator.Index}"`, currentId, 'iteration', xWeight, yWeight),
    generateNode(`source-${source.Iterator.IteratorId}`, 'Source:', currentId, 'iteration-source', xWeight, yWeight+1),
    generateEdge(`edge-source-${currentId}`, `source-${source.Iterator.IteratorId}`, source.Iterator.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Iterator.Source, xWeight+1, yWeight+1);

  return elements.concat(sourceMappingField);
};

const getPropertyToMap = (type) => {
  let propertyToMap = {};
  switch(type) {
    case 'condition1':
      propertyToMap = {
        id: 'ConditionId',
        name: 'Field1',
      };
      break;
    case 'condition2':
      propertyToMap = {
        id: 'ConditionId',
        name: 'Field2',
      };
      break;
    case 'conditional-true':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'TrueField',
      };
      break;
    case 'conditional-false':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'FalseField',
      };
      break;
    case 'combination1':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'Field1',
      };
      break;
    case 'combination2':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'Field2',
      };
      break;
    case 'function-source':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'FunctionParameter',
      };
      break;
    case 'iteration-source':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'Source',
      };
      break;   
    case 'regex-source':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'Source',
      };
      break;
    case 'switch-value':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'SwitchValue',
      };
      break;
    case 'switch-default':
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'SwitchDefault',
      };
      break;
    case 'cases-entity':
      propertyToMap = {
        id: 'MappingFieldId',
      };
      break;
    case 'Constant':
      propertyToMap = {
        name: 'ConstantValue',
      };
      break;
    case 'Column':
      propertyToMap = {
        name: 'ColumnIdentifier',
      };
      break;
    case 'HL7':
      propertyToMap = {
        name: 'HL7Segment',
      };
      break;
    case 'Function':
      propertyToMap = {
        name: 'FunctionName',
      };
      break;
    default:
      propertyToMap = {
        id: 'MappingFieldId',
        name: 'Value',
      };
      break;
  }
  return propertyToMap;
}

const Diagram = forwardRef(({ source, item, elementId, triggerModal, triggerCaseKeyModal, updateDashboard }, ref) => {
  const [elements, setElements] = React.useState([]);

  useEffect(() => {
    cyListener.on('tap', function(e) {
      const isModalShown = e.target._private.group === 'nodes' ? true : false;
      if (e.target._private.data.entity && e.target._private.data.entity === 'Cases') {
        triggerCaseKeyModal(elementId, isModalShown, e.target._private);
      } else if ((e.target._private.edges && e.target._private.edges.length === 0) || e.target._private.parent) {
        triggerModal(elementId, isModalShown, e.target._private);
      }
    });
    source && setElements(generateMapping(source, 1, 1));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [source]);


  let cyListener;
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
    Math.max.apply(Math, elements.map(function(o) { return o.data && o.data.xWeight ? o.data.xWeight : 0; }))
    : 0;
  const yWeightMax = elements.length > 0 ?
    Math.max.apply(Math, elements.map(function(o) { return o.data && o.data.yWeight ? o.data.yWeight : 0; }))
    : 0;

  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    validate: (element, parent, inputValue) => {
      if (parent) {
        const propertyToFind = getPropertyToMap(parent.data.parentType);
        const findByProperty = (obj, val)=> {
          for (let p in obj) {
            if (Array.isArray(obj[p])) {
              for (let ca in obj[p]) {
                if (obj[p][ca]['Value'] && `wrap-${obj[p][ca]['Value'][propertyToFind.id]}` === parent.data.id) {
                  obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, inputValue);
                  if (inputValue.secondary) {
                    obj[p][ca]['Key'] = inputValue.secondary;
                  }
                  return obj;
                }
              }
            }
            if (!val) {
              const obj2 = generateInitialSource(element, parent, inputValue);
              for (var attrname in obj2) { obj[attrname] = obj2[attrname]; }
              return obj;
            } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
              if (element) {
                obj[propertyToFind.name] = generateInitialSource(element, parent, inputValue);
                if (parent.data.parentType === 'iteration-source')
                  obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, inputValue);
                return obj;
              } else {
                const propertyToUpdate = getPropertyToMap(obj[propertyToFind.name]['MappingFieldType']);
                obj[propertyToFind.name][propertyToUpdate.name] = inputValue.primary;
                return obj;
              }
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
        updateDashboard(generateInitialSource(element, parent, inputValue));
      }
    },
    validateCaseKey: (parent, inputKeyValue) => {
      const findByProperty = (obj, val)=> {
        for (let p in obj) {
          if (Array.isArray(obj[p]) && p === 'Cases' && `case-target-${obj['MappingFieldId']}` === val) {
            obj[p].push({
              Key: inputKeyValue,
              Value: {},
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
    }
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