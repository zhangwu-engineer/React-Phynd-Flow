export const findByPropertyCase = (obj, val, inputKeyValue)=> {
  for (let p in obj) {
    if (Array.isArray(obj[p]) && p === 'Cases' && `case-target-${obj['MappingFieldId']}` === val) {
      obj[p].push({
        Key: inputKeyValue.length > 0 ? inputKeyValue : 'N/A',
        Value: {
          MappingFieldId: null,
          MappingFieldType: null,
        },
      });
    } else if (typeof obj[p] === 'object') {
      findByPropertyCase(obj[p], val);
    }
  }
};