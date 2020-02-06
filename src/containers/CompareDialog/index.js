import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import StyledButton from 'components/StyledButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
// style
import useStyles from './style';

const height = 400;
const rowHeight = 50;
const headerHeight = 30;
const width = 800;

const CompareDialog = ({ isModalShown, stashesList, hideModal }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const cellRenderer= ({ cellData, rowIndex, dataKey }) => (
    <ButtonGroup
      variant="contained"
      size="small"
      color="primary"
      aria-label="contained primary button group"
      className={classes.buttonGroup}
    >
      <StyledButton>Submit</StyledButton>
      <StyledButton>Revert</StyledButton>
    </ButtonGroup>
  )

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
            <Column className={classes.stashColumn} label="Module" dataKey="module" width={150} />
            <Column className={classes.stashColumn} label="Entity" dataKey="entity" width={150} />
            <Column className={classes.stashColumn} label="Name" dataKey="itemName" width={180} />
            <Column className={classes.stashColumn} label="Index" dataKey="panelIndex" width={60} />
            <Column
              className={classes.stashColumn}
              label="Actions"
              dataKey="itemName"
              cellRenderer={cellRenderer}
              width={260}
            />
          </Table>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CompareDialog;