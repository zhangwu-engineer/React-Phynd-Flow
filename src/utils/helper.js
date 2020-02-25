import _ from 'lodash';
import { generateInitialSource } from './generateInitialSource';
import { checkNodeEditable, checkCategoryEditable, isSingleNode } from './checkEditable';
import { getPropertyToMap } from './getPropertyToMap';
import { generateMapping } from './generateMap';
import { findByPropertyNew } from './findByPropertyNew';
import { findByPropertyExisting } from './findByPropertyExisting';
import { findByPropertyCase } from './findByPropertyCase';
import { findByPropertyOperation } from './findByPropertyOperation';

export {
  generateInitialSource,
  checkNodeEditable,
  checkCategoryEditable,
  isSingleNode,
  getPropertyToMap,
  generateMapping,
  findByPropertyNew,
  findByPropertyExisting,
  findByPropertyCase,
  findByPropertyOperation,
};

export const a11yProps = index => ({
  id: `scrollable-auto-tab-${index}`,
  'aria-controls': `scrollable-auto-tabpanel-${index}`,
})

//reducer helpers
export const getIDFromName = name => `${name}`.toLowerCase().replace(' ', '-')

export const getNameFromID = id => `${id}`.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');

export const getNameFromEntity = entity => {
  switch (entity) {
    case 'addresses': return 'AddressMaps';
    case 'licenses': return 'LicenseMaps';
    case 'specialties': return 'SpecialtyMaps';
    case 'qualifications': return 'ProviderTrainingMaps';
    case 'custom-fields': return 'CustomFieldToExtractProvider';
    case 'languages': return 'ProviderLanguageMaps';
    case 'office-hours': return 'OfficeHourMaps';
    case 'features': return 'FeatureMaps';
    case 'identifiers': return 'IdentifierMaps';
    case 'groups': return 'GroupMaps';
    case 'treatment-terms': return 'TreatmentTermMaps';
    case 'providers': return 'ProviderMaps';
    case 'contacts': return 'ContactMaps';
    case 'age-groups': return 'AgeGroupMaps';
    case 'healthplan-groups': return 'HealthplanGroupMaps';
    case 'healthplan-locations': return 'HealthplanLocationMaps';
    default: console.log(`${entity}`.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')); return `${entity}`.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');
  }
}

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const start = result[startIndex];
  result.splice(startIndex, 1);
  result.splice(endIndex, 0, start);
  return [...result];
};

// reducer management funciton
export const addOrReplaceStash = (arr, obj) => {
  const { module, entity, panelIndex, itemName } = obj;
  const index = _.findIndex(arr, {
    module,
    entity,
    itemName,
    panelIndex,
  });
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
  return arr;
} 

// routing helpers
export const moduleRouter = [
  '/provider-module/provider-details',
  '/location-module/location-details',
  '/network-module/network-details',
  '/healthplan-module/healthplan-details',
  '/epic-outbound-module/kvp-provider',
];

export const moduleTabNumber = {
  'provider-module': 0,
  'location-module': 1,
  'network-module': 2,
  'healthplan-module': 3,
  'epic-outbound-module': 4
}

export const OBJ_ENTITIES = [
  'provider-details',
  'location-details',
  'address',
  'billing-address',
  'payto-address',
  'schedule',
  'kvp-provider',
  'healthplan-details',
  'healthplan-company',
  'healthplan-network'
];

// diagram input
export const DEFAULT_INPUT = {
  primary: 'N/A',
  secondary: 'N/A',
  tertiary: 'N/A',
};

// notification format
export const NOTIFICATION_FORMAT = {
  title: 'Title',
  message: 'Message',
  type: 'success',
  insert: 'top',
  container: 'top-right',
  animationIn: ['animated', 'fadeIn'],
  animationOut: ['animated', 'fadeOut'],
  dismiss: {
    duration: 5000,
    onScreen: true,
    showIcon: true,
    delay: 0
  }
};

// reducer helper

export const getPathFromPayload = data => {
  const itemName = data.itemName === '' ?
    data.itemName :
    `.${data.itemName}`;
  let nestedSub = `${getNameFromID(data.module)}${itemName}`;
  if (data.panelIndex > -1) {
    nestedSub = `${getNameFromID(data.module)}.${getNameFromEntity(data.entity)}.[${data.panelIndex}]${itemName}`;
    if (data.module === 'provider-module' && data.entity === 'contacts') {
      nestedSub = `${getNameFromID(data.module)}.AddressMaps.[${data.addressIndex}].ContactMaps.[${data.contactIndex}]${itemName}`;
    }
  }
  return nestedSub
}