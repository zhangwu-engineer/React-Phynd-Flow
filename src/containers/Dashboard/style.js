import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: 112,
  },
  content: {
    flexGrow: 1,
  },
  details: {
    width: 'calc(100vw - 279px)',
    overflow: 'scroll',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
}));
