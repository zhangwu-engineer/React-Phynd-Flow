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

  blockTable: {
    '& > div:nth-child(2)': {
      outline: 0,
      border: '1px solid #d2d2d2',
    }
  },
  blockItem: {
    paddingTop: 4,
    paddingLeft: 10,
    paddingBottom: 2,
    cursor: 'pointer',
    border: '2px solid transparent',
    '&:hover': {
      border: '2px solid #c9dcf5',
    }
  },
  unblockItem: {
    paddingTop: 4,
    paddingLeft: 10,
    paddingBottom: 2,
    cursor: 'pointer',
    border: '2px solid #577399',
  },
  blockItemLabel: {
    fontSize: 16
  },
}));
