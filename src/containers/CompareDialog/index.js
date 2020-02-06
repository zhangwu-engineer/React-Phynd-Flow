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
const headerHeight = 30;
const width = 800;

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
      maxWidth="false"
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
            className={classes.stashTable}
          >
            <Column className={classes.stashColumn} label="Module" dataKey="module" width={200} />
            <Column className={classes.stashColumn}  label="Entity" dataKey="entity" width={200} />
            <Column className={classes.stashColumn}  label="Name" dataKey="itemName" width={200} />
          </Table>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompareDialog;