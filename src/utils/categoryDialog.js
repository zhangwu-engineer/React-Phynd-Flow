export const isRemovable = (parent) => {
  const primaryModels = ['Constant', 'Column', 'HL7', 'Switch', 'Regex', 'Iteration', 'Conditional', 'Combination', 'Function', 'JsonProperty', 'Aggregate'];
  if (parent) {
    if (parent &&
      parent.edges &&
      parent.edges.length === 0 &&
      primaryModels.indexOf(parent.data.parentType) > -1
    ) return true;
  }
  return false;
}