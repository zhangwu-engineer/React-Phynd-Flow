import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
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
}));

const OperationDialog = ({ isModalShown, hideModal, setNewOperation }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const [inputName, setInputName] = React.useState('');
  const handleNameChange = event => {
    setInputName(event.target.value);
  };

  const [inputField, setInputField] = React.useState('');
  const handleFieldChange = event => {
    setInputField(event.target.value);
  };

  const [inputValue, setInputValue] = React.useState('');
  const handleValueChange = event => {
    setInputValue(event.target.value);
  };

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
        <Typography>Operation Mapping Field</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid className={classes.tabInputContent}>
          <TextField
            label="Name"
            value={inputName}
            onChange={handleNameChange}
          />
        </Grid>
        <Grid className={classes.tabInputContent}>
          <TextField
            label="Field"
            value={inputField}
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid className={classes.tabInputContent}>
          <TextField
            label="Value"
            value={inputValue}
            onChange={handleValueChange}
          />
        </Grid>
        <Grid container className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
                setNewOperation(inputName);
              hideModal();
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
  );
}

export default OperationDialog;