import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  dialogContent: {
    paddingTop: 30,
    paddingBottom: 0,
  },
  dialogActions: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabInputContent: {
    paddingBottom: 10,
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
    '& > div:nth-child(2)': {
      outline: 0,
      paddingTop: 8,
      border: '1px solid #e2e2e2',
    }
  },
  stashColumn: {
    fontSize: 16,
  }
}));
