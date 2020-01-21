export const getChildrenWeight = (field) => {
  if (field) {
    switch (field.MappingFieldType) {
      case 'Combination':
        return getChildrenWeight(field.Field1) + getChildrenWeight(field.Field2);
      case 'Conditional':
        return getChildrenWeight(field.Condition.Field1) + getChildrenWeight(field.Condition.Field2)  + getChildrenWeight(field.TrueField) + getChildrenWeight(field.FalseField);
      case 'Switch':
        let total = getChildrenWeight(field.SwitchValue) + getChildrenWeight(field.SwitchDefault);
        let caseSum = 1;
        field.Cases.forEach(c => {
          caseSum += getChildrenWeight(c.Value);
        });
        total = total + (caseSum === 1 ? 1 : caseSum - 1);
        return total;
      case 'Regex': return getChildrenWeight(field.Source)+1;
      case 'Iteration': return getChildrenWeight(field.Iterator.Source)+1;
      case 'Function': return getChildrenWeight(field.FunctionParameter)+1;
      case 'JsonProperty': return getChildrenWeight(field.Source)+1;
      case 'JsonElementObject':
        let elementTotal = 1;
        const opSum = field.Operations.length;
        elementTotal = elementTotal + (opSum < 2 ? 1 : opSum);
        return elementTotal;
      case 'JsonElement':
        return getChildrenWeight(field.Element) + getChildrenWeight(field.Source);
      case 'Aggregate': return getChildrenWeight(field.Iterator.Source)+getChildrenWeight(field.Iterations)+2;
      default:
        return 1;
    }
  }
  return 1;
};