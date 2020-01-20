import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import CytoscapeComponent from 'react-cytoscapejs';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import { generateInitialSource } from './generateInitialSource';

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

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    textTransform: 'none',
    marginLeft: 'calc(50% - 28px)',
    marginTop: 50,
  },
}));



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
    case 'JsonProperty':
      return generateJsonPropertyMapping(source, xWeight, yWeight);
    case 'JsonElement':
      return generateJsonElementMapping(source, xWeight, yWeight);
    case 'Aggregate':
      return generateAggregateMapping(source, xWeight, yWeight);
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

const generateEntity = (id, label, parentType, dataDetails, xWeight, yWeight) => {
  return {
    data: {
      id,
      label,
      parentType,
      dataDetails,
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

const generateSingleMapping = (source, identifier, xWeight, yWeight) => {
  return [
    generateNode(
      source.MappingFieldId,
      `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`,
      null,
      source.MappingFieldType,
      null,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
  ];
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.FunctionParameter, xWeight+1, yWeight+1);
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;
  const functionType = source.FunctionParameter.MappingFieldType;

  const elements = [
    generateEntity(
      currentId,
      `Function:`,
      'Function',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-${currentId}`,
      `Name: ${source.FunctionName}`,
      currentId, 'function-info',
      source.MappingFieldType,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `source-${currentId}`,
      'SourceParameter',
      currentId,
      'function-source',
      functionType,
      null,
      xWeight, 
      yWeight+1
    ),
    generateEdge(
      `edge-source-${functionId}`,
      `source-${currentId}`,
      functionId
    ),
  ];
  return _.concat(elements, nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;
  const switchType = source.SwitchValue.MappingFieldType;
  const defaultType = source.SwitchDefault.MappingFieldType;
  const addWeight1 = source.SwitchValue && getChildrenWeight(source.SwitchValue);
  const addWeight2 = source.SwitchValue && getChildrenWeight(source.SwitchDefault);
  const addWeight = addWeight1 + addWeight2;

  let elements = [
    generateEntity(
      currentId,
      'Switch:',
      'Switch',
      null,
      xWeight,
      yWeight
    ),
    generateNode(
      `value-${currentId}`,
      'SwitchValue',
      currentId,
      'switch-value',
      switchType,
      getDataDetails(source.SwitchValue),
      xWeight,
      yWeight
    ),
    generateNode(
      `default-${currentId}`,
      'DefaultValue',
      currentId,
      'switch-default',
      defaultType,
      getDataDetails(source.SwitchDefault),
      xWeight,
      yWeight+addWeight1
    ),
    generateNode(
      `case-source-${currentId}`,
      'Cases:',
      currentId,
      'switch-entity',
      'switch-entity',
      null,
      xWeight,
      yWeight+addWeight
    ),
    generateEntity(
      `case-target-${currentId}`,
      'Cases',
      'Cases',
      null,
      xWeight+1,
      yWeight+addWeight
    ),
    generateEdge(
      `edge-case-${currentId}`,
      `case-source-${currentId}`,
      `case-target-${currentId}`
    ),
  ];

  if (switchId) {
    const switchValue = generateMapping(source.SwitchValue, xWeight+1, yWeight);
    elements.push(generateEdge(
      `edge-value-${switchId}`,
      `value-${currentId}`,
      switchId
    ));
    elements = _.concat(elements, switchValue);
  }
  if (defaultId) {
    const switchDefault = generateMapping(source.SwitchDefault, xWeight+1, yWeight+addWeight1);
    elements.push(generateEdge(
      `edge-default-${defaultId}`,
      `default-${currentId}`,
      defaultId
    ));
    elements = _.concat(elements, switchDefault);
  }

  let addCasesWeight = addWeight;
  _.map(source.Cases, (caseItem, index) => {
    const nextMappingField = generateMapping(caseItem.Value, xWeight+2, yWeight+index+addCasesWeight);
    const valueId = caseItem.Value.MappingFieldId;
    const valueType = caseItem.Value.MappingFieldType;
    let caseKeyDetails = getDataDetails(caseItem.Value);
    const alternativeId = `case-value-${Math.random()*10000}`;
    if (caseKeyDetails) {
      caseKeyDetails.fourth = caseItem.Key;
    } else {
      caseKeyDetails = index;
    }

    const wrapper = [
      generateNode(
        `wrap-${valueId ? valueId : alternativeId}`,
        `${caseItem.Key}`,
        `case-target-${currentId}`,
        'cases-entity',
        valueType,
        caseKeyDetails,
        xWeight+1,
        yWeight+index+addCasesWeight
      )
    ];
    if (valueId) {
      wrapper.push(
        generateEdge(
          `edge-each-case-${valueId}`,
          `wrap-${valueId}`,
          valueId ? valueId : alternativeId
        ),
      );
    }
    elements = _.concat(elements, wrapper, nextMappingField);
    addCasesWeight += getChildrenWeight(caseItem.Value) - 1;
    return wrapper;
  });

  return elements;
};

const generateConditionMapping = (source, xWeight, yWeight) => {
  const addWeight = source.TrueField && getChildrenWeight(source.TrueField);
  const currentId = source.MappingFieldId;
  const trueId = source.TrueField && source.TrueField.MappingFieldId;
  const falseId = source.FalseField && source.FalseField.MappingFieldId;
  const conditionId = source.Condition && source.Condition.ConditionId;

  const field1 = source.Condition && source.Condition.Field1;
  const field2 = source.Condition && source.Condition.Field2;
  const addWeightField1 = getChildrenWeight(field1);
  const addWeightField2 = getChildrenWeight(field2);

  const elements = [
    generateEntity(
      currentId,
      'Conditional:',
      'Conditional',
      null,
      xWeight,
      yWeight
    ),
    generateNode(
      `condition-${currentId}`,
      'Condition:',
      currentId,
      'conditional-entity',
      'conditional-entity',
      null,
      xWeight,
      yWeight
    ),
    generateNode(
      `true-${currentId}`,
      'If True:',
      currentId,
      'conditional-true',
      source.TrueField.MappingFieldType,
      getDataDetails(source.TrueField),
      xWeight,
      yWeight+addWeightField1+addWeightField2
    ),
    generateNode(
      `false-${currentId}`,
      'If False:',
      currentId,
      'conditional-false',
      source.FalseField.MappingFieldType,
      getDataDetails(source.FalseField),
      xWeight,
      yWeight+addWeight+addWeightField1+addWeightField2
    ),
    generateEdge(
      `edge-true-${trueId}`,
      `true-${currentId}`,
      trueId
    ),
    generateEdge(
      `edge-false-${falseId}`,
      `false-${currentId}`,
      falseId
    ),
  ];

  const trueMappingField = generateMapping(source.TrueField, xWeight+1, yWeight+addWeightField1+addWeightField2);
  const falseMappingField = generateMapping(source.FalseField, xWeight+1, yWeight+addWeight+addWeightField1+addWeightField2);

  let fields = [
    generateEntity(
      conditionId,
      '',
      'Fields',
      null,
      xWeight,
      yWeight
    ),
    generateNode(
      `field1-${conditionId}`,
      'Field 1',
      conditionId,
      'condition1',
      field1.MappingFieldType,
      getDataDetails(field1),
      xWeight+1,
      yWeight
    ),
    generateNode(
      `field2-${conditionId}`,
      'Field 2',
      conditionId,
      'condition2',
      field2.MappingFieldType,
      getDataDetails(field2),
      xWeight+1,
      yWeight+addWeightField1
    ),
    generateEdge(
      `edge-fields-${currentId}`,
      `condition-${currentId}`,
      conditionId
    ),
  ];

  if (field1) {
    const field1MappingField = generateMapping(field1, xWeight+2, yWeight);
    fields = _.concat(fields, field1MappingField);
    fields.push(generateEdge(
      `edge-field1-${conditionId}`,
      `field1-${conditionId}`,
      field1.MappingFieldId
    ));
  }
  if (field2) {
    const field2MappingField = generateMapping(field2, xWeight+2, yWeight+addWeightField1);
    fields = _.concat(fields, field2MappingField);
    fields.push(generateEdge(
      `edge-field2-${conditionId}`,
      `field2-${conditionId}`,
      field2.MappingFieldId
    ));
  }
  return _.concat(elements, fields, trueMappingField, falseMappingField);
};

const generateCombinationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  let elements = [
    generateEntity(
      currentId,
      'Combination',
      'Combination',
      null,
      xWeight,
      yWeight
    )
  ];

  if (source.Field1) {
    const field1 = source.Field1;
    const field2 = source.Field2;
    const addWeight = getChildrenWeight(field1);
  
    const fields = [
      generateNode(
        `field1-${currentId}`,
        'Field 1',
        currentId,
        'combination1',
        field1.MappingFieldType,
        getDataDetails(field1),
        xWeight,
        yWeight
      ),
      generateNode(
        `field2-${currentId}`,
        'Field 2',
        currentId,
        'combination2',
        field2.MappingFieldType,
        getDataDetails(field2),
        xWeight,
        yWeight+addWeight
      ),
      generateEdge(
        `edge-field1-${currentId}`,
        `field1-${currentId}`,
        field1.MappingFieldId
      ),
      generateEdge(
        `edge-field2-${currentId}`,
        `field2-${currentId}`,
        field2.MappingFieldId
      ),
    ];

    const field1MappingField = generateMapping(field1, xWeight+1, yWeight);
    const field2MappingField = generateMapping(field2, xWeight+1, yWeight+addWeight);

    elements = _.concat(elements, fields, field1MappingField, field2MappingField);
  }

  return elements;
};

const generateRegexMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(
      currentId,
      'Regex',
      'Regex',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-${currentId}`,
      `Pattern: "${source.RegexPattern}", Flags: "${source.RegexFlags}" Group: ${source.RegexGroup}`,
      currentId,
      'regex-info',
      source.MappingFieldType,getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `source-${currentId}`,
      'Source:',
      currentId,
      'regex-source',
      source.Source.MappingFieldType,
      null,
      xWeight,
      yWeight+1
    ),
    generateEdge(
      `edge-source-${currentId}`,
      `source-${currentId}`,
      source.Source.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(source.Source, xWeight+1, yWeight+1);

  return _.concat(elements, sourceMappingField);
};

const generateIterationMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(
      currentId,
      'Iteration',
      'Iteration',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-${currentId}`,
      `Delimiter: "${source.Iterator.Delimiter}", Index: "${source.Iterator.Index}"`,
      currentId,
      'iteration-info',
      source.MappingFieldType,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `source-${source.Iterator.IteratorId}`,
      'Source:',
      currentId,
      'iteration-source',
      source.Iterator.Source.MappingFieldType,
      null,
      xWeight,
      yWeight+1
    ),
    generateEdge(
      `edge-source-${currentId}`,
      `source-${source.Iterator.IteratorId}`,
      source.Iterator.Source.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(source.Iterator.Source, xWeight+1, yWeight+1);

  return _.concat(elements, sourceMappingField);
};

const generateJsonPropertyMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.Source, xWeight+1, yWeight+1);
  const currentId = source.MappingFieldId;
  const sourceId = source.Source.MappingFieldId;
  const sourceType = source.Source.MappingFieldType;

  const elements = [
    generateEntity(
      currentId,
      `Json Property:`,
      'JsonProperty',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-${currentId}`,
      `Property Path: ${source.PropertyPath}, Default: ${source.Default}`,
      currentId,
      'jsonproperty-info',
      source.MappingFieldType,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `source-${currentId}`,
      'Source',
      currentId,
      'jsonproperty-source',
      sourceType,
      null,
      xWeight,
      yWeight+1
    ),
    generateEdge(
      `edge-source-${sourceId}`,
      `source-${currentId}`,
      sourceId
    ),
  ];
  return _.concat(elements, nextMappingField);
};

const generateJsonElementMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.Source, xWeight+1, yWeight+getChildrenWeight(source.Element));
  const currentId = source.MappingFieldId;
  const sourceId = source.Source.MappingFieldId;
  const sourceType = source.Source.MappingFieldType;

  const elements = [
    generateEntity(
      currentId,
      `Json Element:`,
      'JsonElement',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-element-${currentId}`,
      'Element Info',
      currentId,
      'elementobj-info',
      source.MappingFieldType,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `source-element-${currentId}`,
      'Source',
      currentId,
      'jsonelement-source',
      sourceType,
      null,
      xWeight,
      yWeight+getChildrenWeight(source.Element)
    ),
    generateEdge(
      `edge-source-${sourceId}`,
      `source-element-${currentId}`,
      sourceId
    ),
    generateEntity(
      `elementobj-entity-${currentId}`,
      'Element Object',
      'ElementObject',
      getDataDetails(source),
      xWeight+1,
      yWeight
    ),
    generateEdge(
      `edge-elementobj-${currentId}`,
      `info-element-${currentId}`,
      `elementobj-entity-${currentId}`
    ),
    generateNode(
      `elementobj-info-${currentId}`,
      `Path: "${source.Element.Path}", Limit: ${source.Element.Limit}`,
      `elementobj-entity-${currentId}`,
      'jsonelement-info',
      'JsonElementObject',
      getDataDetails(source),
      xWeight+1,
      yWeight
    ),
    generateNode(
      `elementobj-operations-${currentId}`,
      'Operations:',
      `elementobj-entity-${currentId}`,
      'jsonelement-operations',
      'JsonElementObject',
      null,
      xWeight+1,
      yWeight+1
    ),
    generateEntity(
      `elementoperations-entity-${currentId}`,
      'Operations',
      'Operations',
      getDataDetails(source),
      xWeight+2,
      yWeight+1
    ),
    generateEdge(
      `edge-elementoperations-${currentId}`,
      `elementobj-operations-${currentId}`,
      `elementoperations-entity-${currentId}`
    ),
  ];

  _.map(source.Element.Operations, (operationItem, index) => {
    const valueId = Math.random()*1000;

    const newOperation = generateNode(
      `wrap-${valueId}`,
      `Name: ${operationItem.name}, Field: ${operationItem.field}, Value: ${operationItem.value},`,
      `elementoperations-entity-${currentId}`,
      'jsonelement-operations',
      null,
      null,
      xWeight+2,
      yWeight+1+index
    );
    elements.push(newOperation);
  });

  return _.concat(elements, nextMappingField);
};

const generateAggregateMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity(
      currentId,
      'Aggregate',
      'Aggregate',
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `info-${currentId}`,
      `Delimiter: "${source.Delimiter}"`,
      currentId,
      'aggregate-info',
      source.MappingFieldType,
      getDataDetails(source),
      xWeight,
      yWeight
    ),
    generateNode(
      `iterator-${currentId}`,
      'Iterator:',
      currentId,
      'iterator-entity',
      'iterator-entity',
      null,
      xWeight,
      yWeight+1
    ),
    generateEdge(
      `edge-iterator-${currentId}`,
      `iterator-${currentId}`,
      `iterator-entity-${currentId}`
    ),
    generateEntity(
      `iterator-entity-${currentId}`,
      'Iterator',
      'Aggregate',
      getDataDetails(source.Iterator.Source),
      xWeight+1,
      yWeight+1
    ),
    generateNode(
      `iterator-info-${currentId}`,
      `Delimiter: "${source.Iterator.Delimiter}"`,
      `iterator-entity-${currentId}`,
      'aggregate-iterator-info',
      'AggregateIterator',
      getDataDetails(source),
      xWeight+1,
      yWeight+1
    ),
    generateNode(
      `iterator-source-${currentId}`,
      'Source:',
      `iterator-entity-${currentId}`,
      'aggregate-iterator-source',
      source.Iterator.Source.MappingFieldType,
      null,
      xWeight+1,
      yWeight+2
    ),
    generateEdge(
      `edge-source-${currentId}`,
      `iterator-source-${currentId}`,
      source.Iterator.Source.MappingFieldId
    ),
    generateNode(
      `iterations-${currentId}`,
      'Iterations:',
      currentId,
      'aggregate-iterations',
      source.Iterations.MappingFieldType,
      null,
      xWeight,
      yWeight+getChildrenWeight(source.Iterator.Source)+2
    ),
    generateEdge(
      `edge-iterations-${currentId}`,
      `iterations-${currentId}`,
      source.Iterations.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(source.Iterator.Source, xWeight+2, yWeight+2);
  const iterationsMappingField = generateMapping(source.Iterations, xWeight+1, yWeight+getChildrenWeight(source.Iterator.Source)+2);
  return _.concat(elements, sourceMappingField, iterationsMappingField);
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
    case 'function-info':
      return {
        id: 'MappingFieldId',
        name: 'FunctionName',
      };
    case 'iteration-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'iteration-info':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'regex-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'regex-info':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'jsonproperty-info':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'jsonproperty-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'jsonelement-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'jsonelement-info':
      return {
        id: 'MappingFieldId',
        name: 'Element',
      };
    case 'aggregate-info':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'aggregate-iterator-info':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'elementobj-info':
      return {
        id: 'MappingFieldId',
        name: 'Element',
      };
    case 'aggregate-iterator-source':
      return {
        id: 'MappingFieldId',
        name: 'Source',
      };
    case 'aggregate-iterations':
      return {
        id: 'MappingFieldId',
        name: 'Iterations',
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
        id: 'MappingFieldId',
        name: 'ConstantValue',
      };
    case 'Column':
      return {
        id: 'MappingFieldId',
        name: 'ColumnIdentifier',
      };
    case 'HL7':
      return {
        id: 'MappingFieldId',
        name: 'HL7Segment',
      };
    case 'Function':
      return {
        id: 'MappingFieldId',
        name: 'FunctionName',
      };
    case 'Regex':
      return {
        name: 'RegexPattern', 
        name1: 'RegexFlags',
        name2: 'RegexGroup',
      }
    case 'Iteration':
      return {
        name: 'Delimiter',
        name1: 'Index',
      }
    case 'JsonProperty':
      return {
        name: 'PropertyPath',
        name1: 'Default',
      }
    case 'JsonElement':
        return {
          name: 'Path',
          name1: 'Limit',
        }
    case 'Aggregate':
      return {
        name: 'Delimiter',
      }
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
    case 'JsonProperty':
      return {
        primary: nextField.PropertyPath,
        secondary: nextField.Default,
        tertiary: '',
        fourth: '',
      };
    case 'JsonElement':
        return {
          primary: nextField.Element.Path,
          secondary: nextField.Element.Limit,
          tertiary: '',
          fourth: '',
        };
    case 'Aggregate':
      return {
        primary: nextField.Delimiter,
        secondary: nextField.Iterator.Delimiter,
        tertiary: '',
        fourth: '',
      };
    default:
      return null;
  }
}

const getChildrenWeight = (field) => {
  if (field) {
    switch (field.MappingFieldType) {
      case 'Combination':
        return getChildrenWeight(field.Field1) + getChildrenWeight(field.Field2);
      case 'Conditional':
        return getChildrenWeight(field.Condition.Field1) + getChildrenWeight(field.Condition.Field2)  + getChildrenWeight(field.TrueField) + getChildrenWeight(field.FalseField);
      case 'Switch':
        let total = getChildrenWeight(field.SwitchValue) + getChildrenWeight(field.SwitchDefault);
        let caseSum = 1;
        field.Cases.forEach(c => {
          caseSum += getChildrenWeight(c.Value);
        });
        total = total + (caseSum === 1 ? 1 : caseSum - 1);
        return total;
      case 'Regex': return getChildrenWeight(field.Source)+1;
      case 'Iteration': return getChildrenWeight(field.Iterator.Source)+1;
      case 'Function': return getChildrenWeight(field.FunctionParameter)+1;
      case 'JsonProperty': return getChildrenWeight(field.Source)+1;
      case 'JsonElementObject':
        let elementTotal = 1;
        const opSum = field.Operations.length;
        elementTotal = elementTotal + (opSum < 2 ? 1 : opSum);
        return elementTotal;
      case 'JsonElement':
        return getChildrenWeight(field.Element) + getChildrenWeight(field.Source);
      case 'Aggregate': return getChildrenWeight(field.Iterator.Source)+getChildrenWeight(field.Iterations)+2;
      default:
        return 1;
    }
  }
  return 1;
}

const checkCategoryEditable = (node) => {
  if ((node.edges && node.edges.length === 0) || node.parent) {
    if (
      node.data.parentType === 'conditional-entity' ||
      node.data.parentType === 'switch-entity' ||
      node.data.parentType === 'regex-info' ||
      node.data.parentType === 'function-info' ||
      node.data.parentType === 'iteration-info' ||
      node.data.parentType === 'jsonproperty-info' ||
      node.data.parentType === 'aggregate-info' ||
      node.data.parentType === 'aggregate-iterator-info' ||
      node.data.parentType === 'jsonelement-info' ||
      node.data.parentType === 'jsonelement-operations'
    )
      return false;
    return true;
  }
  return false;
}

const checkNodeEditable = node => (
    node.data.parentType === 'Constant' ||
    node.data.parentType === 'Column' ||
    node.data.parentType === 'HL7' ||
    node.data.parentType === 'regex-info' ||
    node.data.parentType === 'function-info' ||
    node.data.parentType === 'iteration-info' ||
    node.data.parentType === 'jsonproperty-info' ||
    node.data.parentType === 'aggregate-info' ||
    node.data.parentType === 'aggregate-iterator-info' ||
    node.data.parentType === 'jsonelement-info'
  ) ? true : false;

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