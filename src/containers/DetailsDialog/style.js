import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  dialogTitle: {
    padding: 20,
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
    minWidth: 300,
  },
  buttonGroup: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    marginLeft: 20,
  },
  resize: {
    fontSize: 20
  },
}));
