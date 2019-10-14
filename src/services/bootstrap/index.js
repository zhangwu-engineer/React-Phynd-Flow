import theme from './theme'
import { createMuiTheme } from '@material-ui/core/styles'
import { ui } from 'config';

const muiTheme = createMuiTheme(theme(ui))

export {
  muiTheme,
}
