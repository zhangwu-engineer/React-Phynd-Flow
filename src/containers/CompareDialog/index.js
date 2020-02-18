import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import StyledButton from 'components/StyledButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
// style
import useStyles from './style';
//heler
import { getNameFromID } from 'utils/helper';

const height = 400;
const rowHeight = 50;
const headerHeight = 30;
const width = 800;

const CompareDialog = ({
  isModalShown,
  stashesList,
  hideModal,
  submitCTA,
  submitOne,
  revertOne,
}) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const submitStash = cellData => {
    submitOne(cellData);
  }

  const revertStash = cellData => {
    revertOne(cellData);
  }

  const cellButtonRenderer= ({ cellData, rowIndex, dataKey }) => (
    <ButtonGroup
      variant="contained"
      size="small"
      color="primary"
      aria-label="contained primary button group"
      className={classes.buttonGroup}
    >
      <StyledButton onClick={() => submitStash(cellData)}>Submit</StyledButton>
      <StyledButton onClick={() => revertStash(cellData)}>Revert</StyledButton>
    </ButtonGroup>
  )

  const cellTextRenderer= ({ cellData, rowIndex, dataKey }) => (
      <Tooltip title={cellData} placement="top-end">
        <Typography className={classes.stashColumn}>{getNameFromID(cellData)}</Typography>
      </Tooltip>
  )

  const cellNumberRenderer= ({ cellData, rowIndex, dataKey }) => (
    <Typography className={classes.stashColumn}>
      { parseFloat(cellData) > -1 ? cellData+1 : '' }
    </Typography>
)

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={null}
    >
      <DialogTitle>
        <Typography>Compare</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        <Grid className={classes.tabInputContent} container>
          <Table
            width={width}
            height={height}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={stashesList ? stashesList.length : 0}
            rowGetter={({index}) => stashesList[index]}
            className={classes.stashTable}
          >
            <Column
              label="Module"
              dataKey="module"
              width={150}
              cellRenderer={cellTextRenderer}
            />
            <Column
              className={classes.stashColumn}
              label="Entity"
              dataKey="entity"
              width={150}
              cellRenderer={cellTextRenderer}
            />
            <Column
              className={classes.stashColumn}
              label="Index"
              dataKey="panelIndex"
              width={60} 
              cellRenderer={cellNumberRenderer}
            />
            <Column
              className={classes.stashColumn}
              label="Name"
              dataKey="itemName"
              width={180}
              cellRenderer={cellTextRenderer}
            />
            <Column
              className={classes.stashColumn}
              label="Actions"
              dataKey="itemName"
              width={260}
              cellDataGetter={({ rowData }) => rowData}
              cellRenderer={cellButtonRenderer}
            />
          </Table>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <StyledButton variant="contained" onClick={submitCTA} bgcolor="#577399">Submit All</StyledButton>
      </DialogActions>
    </Dialog>
  );
}

export default CompareDialog;