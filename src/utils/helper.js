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
    default: return 'NoMap';
  }
}
