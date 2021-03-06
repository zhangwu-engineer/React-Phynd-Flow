import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useStyles from './style';

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
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.resize}>Name</InputLabel>
            <Select
              className={classes.select}
              value={inputName}
              onChange={handleNameChange}
            >
              <MenuItem value="SortAsc">SortAsc</MenuItem>
              <MenuItem value="SortDesc">SortDesc</MenuItem>
              <MenuItem value="CompareEQ">CompareEQ</MenuItem>
              <MenuItem value="CompareGT">CompareGT</MenuItem>
              <MenuItem value="CompareLT">CompareLT</MenuItem>
              <MenuItem value="CompareContains">CompareContains</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid className={classes.tabInputContent}>
          <TextField
            label="Field"
            value={inputField}
            onChange={handleFieldChange}
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
        <Grid className={classes.tabLastInputContent}>
          <TextField
            label="Value"
            value={inputValue}
            onChange={handleValueChange}
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
              setNewOperation(inputName, inputField, inputValue);
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