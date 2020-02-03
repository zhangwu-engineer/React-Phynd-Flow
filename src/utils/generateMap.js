import _ from 'lodash';
import { getChildrenWeight } from './getChildrenWeight';
import { getDataDetails } from './getDataDetails';
import { generateNode, generateEntity, generateEdge } from './generateElement';

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
  const nextMappingField = generateMapping(
    source.FunctionParameter,
    xWeight+1,
    yWeight+1
  );
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
  const sourceMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+1
  );

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
  const sourceMappingField = generateMapping(
    source.Iterator.Source,
    xWeight+1,
    yWeight+1
  );

  return _.concat(elements, sourceMappingField);
};

const generateJsonPropertyMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+1
  );
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
  const nextMappingField = generateMapping(
    source.Source,
    xWeight+1,
    yWeight+getChildrenWeight(source.Element)
  );
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