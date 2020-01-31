import React, { useEffect, Fragment } from 'react';
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
import { NodeCard } from 'components/NodeCard';
import { isSingleNode, DEFAULT_INPUT } from 'utils/helper';
import DetailsDialog from 'containers/DetailsDialog';

const CategoryDialog = ({ isModalShown, activeParent, currentCard, hideModal, setNewElement, removeElement }) => {
  const classes = useStyles();
  const [activeCard, setActiveCard] = React.useState(null);
  const [isDetailsModalShown, setDetailsModalShown] = React.useState(false);

  const closeModal = () => {
    hideModal();
  }

  useEffect(() => {
    setActiveCard(currentCard);
  }, [currentCard]);

  return (
    <Fragment>
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
                  closeModal();
                  if (!isSingleNode(key)) {
                    setNewElement(key, DEFAULT_INPUT);
                  } else {
                    setDetailsModalShown(true);
                  }
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
      <DetailsDialog
        isModalShown={isDetailsModalShown}
        hideModal={(isSaving) => {
          if (!isSaving) {
            setNewElement(activeCard, DEFAULT_INPUT);
          }
          setDetailsModalShown(false)
        }}
        activeParent={activeParent}
        currentCard={activeCard}
        currentDetails={DEFAULT_INPUT}
        updateElement={(element, inputValue) => {
          setNewElement(activeCard, inputValue);
        }}
      />
    </Fragment>
  );
}

export default CategoryDialog;