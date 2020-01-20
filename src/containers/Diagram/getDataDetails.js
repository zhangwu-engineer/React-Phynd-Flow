export const getDataDetails = (nextField) => {
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
};