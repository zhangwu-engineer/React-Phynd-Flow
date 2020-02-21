import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  dialogTitle: {
    padding: 20,
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
  },
  tabContent: {
    paddingBottom: 32,
  },
  buttonGroup: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    marginLeft: 20,
  },
  fieldsHeading: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 16,
  }
}));
