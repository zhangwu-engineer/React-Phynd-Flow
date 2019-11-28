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
  switch (type) {
    case 'Function':
      return {
        MappingFieldId: `function-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        FunctionName: inputValue.primary,
        FunctionParameter: {},
      };
    case 'Column':
      return {
        MappingFieldId: `column-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        ColumnIdentifier: inputValue.primary,
      };
    case 'Constant':
      return {
        MappingFieldId: `constant-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        ConstantValue: inputValue.primary,
      };
    case 'HL7':
      return {
        MappingFieldId: `hl7-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        HL7Segment: inputValue.primary,
      };
    case 'Switch':
      return {
        MappingFieldId: `switch-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        SwitchDefault: {
        },
        SwitchValue: {
        },
        Cases: [],
      };
    case 'Conditional':
      return {
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
    case 'Combination':
      return {
        MappingFieldId: `combination-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        Field1: {
        },
        Field2: {
        },
      };
    case 'Regex':
      return {
        MappingFieldId: `regex-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        RegexPattern: inputValue.primary,
        RegexFlags: inputValue.secondary,
        RegexGroup: inputValue.tertiary,
        Source: {},
      };
    case 'Iteration':
      return {
        MappingFieldId: `iteration-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
        MappingFieldType: type,
        Iterator: {
          IteratorId: `iterator-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          Source: {},
          Delimiter: inputValue.primary,
          Index: inputValue.secondary,
        },
      };
    default:
      return {};
  }
};

const generateMapping = (source, xWeight, yWeight) => {
  if (!source) return [];
  switch (source.MappingFieldType) {
    case 'Function':
      return generateFunctionMapping(source, xWeight, yWeight);
    case 'Column':
      return generateSingleMapping(source, source.ColumnIdentifier, xWeight, yWeight);
    case 'Constant':
      return generateSingleMapping(source, source.ConstantValue, xWeight, yWeight);
    case 'HL7':
      return generateSingleMapping(source, source.HL7Segment, xWeight, yWeight);
    case 'Switch':
      return generateSwitchMapping(source, xWeight, yWeight);
    case 'Conditional':
      return generateConditionMapping(source, xWeight, yWeight);
    case 'Combination':
      return generateCombinationMapping(source, xWeight, yWeight);
    case 'Regex':
      return generateRegexMapping(source, xWeight, yWeight);
    case 'Iteration':
      return generateIterationMapping(source, xWeight, yWeight);
    default:
      return [];
  }
};

const generateNode = (id, label, parent, parentType, nextType, dataDetails, xWeight, yWeight) => {
  const nodeElement = {
    data: {
      id,
      label,
      parentType,
      nextType,
      dataDetails,
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
  return [
    generateNode(source.MappingFieldId, `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`, null, source.MappingFieldType, null, null, xWeight, yWeight),
  ];
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.FunctionParameter, xWeight+1, yWeight);
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;
  const functionType = source.FunctionParameter.MappingFieldType;

  const elements = [
    generateEntity(currentId, `Function: ${source.FunctionName}`, xWeight, yWeight),
    generateNode(`source-${currentId}`, 'SourceParameter', currentId, 'function-source', functionType, getDataDetails(source.FunctionParameter), xWeight, yWeight),
    generateEdge(`edge-source-${functionId}`, `source-${currentId}`, functionId),
  ];
  return elements.concat(nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;
  const switchType = source.SwitchValue.MappingFieldType;
  const defaultType = source.SwitchDefault.MappingFieldType;
  const addWeight1 = source.SwitchValue && getAdditionalWeight(switchType);
  const addWeight2 = source.SwitchValue && getAdditionalWeight(defaultType);

  let elements = [
    generateEntity(currentId, 'Switch:', xWeight, yWeight),
    generateNode(`value-${currentId}`, 'SwitchValue', currentId, 'switch-value', switchType, getDataDetails(source.SwitchValue), xWeight, yWeight),
    generateNode(`default-${currentId}`, 'DefaultValue', currentId, 'switch-default', defaultType, getDataDetails(source.SwitchDefault),  xWeight, yWeight+1+addWeight1),
    generateNode(`case-source-${currentId}`, 'Cases', currentId, 'switch-entity', 'switch-entity', null, xWeight, yWeight+2+addWeight1+addWeight2),
    generateEntity(`case-target-${currentId}`, 'Cases', xWeight+2, yWeight+2+addWeight1+addWeight2),
    generateEdge(`edge-case-${currentId}`, `case-source-${currentId}`, `case-target-${currentId}`),
  ];

  if (switchId) {
    const switchValue = generateMapping(source.SwitchValue, xWeight+1, yWeight);
    elements.push(generateEdge(`edge-value-${switchId}`, `value-${currentId}`, switchId));
    elements = elements.concat(switchValue);
  }
  if (defaultId) {
    const switchDefault = generateMapping(source.SwitchDefault, xWeight+1, yWeight+1+addWeight1);
    elements.push(generateEdge(`edge-default-${defaultId}`, `default-${currentId}`, defaultId));
    elements = elements.concat(switchDefault);
  }

  let addWeight = addWeight1 + addWeight2;
  source.Cases.map((caseItem, index) => {
    const nextMappingField = generateMapping(caseItem.Value, xWeight+3, yWeight+2+index+addWeight);
    const valueId = caseItem.Value.MappingFieldId;
    const valueType = caseItem.Value.MappingFieldType;
    const caseKeyDetails = getDataDetails(caseItem.Value);
    if (caseKeyDetails) caseKeyDetails.fourth = caseItem.Key;

    const wrapper = [
      generateNode(`wrap-${valueId}`, `${caseItem.Key}`, `case-target-${currentId}`, 'cases-entity', valueType, caseKeyDetails, xWeight+2, yWeight+2+index+addWeight),
      generateEdge(`edge-each-case-${valueId}`, `wrap-${valueId}`, valueId),
    ];
    elements = elements.concat(wrapper.concat(nextMappingField));
    addWeight += getAdditionalWeight(caseItem.Value.MappingFieldType);
    return wrapper;
  });

  return elements;
};

const generateConditionMapping = (source, xWeight, yWeight) => {
  const addWeight = source.TrueField && getAdditionalWeight(source.TrueField.MappingFieldType);
  const currentId = source.MappingFieldId;
  const trueId = source.TrueField && source.TrueField.MappingFieldId;
  const falseId = source.FalseField && source.FalseField.MappingFieldId;
  const conditionId = source.Condition && source.Condition.ConditionId;

  const field1 = source.Condition && source.Condition.Field1;
  const field2 = source.Condition && source.Condition.Field2;
  const addWeightField1 = getAdditionalWeight(field1.MappingFieldType);
  const addWeightField2 = getAdditionalWeight(field2.MappingFieldType);

  const elements = [
    generateEntity(currentId, 'Conditional:', xWeight, yWeight),
    generateNode(`condition-${currentId}`, 'Condition:', currentId, 'conditional-entity', 'conditional-entity', null, xWeight, yWeight),
    generateNode(`true-${currentId}`, 'If True:', currentId, 'conditional-true', source.TrueField.MappingFieldType, getDataDetails(source.TrueField), xWeight, yWeight+2+addWeightField1+addWeightField2),
    generateNode(`false-${currentId}`, 'If False:', currentId, 'conditional-false', source.FalseField.MappingFieldType, getDataDetails(source.FalseField), xWeight, yWeight+3+addWeight+addWeightField1+addWeightField2),
    generateEdge(`edge-true-${trueId}`, `true-${currentId}`, trueId),
    generateEdge(`edge-false-${falseId}`, `false-${currentId}`, falseId),
  ];

  const trueMappingField = generateMapping(source.TrueField, xWeight+1, yWeight+2+addWeightField1+addWeightField2);
  const falseMappingField = generateMapping(source.FalseField, xWeight+1, yWeight+3+addWeight+addWeightField1+addWeightField2);

  let fields = [
    generateEntity(conditionId, '', xWeight, yWeight),
    generateNode(`field1-${conditionId}`, 'Field 1', conditionId, 'condition1', field1.MappingFieldType, getDataDetails(field1), xWeight+1, yWeight),
    generateNode(`field2-${conditionId}`, 'Field 2', conditionId, 'condition2', field2.MappingFieldType, getDataDetails(field2), xWeight+1, yWeight+1+addWeightField1),
    generateEdge(`edge-fields-${currentId}`, `condition-${currentId}`, conditionId),
  ];

  if (field1) {
    const field1MappingField = generateMapping(field1, xWeight+2, yWeight);
    fields = fields.concat(field1MappingField);
    fields.push(generateEdge(`edge-field1-${conditionId}`, `field1-${conditionId}`, field1.MappingFieldId));
  }
  if (field2) {
    const field2MappingField = generateMapping(field2, xWeight+2, yWeight+1+addWeightField1);
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
      generateNode(`field1-${currentId}`, 'Field 1', currentId, 'combination1', field1.MappingFieldType, getDataDetails(field1), xWeight, yWeight),
      generateNode(`field2-${currentId}`, 'Field 2', currentId, 'combination2', field2.MappingFieldType, getDataDetails(field2), xWeight, yWeight+1+addWeight),
      generateEdge(`edge-field1-${currentId}`, `field1-${currentId}`, field1.MappingFieldId),
      generateEdge(`edge-field2-${currentId}`, `field2-${currentId}`, field2.MappingFieldId),
    ];

    const field1MappingField = generateMapping(field1, xWeight+1, yWeight);
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
    generateNode(`info-${currentId}`, `Pattern: "${source.RegexPattern}", Flags: "${source.RegexFlags}" Group: "${source.RegexGroup}"`, currentId, 'regex-info', 'regex-info', null, xWeight, yWeight+1),
    generateNode(`source-${currentId}`, 'Source:', currentId, 'regex-source', source.Source.MappingFieldType, getDataDetails(source.Source), xWeight, yWeight),
    generateEdge(`edge-source-${currentId}`, `source-${currentId}`, source.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Source, xWeight+1, yWeight);

  return elements.concat(sourceMappingField);
};

const generateIterationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(currentId, 'Iteration', xWeight, yWeight),
    generateNode(`info-${currentId}`, `Delimiter: "${source.Iterator.Delimiter}", Index: "${source.Iterator.Index}"`, currentId, 'iteration', 'iteration', null, xWeight, yWeight+1),
    generateNode(`source-${source.Iterator.IteratorId}`, 'Source:', currentId, 'iteration-source', source.Iterator.Source.MappingFieldType, getDataDetails(source.Iterator.Source), xWeight, yWeight),
    generateEdge(`edge-source-${currentId}`, `source-${source.Iterator.IteratorId}`, source.Iterator.Source.MappingFieldId),
  ];
  const sourceMappingField = generateMapping(source.Iterator.Source, xWeight+1, yWeight);

  return elements.concat(sourceMappingField);
};

const getPropertyToMap = (type) => {
  switch(type) {
    case 'condition1':
      return {
        id: 'ConditionId',
        name: 'Field1',
      };
    case 'condition2':
      return {
        id: 'ConditionId',
        name: 'Field2',
      };
    case 'conditional-true':
      return {
        id: 'MappingFieldId',
        name: 'TrueField',
      };
    case 'conditional-false':
      return {
        id: 'MappingFieldId',
        name: 'FalseField',
      };
    case 'combination1':
      return {
        id: 'MappingFieldId',
        name: 'Field1',
      };
    case 'combination2':
      return {
        id: 'MappingFieldId',
        name: 'Field2',
      };
    case 'function-source':
      return {
        id: 'MappingFieldId',
        name: 'FunctionParameter',
      };
    case 'iteration-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'regex-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'switch-value':
      return {
        id: 'MappingFieldId',
        name: 'SwitchValue',
      };
    case 'switch-default':
      return {
        id: 'MappingFieldId',
        name: 'SwitchDefault',
      };
    case 'cases-entity':
      return {
        id: 'MappingFieldId',
      };
    case 'Constant':
      return {
        name: 'ConstantValue',
      };
    case 'Column':
      return {
        name: 'ColumnIdentifier',
      };
    case 'HL7':
      return {
        name: 'HL7Segment',
      };
    case 'Function':
      return {
        name: 'FunctionName',
      };
    default:
      return {
        id: 'MappingFieldId',
        name: 'Value',
      };
  }
}

const getDataDetails = (nextField) => {
  switch (nextField.MappingFieldType) {
    case 'Constant':
      return {
        primary: nextField.ConstantValue,
        secondary: '',
        tertiary: '',
        fourth: '',
      };
    case 'Column':
      return {
        primary: nextField.ColumnIdentifier,
        secondary: '',
        tertiary: '',
        fourth: '',
      };
    case 'HL7':
      return {
        primary: nextField.HL7Segment,
        secondary: '',
        tertiary: '',
        fourth: '',
      };
    case 'Function':
      return {
        primary: nextField.FunctionName,
        secondary: '',
        tertiary: '',
        fourth: '',
      };
    case 'Regex':
      return {
        primary: nextField.RegexPattern,
        secondary: nextField.RegexFlags,
        tertiary: nextField.RegexGroup,
        fourth: '',
      };
    case 'Iteration':
      return {
        primary: nextField.Iterator.Delimiter,
        secondary: nextField.Iterator.Index,
        tertiary: '',
        fourth: '',
      };
    default:
      return null;
  }
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
                  if (inputValue.fourth) {
                    obj[p][ca]['Key'] = inputValue.fourth;
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
              } else if (obj[propertyToFind.name] && obj[propertyToFind.name]['MappingFieldType']) {
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
    },
    remove: (element, parent) => {
      if (parent) {
        const propertyToFind = getPropertyToMap(parent.data.parentType);
        const findByProperty = (obj, val)=> {
          for (let p in obj) {
            if (Array.isArray(obj[p])) {
              for (let ca in obj[p]) {
                if (obj[p][ca]['Value'] && `wrap-${obj[p][ca]['Value'][propertyToFind.id]}` === parent.data.id) {
                  obj[p].splice(ca, 1);
                  return obj;
                }
              }
            }
            if (!val) {
              for (let p in obj) {
                obj[p] = {};
              }
              return obj;
            } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
              if (element) {
                obj[propertyToFind.name] = {};
                if (parent.data.parentType === 'iteration-source')
                  obj['Iterator'][propertyToFind.name] = {};
                return obj;
              } else if (obj[propertyToFind.name] && obj[propertyToFind.name]['MappingFieldType']) {
                obj[propertyToFind.name] = {};
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
        updateDashboard({});
      }
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