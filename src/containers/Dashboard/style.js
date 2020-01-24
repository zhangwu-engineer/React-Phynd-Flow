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
  addButtonContainer: {
    margin: 24,
  },
  addButton: {
    fontSize: 22,
    marginRight: 20
  },
  toolbar: theme.mixins.toolbar,
}));
