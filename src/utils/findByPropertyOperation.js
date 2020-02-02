export const findByPropertyOperation = (obj, val, name, field, value)=> {
  for (let p in obj) {
    if (p === 'Element' && `elementoperations-entity-${obj['MappingFieldId']}` === val) {
      obj[p]['Operations'].push({
        name,
        field,
        value,
        Source: {},
      });
    } else if (typeof obj[p] === 'object') {
      findByPropertyOperation(obj[p], val, name, field, value);
    }
  }
};
