import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  dialogActions: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabInputContent: {
    paddingBottom: 40,
  },
  buttonGroup: {
    paddingTop: 20,
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
  stashTable: {
    fontSize: 16,
    textAlign: "center",
  },
  stashColumn: {
    fontSize: 16,
  }
}));
