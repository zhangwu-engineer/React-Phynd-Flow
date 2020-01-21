import React, { useEffect } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

import useStyles from './style';
import { isRemovable } from 'utils/categoryDialog';
import { IconsList } from 'utils/iconsList';
import { NodeCard } from '../../components/NodeCard';

const CategoryDialog = ({ isModalShown, activeParent, currentCard, currentDetails, hideModal, setNewElement, removeElement }) => {
  const classes = useStyles();
  const [activeCard, setActiveCard] = React.useState(null);

  const closeModal = () => {
    hideModal();
  }

  useEffect(() => {
    setActiveCard(currentCard);
  }, [currentCard]);

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid container justify="space-between" alignItems="center" className={classes.dialogTitle}>
        <Typography>Choose Mapping Field</Typography>
        <Typography><CloseIcon onClick={closeModal} /></Typography>
      </Grid>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2} className={classes.tabContent}>
          {_.map(IconsList, (value, key) =>
            <Grid
              item xs={4}
              key={key}
              onClick={() => {
                setActiveCard(key);
                setNewElement(key);
                closeModal();
              }}
            >
              <NodeCard cardName={key} activeCard={activeCard} />
            </Grid>
          )}
        </Grid>
        <Grid container className={classes.buttonGroup}>
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

export default CategoryDialog;