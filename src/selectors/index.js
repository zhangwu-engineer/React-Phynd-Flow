import { createSelector } from 'reselect';
import { map } from 'lodash';
import { getIDFromName, getNameFromID } from 'utils/helper';

const getFields = (state, props) => state.fields.fields[getNameFromID(props.match.params.module)];
export const getFieldsList = (state, props) => state.fields.fields[getNameFromID(props.match.params.module)] &&
  state.fields.fields[getNameFromID(props.match.params.module)][getNameFromID(props.match.params.entity)];

export const makeSidebarData = () => createSelector(
  [getFields],
  (fieldItems) => {
    return fieldItems ?
      map(fieldItems, (value, name) => ({ name: name, link: getIDFromName(name) }))
      : {}
  }
)