export const getEntityColor = (type) => {
  switch (type) {
    case 'Function': return '#a6a6a6';
    case 'Column': return '#99ccff';
    case 'Constant': return '#ffffff';
    case 'HL7': return '#ff9999';
    case 'Switch': return '#ff9966';
    case 'Conditional': return '#ffcc99';
    case 'Combination': return '#ccffcc';
    case 'Regex': return '#ffff99';
    case 'Iteration': return '#ffccff';
    case 'JsonProperty': return '#ccffff';
    case 'JsonElement': return '#3399ff';
    case 'Aggregate': return '#9966ff';
    default:
      return '#ffffff';
  }
};