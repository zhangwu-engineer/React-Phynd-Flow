import { generateInitialSource } from 'utils/helper';

export const findByPropertyCase = (obj, val, inputKeyValue, element, inputValue)=> {
  const nextMappingSource = generateInitialSource(element, null, inputValue);
  for (let p in obj) {
    if (Array.isArray(obj[p]) && p === 'Cases' &&
      `case-target-${obj['MappingFieldId']}` === val
    ) {
      obj[p].push({
        Key: (inputKeyValue && inputKeyValue.length > 0) ? inputKeyValue : 'N/A',
        Value: nextMappingSource,
      });
    } else if (typeof obj[p] === 'object') {
      findByPropertyCase(obj[p], val, inputKeyValue, element, inputValue);
    }
  }
};