import React, { useEffect } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { FaQuestion, FaColumns, FaPlus, FaCode, FaList, FaWindowMinimize, FaAngleUp, FaAlignJustify, FaJs } from "react-icons/fa";
import { AiOutlineScissor } from "react-icons/ai";

import useStyles from './style';

const IconsList = {
  Constant: FaWindowMinimize,
  Column: FaColumns,
  HL7: FaAngleUp,
  Conditional: FaQuestion,
  Combination: FaPlus,
  Regex: AiOutlineScissor,
  Iteration: FaList,
  Function: FaCode,
  Switch: FaAlignJustify,
  JsonProperty: FaJs,
  JsonElement: FaJs,
  Aggregate: FaJs,
};

const NodeCard = ({ cardName, activeCard }) => {
  const classes = useStyles();
  const CardIcon = IconsList[cardName];
  return (
    <Card className={activeCard === cardName ? classes.cardActive : classes.cardInactive}>
      <Typography className={classes.cardTitle}>{cardName}</Typography>
      <CardContent>
        <Grid container spacing={2} justify="center" className={classes.cardContent}>
          <CardIcon className={classes.cardIcon} />
        </Grid>
      </CardContent>
    </Card>
  )
}

const isRemovable = (parent) => {
  const primaryModels = ['Constant', 'Column', 'HL7', 'Switch', 'Regex', 'Iteration', 'Conditional', 'Combination', 'Function', 'JsonProperty', 'Aggregate'];
  if (parent) {
    if (parent && parent.edges.length === 0 && primaryModels.indexOf(parent.data.parentType) > -1) return true;
  }
  return false;
}

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