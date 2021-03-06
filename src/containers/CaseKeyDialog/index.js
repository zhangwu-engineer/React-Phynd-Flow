import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// style
import useStyles from './style';
import CategoryDialog from 'containers/CategoryDialog';

const CaseKeyDialog = ({ isModalShown, hideModal, setNewCase }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }
  const [isCategoryModalShown, setCategoryModalShown] = React.useState(false);
  const [inputKeyValue, setInputKeyValue] = React.useState('');
  const handleKeyInputChange = event => {
    setInputKeyValue(event.target.value);
  };

  return (
    <Fragment>
      <Dialog
        open={isModalShown}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          <Typography>Case Key Mapping Field</Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid className={classes.tabInputContent}>
            <TextField
              label="Key Name"
              value={inputKeyValue}
              onChange={handleKeyInputChange}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
              InputLabelProps={{
                classes: {
                  root: classes.resize,
                }
              }}
            />
          </Grid>
          <Grid container className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                closeModal();
                setCategoryModalShown(true);
              }}
            >
              Save
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={closeModal}>
              Close
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      <CategoryDialog
        isModalShown={isCategoryModalShown}
        hideModal={() => setCategoryModalShown(false)}
        setNewElement={(element, inputValue) => {
          setNewCase(inputKeyValue, element, inputValue);
        }}
      />
    </Fragment>
  );
}

export default CaseKeyDialog;