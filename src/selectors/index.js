import { createSelector } from 'reselect';
import { map, size } from 'lodash';
import { getIDFromName, getNameFromID, getNameFromEntity, OBJ_ENTITIES } from 'utils/helper';

const getFieldsModule = (state, props) => state.fields.fields[getNameFromID(props.match.params.module)];

export const getFieldsList = (state, props) => {
  return state.fields.fields[getNameFromID(props.match.params.module)] &&
  state.fields.fields[getNameFromID(props.match.params.module)][getNameFromID(props.match.params.entity)];
}

export const getDashboardMap = (state, props) => {
  if (OBJ_ENTITIES.indexOf(props.match.params.entity) < 0) {
    if (props.match.params.entity === 'contacts' && props.match.params.module === 'provider-module') {
      return state.dashboard.dashboard && state.dashboard.dashboard[getNameFromID(props.match.params.module)]['AddressMaps'];
    }
    return state.dashboard.dashboard[getNameFromID(props.match.params.module)] &&
      state.dashboard.dashboard[getNameFromID(props.match.params.module)][getNameFromEntity(props.match.params.entity)];
  }
  return state.dashboard.dashboard[getNameFromID(props.match.params.module)];
}

const getEntityName = (state, prop) => prop.match.params.entity;

export const makeSidebarData = () => createSelector(
  [getFieldsModule],
  (fieldItems) => {
    return fieldItems ?
      map(fieldItems, (value, name) => ({ name: name, link: getIDFromName(name) }))
      : {}
  }
);

export const isContactMap = createSelector(
  [getDashboardMap, getEntityName],
  (mapData, entityName) => {
    return (entityName === 'contacts' && mapData[0].ContactMaps && mapData[0].ContactMaps[0]['ContactType'])
  }
);

export const makeDashboardList = () => createSelector(
  [getDashboardMap, isContactMap],
  (mapData, isContactMapStatus) => {
    let startPoint = 0;
    const dashboardListFromReducer = [];
    if (Array.isArray(mapData)) {
      mapData.forEach((am, index) => {
        if (isContactMapStatus) {
          am.ContactMaps.forEach(cm => {
            dashboardListFromReducer.push({
              dashboard: cm,
              startPoint,
              addressIndex: index,
            });
            startPoint += parseInt(size(cm));
          });
        } else {
          dashboardListFromReducer.push({
            dashboard: am,
            startPoint,
          });
          startPoint += parseInt(size(am));
        }
      });
      return dashboardListFromReducer;
    }
    return { dashboard: mapData };
  }
);

export const makeBlockList = () => createSelector(
  [getDashboardMap, getFieldsList, isContactMap],
  (mapData, fieldsDdata, isContactMapStatus) => {
    let blockListFromReducer = [];
    if (Array.isArray(mapData)) {
      const countBlocked = (item) => {
        let count = 0;
        let iterateData = [];
        if (isContactMapStatus) {
          mapData.forEach(md => {
            md.ContactMaps.forEach(cm => {
              iterateData.push(cm);
            })
          });
        } else {
          iterateData = mapData;
        }
        for (const md in iterateData) if (!iterateData[md][item]) ++count;
        return count;
      };
      blockListFromReducer = fieldsDdata && fieldsDdata.filter((fd) => countBlocked(fd) === mapData.length);
    } else {
      blockListFromReducer = fieldsDdata && fieldsDdata.filter((fd) => !mapData[fd]);
    }
    return blockListFromReducer;
  }
);

