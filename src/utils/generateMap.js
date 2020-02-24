import _ from 'lodash';
import { getChildrenWeight } from './getChildrenWeight';
import { getDataDetails } from './getDataDetails';
import { generateNode, generateEntity, generateEdge } from './generateElement';
import { getEntityColor } from './getEntityColor';

export const generateMapping = (source, xWeight, yWeight) => {
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

const generateSingleMapping = (source, identifier, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  return [
    generateNode({
      id: source.MappingFieldId,
      label: `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`,
      parent: null,
      parentType: source.MappingFieldType,
      nextType: null,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
  ];
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const nextMappingField = generateMapping(
    source.FunctionParameter,
    xWeight+1,
    yWeight+1
  );
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;
  const functionType = source.FunctionParameter.MappingFieldType;

  const elements = [
    generateEntity({
      id: currentId,
      label: `Function:`,
      parentType: 'Function',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-${currentId}`,
      label: `Name: ${source.FunctionName}`,
      parent: currentId,
      parentType: 'function-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `source-${currentId}`,
      label: 'SourceParameter',
      parent: currentId,
      parentType: 'function-source',
      nextType: functionType,
      dataDetails: null,
      xWeight, 
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-source-${functionId}`,
      `source-${currentId}`,
      functionId
    ),
  ];
  return _.concat(elements, nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;
  const switchType = source.SwitchValue.MappingFieldType;
  const defaultType = source.SwitchDefault.MappingFieldType;
  const addWeight1 = source.SwitchValue && getChildrenWeight(source.SwitchValue);
  const addWeight2 = source.SwitchValue && getChildrenWeight(source.SwitchDefault);
  const addWeight = addWeight1 + addWeight2;

  let elements = [
    generateEntity({
      id: currentId,
      label: 'Switch:',
      parentType: 'Switch',
      dataDetails: null,
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `value-${currentId}`,
      label: 'SwitchValue',
      parent: currentId,
      parentType: 'switch-value',
      nextType: switchType,
      dataDetails: getDataDetails(source.SwitchValue),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `default-${currentId}`,
      label: 'DefaultValue',
      parent: currentId,
      parentType: 'switch-default',
      nextType: defaultType,
      dataDetails: getDataDetails(source.SwitchDefault),
      xWeight,
      yWeight: yWeight+addWeight1
    }),
    generateNode({
      id: `case-source-${currentId}`,
      label: 'Cases:',
      parent: currentId,
      parentType: 'switch-entity',
      nextType: 'switch-entity',
      dataDetails: null,
      xWeight,
      yWeight: yWeight+addWeight
    }),
    generateEntity({
      id: `case-target-${currentId}`,
      label: 'Cases',
      parentType: 'Cases',
      dataDetails: null,
      xWeight: xWeight+1,
      yWeight: yWeight+addWeight
    }),
    generateEdge(
      `edge-case-${currentId}`,
      `case-source-${currentId}`,
      `case-target-${currentId}`
    ),
  ];

  if (switchId) {
    const switchValue = generateMapping(
      source.SwitchValue,
      xWeight+1,
      yWeight
    );
    elements.push(generateEdge(
      `edge-value-${switchId}`,
      `value-${currentId}`,
      switchId
    ));
    elements = _.concat(elements, switchValue);
  }
  if (defaultId) {
    const switchDefault = generateMapping(
      source.SwitchDefault,
      xWeight+1,
      yWeight+addWeight1
    );
    elements.push(generateEdge(
      `edge-default-${defaultId}`,
      `default-${currentId}`,
      defaultId
    ));
    elements = _.concat(elements, switchDefault);
  }

  let addCasesWeight = addWeight;
  _.map(source.Cases, (caseItem, index) => {
    const nextMappingField = generateMapping(
      caseItem.Value,
      xWeight+2,
      yWeight+index+addCasesWeight
    );
    const valueId = caseItem.Value.MappingFieldId;
    const valueType = caseItem.Value.MappingFieldType;
    let caseKeyDetails = getDataDetails(caseItem.Value);
    const alternativeId = `case-value-${Math.random()*10000}`;
    if (!caseKeyDetails) {
      caseKeyDetails = index;
    }

    const wrapper = [
      generateNode({
        id: `wrap-${valueId ? valueId : alternativeId}`,
        label: `${caseItem.Key}`,
        parent: `case-target-${currentId}`,
        parentType: 'cases-entity',
        nextType: valueType,
        dataDetails: caseKeyDetails,
        xWeight: xWeight+1,
        yWeight: yWeight+index+addCasesWeight
      })
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
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
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
    generateEntity({
      id: currentId,
      label: 'Conditional:',
      parentType: 'Conditional',
      dataDetails: null,
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `condition-${currentId}`,
      label: 'Condition:',
      parent: currentId,
      parentType: 'conditional-entity',
      nextType: 'conditional-entity',
      dataDetails: null,
      xWeight,
      yWeight
    }),
    generateNode({
      id: `true-${currentId}`,
      label: 'If True:',
      parent: currentId,
      parentType: 'conditional-true',
      nextType: source.TrueField.MappingFieldType,
      dataDetails: getDataDetails(source.TrueField),
      xWeight,
      yWeight: yWeight+addWeightField1+addWeightField2
    }),
    generateNode({
      id: `false-${currentId}`,
      label: 'If False:',
      parent: currentId,
      parentType: 'conditional-false',
      nextType: source.FalseField.MappingFieldType,
      dataDetails: getDataDetails(source.FalseField),
      xWeight,
      yWeight: yWeight+addWeight+addWeightField1+addWeightField2
    }),
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

  const trueMappingField = generateMapping(
    source.TrueField,
    xWeight+1,
    yWeight+addWeightField1+addWeightField2
  );
  const falseMappingField = generateMapping(
    source.FalseField,
    xWeight+1,
    yWeight+addWeight+addWeightField1+addWeightField2
  );

  let fields = [
    generateEntity({
      id: conditionId,
      label: '',
      parentType: 'Fields',
      dataDetails: null,
      xWeight,
      yWeight
    }),
    generateNode({
      id: `field1-${conditionId}`,
      label: 'Field 1',
      parent: conditionId,
      parentType: 'condition1',
      nextType: field1.MappingFieldType,
      dataDetails: getDataDetails(field1),
      xWeight: xWeight+1,
      yWeight
    }),
    generateNode({
      id: `field2-${conditionId}`,
      label: 'Field 2',
      parent: conditionId,
      parentType: 'condition2',
      nextType: field2.MappingFieldType,
      dataDetails: getDataDetails(field2),
      xWeight: xWeight+1,
      yWeight: yWeight+addWeightField1
    }),
    generateEdge(
      `edge-fields-${currentId}`,
      `condition-${currentId}`,
      conditionId
    ),
  ];

  if (field1) {
    const field1MappingField = generateMapping(
      field1,
      xWeight+2,
      yWeight
    );
    fields = _.concat(fields, field1MappingField);
    fields.push(generateEdge(
      `edge-field1-${conditionId}`,
      `field1-${conditionId}`,
      field1.MappingFieldId
    ));
  }
  if (field2) {
    const field2MappingField = generateMapping(
      field2,
      xWeight+2,
      yWeight+addWeightField1
    );
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
    generateEntity({
      id: currentId,
      label: 'Combination',
      parentType: 'Combination',
      dataDetails: null,
      xWeight,
      yWeight
    })
  ];

  if (source.Field1) {
    const field1 = source.Field1;
    const field2 = source.Field2;
    const addWeight = getChildrenWeight(field1);
  
    const fields = [
      generateNode({
        id: `field1-${currentId}`,
        label: 'Field 1',
        parent: currentId,
        parentType: 'combination1',
        nextType: field1.MappingFieldType,
        dataDetails: getDataDetails(field1),
        xWeight,
        yWeight
      }),
      generateNode({
        id: `field2-${currentId}`,
        label: 'Field 2',
        parent: currentId,
        parentType: 'combination2',
        nextType: field2.MappingFieldType,
        dataDetails: getDataDetails(field2),
        xWeight,
        yWeight: yWeight+addWeight
      }),
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

    const field1MappingField = generateMapping(
      field1,
      xWeight+1,
      yWeight
    );
    const field2MappingField = generateMapping(
      field2,
      xWeight+1,
      yWeight+addWeight
    );

    elements = _.concat(elements, fields, field1MappingField, field2MappingField);
  }

  return elements;
};

const generateRegexMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity({
      id: currentId,
      label: 'Regex',
      parentType: 'Regex',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-${currentId}`,
      label: `Pattern: "${source.RegexPattern}", Flags: "${source.RegexFlags}" Group: ${source.RegexGroup}`,
      parent: currentId,
      parentType: 'regex-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `source-${currentId}`,
      label: 'Source:',
      parent: currentId,
      parentType: 'regex-source',
      nextType: source.Source.MappingFieldType,
      dataDetails: null,
      xWeight,
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-source-${currentId}`,
      `source-${currentId}`,
      source.Source.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+1
  );

  return _.concat(elements, sourceMappingField);
};

const generateIterationMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity({
      id: currentId,
      label: 'Iteration',
      parentType: 'Iteration',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-${currentId}`,
      label: `Delimiter: "${source.Iterator.Delimiter}", Index: "${source.Iterator.Index}"`,
      parent: currentId,
      parentType: 'iteration-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `source-${source.Iterator.IteratorId}`,
      label: 'Source:',
      parent: currentId,
      parentType: 'iteration-source',
      nextType: source.Iterator.Source.MappingFieldType,
      dataDetails: null,
      xWeight,
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-source-${currentId}`,
      `source-${source.Iterator.IteratorId}`,
      source.Iterator.Source.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(
    source.Iterator.Source,
    xWeight+1,
    yWeight+1
  );

  return _.concat(elements, sourceMappingField);
};

const generateJsonPropertyMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const nextMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+1
  );
  const currentId = source.MappingFieldId;
  const sourceId = source.Source.MappingFieldId;
  const sourceType = source.Source.MappingFieldType;

  const elements = [
    generateEntity({
      id: currentId,
      label: `Json Property:`,
      parentType: 'JsonProperty',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-${currentId}`,
      label: `Property Path: ${source.PropertyPath}, Default: ${source.Default}`,
      parent: currentId,
      parentType: 'jsonproperty-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `source-${currentId}`,
      label: 'Source',
      parent: currentId,
      parentType: 'jsonproperty-source',
      nextType: sourceType,
      dataDetails: null,
      xWeight,
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-source-${sourceId}`,
      `source-${currentId}`,
      sourceId
    ),
  ];
  return _.concat(elements, nextMappingField);
};

const generateJsonElementMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const nextMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+getChildrenWeight(source.Element)
  );
  const currentId = source.MappingFieldId;
  const sourceId = source.Source.MappingFieldId;
  const sourceType = source.Source.MappingFieldType;

  const elements = [
    generateEntity({
      id: currentId,
      label: `Json Element:`,
      parentType: 'JsonElement',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-element-${currentId}`,
      label: 'Element Info',
      parent: currentId,
      parentType: 'elementobj-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `source-element-${currentId}`,
      label: 'Source',
      parent: currentId,
      parentType: 'jsonelement-source',
      nextType: sourceType,
      dataDetails: null,
      xWeight,
      yWeight: yWeight+getChildrenWeight(source.Element)
    }),
    generateEdge(
      `edge-source-${sourceId}`,
      `source-element-${currentId}`,
      sourceId
    ),
    generateEntity({
      id: `elementobj-entity-${currentId}`,
      label: 'Element Object',
      parentType: 'ElementObject',
      dataDetails: getDataDetails(source),
      xWeight: xWeight+1,
      yWeight
    }),
    generateEdge(
      `edge-elementobj-${currentId}`,
      `info-element-${currentId}`,
      `elementobj-entity-${currentId}`
    ),
    generateNode({
      id: `elementobj-info-${currentId}`,
      label: `Path: "${source.Element.Path}", Limit: ${source.Element.Limit}`,
      parent: `elementobj-entity-${currentId}`,
      parentType: 'jsonelement-info',
      nextType: 'JsonElementObject',
      dataDetails: getDataDetails(source),
      xWeight: xWeight+1,
      yWeight
    }),
    generateNode({
      id: `elementobj-operations-${currentId}`,
      label: 'Operations:',
      parent: `elementobj-entity-${currentId}`,
      parentType: 'jsonelement-operations',
      nextType: 'JsonElementObject',
      dataDetails: null,
      xWeight: xWeight+1,
      yWeight: yWeight+1
    }),
    generateEntity({
      id: `elementoperations-entity-${currentId}`,
      label: 'Operations',
      parentType: 'Operations',
      dataDetails: getDataDetails(source),
      xWeight: xWeight+2,
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-elementoperations-${currentId}`,
      `elementobj-operations-${currentId}`,
      `elementoperations-entity-${currentId}`
    ),
  ];

  _.map(source.Element.Operations, (operationItem, index) => {
    const valueId = Math.random()*1000;

    const newOperation = generateNode({
      id: `wrap-${valueId}`,
      label: `Name: ${operationItem.name}, Field: ${operationItem.field}, Value: ${operationItem.value},`,
      parent: `elementoperations-entity-${currentId}`,
      parentType: 'jsonelement-operations',
      nextType: null,
      dataDetails: null,
      xWeight: xWeight+2,
      yWeight: yWeight+1+index
    });
    elements.push(newOperation);
  });

  return _.concat(elements, nextMappingField);
};

const generateAggregateMapping = (source, xWeight, yWeight) => {
  const entityColor = source.MappingFieldType && getEntityColor(source.MappingFieldType);
  const currentId = source.MappingFieldId;

  const elements = [
    generateEntity({
      id: currentId,
      label: 'Aggregate',
      parentType: 'Aggregate',
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight,
      entityColor
    }),
    generateNode({
      id: `info-${currentId}`,
      label: `Delimiter: "${source.Delimiter}"`,
      parent: currentId,
      parentType: 'aggregate-info',
      nextType: source.MappingFieldType,
      dataDetails: getDataDetails(source),
      xWeight,
      yWeight
    }),
    generateNode({
      id: `iterator-${currentId}`,
      label: 'Iterator:',
      parent: currentId,
      parentType: 'iterator-entity',
      nextType: 'iterator-entity',
      dataDetails: null,
      xWeight,
      yWeight: yWeight+1
    }),
    generateEdge(
      `edge-iterator-${currentId}`,
      `iterator-${currentId}`,
      `iterator-entity-${currentId}`
    ),
    generateEntity({
      id: `iterator-entity-${currentId}`,
      label: 'Iterator',
      parentType: 'Aggregate',
      dataDetails: getDataDetails(source.Iterator.Source),
      xWeight: xWeight+1,
      yWeight: yWeight+1
    }),
    generateNode({
      id: `iterator-info-${currentId}`,
      label: `Delimiter: "${source.Iterator.Delimiter}"`,
      parent: `iterator-entity-${currentId}`,
      parentType: 'aggregate-iterator-info',
      nextType: 'AggregateIterator',
      dataDetails: getDataDetails(source),
      xWeight: xWeight+1,
      yWeight: yWeight+1
    }),
    generateNode({
      id: `iterator-source-${currentId}`,
      label: 'Source:',
      parent: `iterator-entity-${currentId}`,
      parentType: 'aggregate-iterator-source',
      nextType: source.Iterator.Source.MappingFieldType,
      dataDetails: null,
      xWeight: xWeight+1,
      yWeight: yWeight+2
    }),
    generateEdge(
      `edge-source-${currentId}`,
      `iterator-source-${currentId}`,
      source.Iterator.Source.MappingFieldId
    ),
    generateNode({
      id: `iterations-${currentId}`,
      label: 'Iterations:',
      parent: currentId,
      parentType: 'aggregate-iterations',
      nextType: source.Iterations.MappingFieldType,
      dataDetails: null,
      xWeight,
      yWeight: yWeight+getChildrenWeight(source.Iterator.Source)+2
    }),
    generateEdge(
      `edge-iterations-${currentId}`,
      `iterations-${currentId}`,
      source.Iterations.MappingFieldId
    ),
  ];
  const sourceMappingField = generateMapping(
    source.Iterator.Source,
    xWeight+2,
    yWeight+2
  );
  const iterationsMappingField = generateMapping(
    source.Iterations,
    xWeight+1,
    yWeight+getChildrenWeight(source.Iterator.Source)+2
  );
  return _.concat(elements, sourceMappingField, iterationsMappingField);
};