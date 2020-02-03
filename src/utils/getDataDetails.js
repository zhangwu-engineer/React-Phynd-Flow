export const getDataDetails = (nextField) => {
  switch (nextField.MappingFieldType) {
    case 'Constant':
      return {
        primary: nextField.ConstantValue,
        secondary: '',
        tertiary: '',
      };
    case 'Column':
      return {
        primary: nextField.ColumnIdentifier,
        secondary: '',
        tertiary: '',
      };
    case 'HL7':
      return {
        primary: nextField.HL7Segment,
        secondary: '',
        tertiary: '',
      };
    case 'Function':
      return {
        primary: nextField.FunctionName,
        secondary: '',
        tertiary: '',
      };
    case 'Regex':
      return {
        primary: nextField.RegexPattern,
        secondary: nextField.RegexFlags,
        tertiary: nextField.RegexGroup,
      };
    case 'Iteration':
      return {
        primary: nextField.Iterator.Delimiter,
        secondary: nextField.Iterator.Index,
        tertiary: '',
      };
    case 'JsonProperty':
      return {
        primary: nextField.PropertyPath,
        secondary: nextField.Default,
        tertiary: '',
      };
    case 'JsonElement':
        return {
          primary: nextField.Element.Path,
          secondary: nextField.Element.Limit,
          tertiary: '',
        };
    case 'Aggregate':
      return {
        primary: nextField.Delimiter,
        secondary: nextField.Iterator.Delimiter,
        tertiary: '',
      };
    default:
      return null;
  }
};