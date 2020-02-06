import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export default withStyles({
  root: {
    borderRadius: 0,
    border: 0,
    color: 'white',
    height: 34,
    padding: '0 30px',
    marginRight: 24,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 14,
  },
})(Button);