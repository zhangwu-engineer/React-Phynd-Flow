export const generateInitialSource = (type, parent, inputValue) => {
    switch (type) {
      case 'Function':
        return {
          MappingFieldId: `function-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          FunctionName: inputValue.primary,
          FunctionParameter: {
            MappingFieldType: null,
          },
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
            MappingFieldId: null,
            MappingFieldType: null,
          },
          SwitchValue: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          Cases: [],
        };
      case 'Conditional':
        return {
          MappingFieldId: `conditional-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          TrueField: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          FalseField: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          Condition: {
            ConditionId: `condition-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
            Field1: {
              MappingFieldId: null,
              MappingFieldType: null,
            },
            Field2: {
              MappingFieldId: null,
              MappingFieldType: null,
            },
          }
        };
      case 'Combination':
        return {
          MappingFieldId: `combination-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          Field1: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          Field2: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
        };
      case 'Regex':
        return {
          MappingFieldId: `regex-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          RegexPattern: inputValue.primary,
          RegexFlags: inputValue.secondary,
          RegexGroup: inputValue.tertiary,
          Source: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
        };
      case 'Iteration':
        return {
          MappingFieldId: `iteration-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          Iterator: {
            IteratorId: `iterator-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
            Source: {
              MappingFieldId: null,
              MappingFieldType: null,
            },
            Delimiter: inputValue.primary,
            Index: inputValue.secondary,
          },
        };
      case 'JsonProperty':
        return {
          MappingFieldId: `jsonproperty-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          PropertyPath: inputValue.primary,
          Default: inputValue.secondary,
          Source: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          Element: {
          }
        };
      case 'JsonElement':
        return {
          MappingFieldId: `jsonelement-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          Source: {
            MappingFieldId: null,
            MappingFieldType: null,
          },
          Element: {
            MappingFieldId: null,
            MappingFieldType: 'JsonElementObject',
            Path: inputValue.primary,
            Limit: inputValue.secondary,
            Operations: [],
          },
        };
      case 'Aggregate':
        return {
          MappingFieldId: `aggregate-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
          MappingFieldType: type,
          Delimiter: inputValue.primary,
          Iterator: {
            IteratorId: `aggregate-iterator-${parent ? parent.data.id : ''}-${Math.random()*10000}`,
            Source: {
              MappingFieldId: null,
              MappingFieldType: null,
            },
            Delimiter: inputValue.secondary,
          },
          Iterations: {
            MappingFieldId: null,
            MappingFieldType: null,
          }
        };
      default:
        return {};
    }
  };