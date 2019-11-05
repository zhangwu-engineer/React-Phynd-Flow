import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FaQuestion, FaColumns, FaPlus, FaCode, FaList, FaWindowMinimize, FaAngleUp, FaAlignJustify } from "react-icons/fa";
import { AiOutlineScissor } from "react-icons/ai";
import hoc from '../Dashboard/hoc';

const IconsList = {
  Condition: FaWindowMinimize,
  Column: FaColumns,
  HL7: FaAngleUp,
  Conditional: FaQuestion,
  Combination: FaPlus,
  Regex: AiOutlineScissor,
  Iteration: FaList,
  Function: FaCode,
  Swith: FaAlignJustify,
};

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  cardInactive: {
    border: '2px solid transparent',
  },
  cardActive: {
    border: '2px solid #577399',
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
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    marginLeft: 20,
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

const NodeDialog = ({ isModalShown, triggerModal }) => {
  const classes = useStyles();
  const [activeCard, setActiveCard] = React.useState(null);
  const closeModal = () => {
    triggerModal(null, false);
  }

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography>Choose Mapping Field</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className={classes.dialogContent}>
          {Object.keys(IconsList).map(key =>
            <Grid item xs={4} key={key} onClick={() => setActiveCard(key)}>
              <NodeCard cardName={key} activeCard={activeCard} />
            </Grid>
          )}
          <Grid container className={classes.buttonGroup}>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => triggerModal(null, true)}>
              Create
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={closeModal}>
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default hoc(NodeDialog);