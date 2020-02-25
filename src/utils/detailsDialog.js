export const isDetailsEntityRemovable = (parent) => {
  const primaryModels = ['Constant', 'Column', 'HL7'];
  if (parent) {
    if (parent && parent.edges && parent.edges.length === 0 && primaryModels.indexOf(parent.data.parentType) > -1) return true;
  }
  return false;
}

export const getPrimaryFieldLabel = (cardType) => {
  const primaryMapping = {
    'Function': 'Function Name',
    'Iteration': 'Delimiter',
    'Regex': 'Pattern',
    'Constant': 'Constant Value',
    'Column': 'Column Value',
    'HL7': 'HL7 Value',
    'JsonProperty': 'Property Path',
    'JsonElementObject': 'Path',
    'Aggregate': 'Delimiter',
  }
  if (primaryMapping[cardType]) {
    return primaryMapping[cardType];
  }
  return null;
}

export const getSecondaryFieldLabel = (cardType) => {
  const secondaryMapping = {
    'Iteration': 'Index',
    'Regex': 'Flags',
    'JsonProperty': 'Default',
    'JsonElementObject': 'Limit',
    'AggregateIterator': 'Iterator Delimiter',

  }
  if (secondaryMapping[cardType]) {
    return secondaryMapping[cardType];
  }
  return null;
}

export const getTertiaryFieldLabel = (cardType) => {
  if (cardType === 'Regex') {
    return 'Group Number';
  }
  return null;
}

export const getFourthFieldLabel = (activeParent) => {
  if (activeParent && activeParent.data && activeParent.data.parentType === 'cases-entity') {
    return 'Key Name';
  }
  return null;
}