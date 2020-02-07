import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  moduleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'none',
  },
  buttonGroup: {
    boxShadow: 'none',
  }
}));