export const a11yProps = index => ({
  id: `scrollable-auto-tab-${index}`,
  'aria-controls': `scrollable-auto-tabpanel-${index}`,
})

export const getIDFromName = name => `${name}`.toLowerCase().replace(' ', '-')
export const getNameFromID = id => `${id}`.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');
