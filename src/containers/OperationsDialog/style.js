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
    paddingBottom: 12,
  },
  tabLastInputContent: {
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
    fontSize: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  select: {
    "& div": {
      fontSize: 20,
    }
  },
}));
