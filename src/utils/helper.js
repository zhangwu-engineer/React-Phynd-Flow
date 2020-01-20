export const a11yProps = index => ({
  id: `scrollable-auto-tab-${index}`,
  'aria-controls': `scrollable-auto-tabpanel-${index}`,
})

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
    default: return 'NoMap';
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

export const moduleRouter = [
  '/provider-module/provider-details',
  '/location-module/location-details',
  '/network-module/network-details',
  '/healthplan-module/healthplan-details'
];

export const moduleTabNumber = {
  'provider-module': 0,
  'location-module': 1,
  'network-module': 2,
  'healthplan-module': 3
}

export const OBJ_ENTITIES = [
  'provider-details',
  'location-details',
  'address',
  'billing-address',
  'paytoaddress',
  'schedule'
];