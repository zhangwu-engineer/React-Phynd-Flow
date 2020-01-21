import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  dialogTitle: {
    padding: 20,
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  tabContent: {
    paddingBottom: 20,
  },
  cardInactive: {
    border: '2px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #577399',
    }
  },
  cardActive: {
    border: '2px solid #577399',
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: 14,
    paddingTop: 4,
    paddingLeft: 8,
  },
  cardIcon: {
    fontSize: 36,
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
}));
