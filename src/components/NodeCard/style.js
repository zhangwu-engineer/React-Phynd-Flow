import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
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
  cardInactive: {
    border: '2px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #577399',
    }
  },
}));
