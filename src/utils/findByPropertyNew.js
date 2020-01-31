import _ from 'lodash';
import { generateInitialSource } from './generateInitialSource';
import { getPropertyToMap } from './getPropertyToMap';

export const findByPropertyNew = (obj, val, inputValue, parent, element)=> {
  const propertyToFind = getPropertyToMap(parent.data.parentType);
  for (let p in obj) {
    // Case Key Value Update
    if (Array.isArray(obj[p])) {
      for (let ca in obj[p]) {
        if (obj[p][ca]['Key'] && `wrap-${obj[p][ca]['Value'][propertyToFind.id]}` === parent.data.id) {
          obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, inputValue);
        } else if (obj[p][ca]['Key'] && obj[p][ca]['Value'][propertyToFind.id] === null && parent.data.dataDetails === parseInt(ca)) {
          obj[p][ca]['Value'] = generateInitialSource(element, { data: { id: parent.data.parent } }, inputValue);
        }
      }
    }
    if (!val) {
      // Primary Entity Update.
      const obj2 = generateInitialSource(element, parent, inputValue);
      _.assign(obj, obj2);
      return obj;
    } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
      // Replace the internal entity with another category model.
      const obj2 = generateInitialSource(element, parent, inputValue);
      obj[propertyToFind.name] = obj2;
      if (parent.data.parentType === 'iteration-source') {
        // Different field structure of Iteration.
        obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, inputValue);
      }
      return obj;
    } else if (`iterator-entity-${obj[propertyToFind.id]}` === val) {
      obj['Iterator'][propertyToFind.name] = generateInitialSource(element, parent, inputValue);
    } else if (typeof obj[p] === 'object') {
      findByPropertyNew(obj[p], val, inputValue, parent, element);
    }
  }
};