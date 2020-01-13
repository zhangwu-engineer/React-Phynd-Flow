import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  dialogTitle: {
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  tabInputContent: {
    paddingBottom: 40,
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
  resize: {
    fontSize: 20
  },
  blockItem: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    cursor: 'pointer',
    border: '2px solid transparent',
    '&:hover': {
      border: '1px solid #577399',
    }
  },
  unblockItem: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    cursor: 'pointer',
    border: '2px solid #577399',
  },
  blockItemLabel: {
    fontSize: 18
  },
}));
