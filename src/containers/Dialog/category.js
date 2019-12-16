import React, { useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  dialogTitle: {
    padding: 20,
    paddingBottom: 0,
  },
  dialogContent: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  tabContent: {
    paddingBottom: 20,
  },
  tabInputContent: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  cardInactive: {
    border: '2px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #577399',
    }
  },
  cardActive: {
    border: '2px solid #577399',
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: 14,
    paddingTop: 4,
    paddingLeft: 8,
  },
  cardIcon: {
    fontSize: 36,
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
  resize:{
    fontSize: 20
  },
}));

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