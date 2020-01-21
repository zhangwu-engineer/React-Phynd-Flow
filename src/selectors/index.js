import { createSelector } from 'reselect';
import { map } from 'lodash';
import { getIDFromName } from 'utils/helper';

const getFields = state => state.fields.fields;

export const makeSidebarData = () => createSelector(
  [getFields],
  (fieldItems) => {
    return fieldItems ?
      map(fieldItems, (value, name) => ({ name: name, link: getIDFromName(name) }))
      : {}
  }
)