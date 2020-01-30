import { generateInitialSource } from './generateInitialSource';
import { getPropertyToMap } from './getPropertyToMap';

export const findByPropertyExisting = (obj, val, inputValue, parent, element)=> {
  const propertyToFind = getPropertyToMap(parent.data.parentType);
  for (let p in obj) {
    if (!val) {
      // Primary Entity Update.
      const obj2 = generateInitialSource(element, parent, inputValue);
      if (obj['MappingFieldType'] === obj2['MappingFieldType']) {
        // Update only entity details
        const oldProperty = getPropertyToMap(obj['MappingFieldType']);
        const newProperty = getPropertyToMap(obj2['MappingFieldType']);
        if (parent.data.parentType === 'Iteration') {
          obj['Iterator'][oldProperty.name] = obj2['Iterator'][newProperty.name];
          if (oldProperty.name1) obj['Iterator'][oldProperty.name1] = obj2['Iterator'][newProperty.name1];
          if (oldProperty.name2) obj['Iterator'][oldProperty.name2] = obj2['Iterator'][newProperty.name2];
        } else {
          obj[oldProperty.name] = obj2[newProperty.name];
          if (oldProperty.name1) obj[oldProperty.name1] = obj2[newProperty.name1];
          if (oldProperty.name2) obj[oldProperty.name2] = obj2[newProperty.name2];
        }
      }
      return obj;
    } else if (obj[propertyToFind.id] === parseInt(val) || obj[propertyToFind.id] === val) {
      // Internal Entities Update.
      const oldProperty = getPropertyToMap(obj['MappingFieldType']);
      if (parent.data.parentType === 'iteration-info') {
        obj['Iterator'][oldProperty.name] = inputValue.primary;
        if (oldProperty.name1) obj['Iterator'][oldProperty.name1] = inputValue.secondary;
        if (oldProperty.name2) obj['Iterator'][oldProperty.name2] = inputValue.tertiary;
      } else {
        obj[oldProperty.name] = inputValue.primary;
        if (oldProperty.name1) obj[oldProperty.name1] = inputValue.secondary;
        if (oldProperty.name2) obj[oldProperty.name2] = inputValue.tertiary;
      }
      return obj;
    } else if (`iterator-entity-${obj[propertyToFind.id]}` === val) {
      const oldProperty = getPropertyToMap(obj['MappingFieldType']);
      obj['Iterator'][oldProperty.name] = inputValue.secondary;
    } else if (`elementobj-entity-${obj[propertyToFind.id]}` === val) {
      const oldProperty = getPropertyToMap(obj['MappingFieldType']);
      obj[propertyToFind.name][oldProperty.name] = inputValue.primary;
      obj[propertyToFind.name][oldProperty.name1] = inputValue.secondary;
    } else if (typeof obj[p] === 'object') {
      findByPropertyExisting(obj[p], val, inputValue, parent, element);
    }
  }
};