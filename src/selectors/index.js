import { createSelector } from 'reselect';
import { map, size } from 'lodash';
import { getIDFromName, getNameFromID, getNameFromEntity, OBJ_ENTITIES } from 'utils/helper';

export const getFieldsReducer = (state) => state.fields;
export const getDashboardReducer = (state) => state.dashboard;
export const getStashesList = (state) => state.stashes.stashes;

const getModuleEntity = (state, props) => {
  return {
    moduleOrigin: props.match && props.match.params.module,
    entityOrigin: props.match && props.match.params.entity,
    module: getNameFromID(props.match && props.match.params.module),
    entity: getNameFromID(props.match && props.match.params.entity),
    entityName: getNameFromEntity(props.match && props.match.params.entity),
  };
};

export const getFieldsModule = createSelector(
  [getFieldsReducer, getModuleEntity],
  (fieldsReducer, moduleEntity) => {
    return fieldsReducer &&
      fieldsReducer.fields &&
      fieldsReducer.fields[moduleEntity.module];
  }
);

export const getFieldsList = createSelector(
  [getFieldsReducer, getModuleEntity],
  (fieldsReducer, moduleEntity) => {
    return fieldsReducer &&
      fieldsReducer.fields &&
      fieldsReducer.fields[moduleEntity.module] &&
      fieldsReducer.fields[moduleEntity.module][moduleEntity.entity];
  }
);

export const isContactMap = createSelector(
  [getModuleEntity],
  (moduleEntity) => {
    return (moduleEntity.entityOrigin === 'contacts' && moduleEntity.moduleOrigin === 'provider-module')
  }
);

export const getDashboardMap = createSelector(
  [getDashboardReducer, getModuleEntity, isContactMap],
  (dashboardReducer, moduleEntity, isContactMapStatus) => {
    if (OBJ_ENTITIES.indexOf(moduleEntity.entityOrigin) < 0) {
      if (isContactMapStatus) {
        return dashboardReducer && dashboardReducer.dashboard && dashboardReducer.dashboard[moduleEntity.module] && dashboardReducer.dashboard[moduleEntity.module]['AddressMaps'];
      }
      return dashboardReducer && dashboardReducer.dashboard && dashboardReducer.dashboard[moduleEntity.module] &&
      dashboardReducer.dashboard[moduleEntity.module][moduleEntity.entityName];
    }
    return dashboardReducer &&
      dashboardReducer.dashboard &&
      dashboardReducer.dashboard[moduleEntity.module];
  }
);

export const makeSidebarData = () => createSelector(
  [getFieldsModule],
  (fieldItems) => {
    return fieldItems ?
      map(fieldItems, (value, name) => ({ name: name, link: getIDFromName(name) }))
      : {}
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
          am.ContactMaps &&
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
      blockListFromReducer = fieldsDdata && fieldsDdata.filter((fd) => mapData && !mapData[fd]);
    }
    return blockListFromReducer;
  }
);

