export const isDetailsEntityRemovable = (parent) => {
  const primaryModels = ['Constant', 'Column', 'HL7'];
  if (parent) {
    if (parent && parent.edges.length === 0 && primaryModels.indexOf(parent.data.parentType) > -1) return true;
  }
  return false;
}

export const getPrimaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Function': return 'Function Name';
    case 'Iteration': return 'Delimiter';
    case 'Regex': return 'Pattern';
    case 'Constant': return 'Constant Value';
    case 'Column': return 'Column Name';
    case 'HL7': return 'HL7 Value';
    case 'JsonProperty': return 'Property Path';
    case 'JsonElementObject': return 'Path';
    case 'Aggregate': return 'Delimiter';
    default: return null;
  }
}

export const getSecondaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Iteration': return 'Index';
    case 'Regex': return 'Flags';
    case 'JsonProperty': return 'Default';
    case 'JsonElementObject': return 'Limit';
    case 'AggregateIterator': return 'Iterator Delimiter';
    default: return null;
  }
}

export const getTertiaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Regex': return 'Group Number';
    default: return null;
  }
}

export const getFourthFieldLabel = (activeParent) => {
  if (activeParent && activeParent.data.parentType === 'cases-entity') {
    return 'Key Name';
  }
  return null;
}