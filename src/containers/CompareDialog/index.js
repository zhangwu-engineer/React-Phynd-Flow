import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
// style
import useStyles from './style';

const height = 400;
const rowHeight = 40;
const headerHeight = 40;
const width = 500;

const CompareDialog = ({ isModalShown, stashesList, hideModal }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

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
          <Table
            width={width}
            height={height}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={stashesList && stashesList.length}
            rowGetter={({index}) => stashesList[index]}
          >
            <Column label="Module" dataKey="module" width={100} />
            <Column label="Entity" dataKey="entity" width={200} />
            <Column label="Name" dataKey="itemName" width={200} />
          </Table>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompareDialog;