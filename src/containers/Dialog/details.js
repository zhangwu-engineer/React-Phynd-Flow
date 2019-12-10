import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    padding: 20,
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
    minWidth: 300,
  },
  buttonGroup: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    marginLeft: 20,
  },
  resize:{
    fontSize: 20
  },
}));

const isRemovable = (parent) => {
  const primaryModels = ['Constant', 'Column', 'HL7', 'Switch', 'Regex', 'Iteration', 'Conditional', 'Combination', 'Function'];
  if (parent) {
    if (parent && parent.edges.length === 0 && primaryModels.indexOf(parent.data.parentType) > -1) return true;
  }
  return false;
}

const getPrimaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Function': return 'Function Name';
    case 'Iteration': return 'Delimiter';
    case 'Regex': return 'Pattern';
    case 'Constant': return 'Constant Value';
    case 'Column': return 'Column Name';
    case 'HL7': return 'HL7 Value';
    case 'JsonProperty': return 'Property Path';
    case 'JsonElementObject': return 'Path';
    case 'Aggregate': return 'Delimiter';
    default: return null;
  }
}

const getSecondaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Iteration': return 'Index';
    case 'Regex': return 'Flags';
    case 'JsonProperty': return 'Default';
    case 'JsonElementObject': return 'Limit';
    case 'AggregateIterator': return 'Iterator Delimiter';
    default: return null;
  }
}

const getTertiaryFieldLabel = (cardType) => {
  switch (cardType) {
    case 'Regex': return 'Group Number';
    default: return null;
  }
}

const getFourthFieldLabel = (activeParent) => {
  if (activeParent && activeParent.data.parentType === 'cases-entity') {
    return 'Key Name';
  }
  return null;
}


const DetailsDialog = ({ isModalShown, activeParent, currentCard, currentDetails, hideModal, updateElement, removeElement }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const [inputPrimaryValue, setInputPrimaryValue] = React.useState('');
  const handlePrimaryInputChange = event => {
    setInputPrimaryValue(event.target.value);
  };

  const [inputSecondaryValue, setInputSecondaryValue] = React.useState('');
  const handleSecondaryInputChange = event => {
    setInputSecondaryValue(event.target.value);
  };

  const [inputTertiaryValue, setInputTertiaryValue] = React.useState('');
  const handleTertiaryInputChange = event => {
    setInputTertiaryValue(event.target.value);
  };

  const [inputFourthValue, setInputFourthValue] = React.useState('');
  const handleFourthInputChange = event => {
    setInputFourthValue(event.target.value);
  };

  useEffect(() => {
    setInputPrimaryValue(currentDetails ? currentDetails.primary : '');
    setInputSecondaryValue(currentDetails ? currentDetails.secondary : '');
    setInputTertiaryValue(currentDetails ? currentDetails.tertiary : '');
    setInputFourthValue(currentDetails ? currentDetails.fourth : '');
  }, [currentDetails]);

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid container justify="space-between" alignItems="center" className={classes.dialogTitle}>
        <Typography>Edit Details</Typography>
        <Typography><CloseIcon onClick={closeModal} /></Typography>
      </Grid>
      <DialogContent className={classes.dialogContent}>
        <Grid item>
          {getPrimaryFieldLabel(currentCard) &&
            <TextField
              label={getPrimaryFieldLabel(currentCard)}
              value={inputPrimaryValue || ''}
              onChange={handlePrimaryInputChange}
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
          }
        </Grid>
        <Grid item>
          {getSecondaryFieldLabel(currentCard) &&
            <TextField
              label={getSecondaryFieldLabel(currentCard)}
              value={inputSecondaryValue || ''}
              onChange={handleSecondaryInputChange}
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
          }
        </Grid>
        <Grid item>
          {getTertiaryFieldLabel(currentCard) &&
            <TextField
              label={getTertiaryFieldLabel(currentCard)}
              value={inputTertiaryValue || ''}
              type="number"
              onChange={handleTertiaryInputChange}
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
          }
        </Grid>
        <Grid item>
          {getFourthFieldLabel(activeParent) &&
            <TextField
              label={getFourthFieldLabel(activeParent)}
              value={inputFourthValue || ''}
              onChange={handleFourthInputChange}
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
          }
        </Grid>
        <Grid container className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              updateElement(currentCard, {
                primary: inputPrimaryValue,
                secondary: inputSecondaryValue,
                tertiary: inputTertiaryValue,
                fourth: inputFourthValue,
              });
              closeModal();
            }}
          >
            Save
          </Button>
          {isRemovable(activeParent) &&
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                removeElement();
                closeModal();
              }}
            >
              Remove
            </Button>
          }
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default DetailsDialog;