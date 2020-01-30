import _ from 'lodash';
import { generateInitialSource } from './generateInitialSource';
import { getPropertyToMap } from './getPropertyToMap';

const defaultInput = {
  primary: 'N/A',
  secondary: 'N/A',
  tertiary: 'N/A',
  fourth: 'N/A',
};

export const findByPropertyNew = (obj, val, parent, element)=> {
  const propertyToFind = getPropertyToMap(parent.data.parentType);
  for (let p in obj) {
    // Case Key Value Update
    if (Array.isArray(obj[p])) {
      for (let ca in obj[p]) {
        if (obj[p][ca]['Key'] && `wrap-${obj[p][ca]['Value'][propertyToFind.id]}` === parent.data.id) {
          obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, defaultInput);
        } else if (obj[p][ca]['Key'] && obj[p][ca]['Value'][propertyToFind.id] === null && parent.data.dataDetails === parseInt(ca)) {
          obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, defaultInput);
        }
      }
    }
    if (!val) {
      // Primary Entity Update.
      const obj2 = generateInitialSource(element, parent, defaultInput);
      _.assign(obj, obj2);
      return obj;
    } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
      // Replace the internal entity with another category model.
      const obj2 = generateInitialSource(element, parent, defaultInput);
      obj[propertyToFind.name] = obj2;
      if (parent.data.parentType === 'iteration-source') {
        // Different field structure of Iteration.
        obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, defaultInput);
      }
      return obj;
    } else if (`iterator-entity-${obj[propertyToFind.id]}` === val) {
      obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, defaultInput);
    } else if (typeof obj[p] === 'object') {
      findByPropertyNew(obj[p], val, parent, element);
    }
  }
};