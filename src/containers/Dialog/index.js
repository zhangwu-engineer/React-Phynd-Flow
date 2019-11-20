import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { FaQuestion, FaColumns, FaPlus, FaCode, FaList, FaWindowMinimize, FaAngleUp, FaAlignJustify } from "react-icons/fa";
import { AiOutlineScissor } from "react-icons/ai";
import hoc from '../Dashboard/hoc';

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
};

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
  tabContent: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  tabInputContent: {
    paddingTop: 40,
    paddingBottom: 40,
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
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    marginLeft: 20,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {children}
    </Typography>
  );
}

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

const NodeDialog = ({ isModalShown, hideModal, setNewElement }) => {
  const classes = useStyles();
  const [activeCard, setActiveCard] = React.useState(null);
  const closeModal = () => {
    hideModal();
  }
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [inputValue, setInputValue] = React.useState('N/A');
  const handleInputChange = event => {
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
        <Typography>Choose Mapping Field</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Category" />
            <Tab label="Details" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Grid container spacing={2} className={classes.tabContent}>
            {Object.keys(IconsList).map(key =>
              <Grid
                item xs={4}
                key={key}
                onClick={() => {
                  if (activeCard !== key) {
                    setActiveCard(key);
                  } else {
                    setActiveCard(null);
                  }
                }}
              >
                <NodeCard cardName={key} activeCard={activeCard} />
              </Grid>
            )}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabInputContent}>
          <TextField
            label="Input Value"
            value={inputValue}
            onChange={handleInputChange}
          />
        </TabPanel>
        <Grid container className={classes.buttonGroup}>
          <Button variant="contained" color="primary" className={classes.button} onClick={() => { setNewElement(activeCard, inputValue); hideModal(); }} >
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

export default hoc(NodeDialog);