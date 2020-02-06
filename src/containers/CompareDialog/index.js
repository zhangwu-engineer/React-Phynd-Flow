import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { List } from 'react-virtualized';
// style
import useStyles from './style';

const height = 400;
const rowHeight = 40;
const width = 800;

const CompareDialog = ({ isModalShown, stashesList, hideModal }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const rowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        <div>{stashesList[index].itemName}</div>
      </div>
    );
  };

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
        <Typography>Compare</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid className={classes.tabInputContent} container>
          <List
            rowCount={stashesList && stashesList.length}
            width={width}
            height={height}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            overscanRowCount={3}
          />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompareDialog;