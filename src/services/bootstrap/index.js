import theme from './theme'
import { createMuiTheme } from '@material-ui/core/styles'
import { ui } from 'config';

const styledTheme = theme(ui)
const muiTheme = createMuiTheme(theme(ui))

export {
  muiTheme,
  styledTheme,
}
