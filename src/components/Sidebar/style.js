import { makeStyles } from '@material-ui/core/styles';
const drawerWidth = 240;

export default makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: 112,
    height: `calc(100vh - 112px)`
  },
  listItemText: {
    fontSize: 20,
  },
}));