export const getPropertyToMap = (type) => {
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
      };
    case 'Iteration':
      return {
        name: 'Delimiter',
        name1: 'Index',
      };
    case 'JsonProperty':
      return {
        name: 'PropertyPath',
        name1: 'Default',
      };
    case 'JsonElement':
      return {
        name: 'Path',
        name1: 'Limit',
      };
    case 'Aggregate':
      return {
        name: 'Delimiter',
      };
    default:
      return {
        id: 'MappingFieldId',
        name: 'Value',
      };
  }
};