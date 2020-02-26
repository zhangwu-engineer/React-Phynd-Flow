import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import _ from 'lodash';

import useStyles from './style';

import {
  isDetailsEntityRemovable,
  getPrimaryFieldLabel,
  getSecondaryFieldLabel,
  getTertiaryFieldLabel,
} from 'utils/detailsDialog';

const DetailsDialog = ({ isModalShown, activeParent, currentCard, currentDetails, hideModal, updateElement, removeElement }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal(false);
  }
  const closeSaveModal = () => {
    hideModal(true);
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

  const [iteratorsList, setIteratorList] = React.useState([]);
  const [iteratorsListId, setIteratorsListId] = React.useState(0);

  const handleListIdChange = event => {
    const newListId = event.target.value;
    setIteratorsListId(newListId);
    setInputPrimaryValue(iteratorsList[newListId].delimiter);
    setInputSecondaryValue(iteratorsList[newListId].index);
  };

  useEffect(() => {
    setInputPrimaryValue(currentDetails ? currentDetails.primary : '');
    setInputSecondaryValue(currentDetails ? currentDetails.secondary : '');
    setInputTertiaryValue(currentDetails ? currentDetails.tertiary : '');
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
        {iteratorsList.length > 0 &&
          <Grid className={classes.tabInputContent}>
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.resize}>Iterators</InputLabel>
              <Select
                className={classes.select}
                value={iteratorsListId}
                onChange={handleListIdChange}
              >
                {iteratorsList.map((data, index) => (
                  <MenuItem value={index} key={`iterator-${index}`}>{`Delimiter: ${data.delimiter}, Index: ${data.index}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        }
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
              type={currentCard === 'JsonElementObject' ? 'number' : 'text'}
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
        <Grid container className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              if (currentCard === 'Iteration') {
                const iteratorsListClone = _.clone(iteratorsList);
                const duplicatedId = _.findIndex(iteratorsListClone, {
                  delimiter: inputPrimaryValue,
                  index: inputSecondaryValue,
                });
                if (duplicatedId === -1) {
                  iteratorsListClone.push({
                    delimiter: inputPrimaryValue,
                    index: inputSecondaryValue,
                  });
                  setIteratorsListId(iteratorsListClone.length-1);
                  setIteratorList(iteratorsListClone);
                }
              }
              updateElement(currentCard, {
                primary: inputPrimaryValue,
                secondary: inputSecondaryValue,
                tertiary: inputTertiaryValue,
              });
              closeSaveModal();
            }}
          >
            Save
          </Button>
          {isDetailsEntityRemovable(activeParent) &&
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