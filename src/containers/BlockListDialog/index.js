import React from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Column, Table } from 'react-virtualized';
// style
import useStyles from './style';

const height = 400;
const rowHeight = 40;
const headerHeight = 50;
const width = 500;

const BlockListDialog = ({ isModalShown, hideModal, blockedItems, addField }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

  const blockedItemsCopy = blockedItems && blockedItems.map((name, index) => {
    return {
      index,
      name
    }
  })
  const [unblockList, setUnblockList] = React.useState([]);
  const handleNewUnblockItem = (item, flag) => {
    const unblockListUpdate = _.clone(unblockList);
    if (flag) {
      unblockListUpdate.push(item);
    } else {
      _.remove(unblockListUpdate, function (toRemove) {
        return item === toRemove;
      });
    }
    setUnblockList(unblockListUpdate);
  };

  const cellTextRenderer= ({ cellData, rowIndex, dataKey }) => (
    <Grid
      item
      key={dataKey}
      onClick={() => {
        if (unblockList.indexOf(cellData) < 0) {
          handleNewUnblockItem(cellData, true);
        } else {
          handleNewUnblockItem(cellData, false);
        }
      }}
    >
      <Box className={unblockList.indexOf(cellData) < 0 ? classes.blockItem : classes.unblockItem}>
        <Typography className={classes.blockItemLabel}>{cellData}</Typography>
      </Box>
    </Grid>
  )

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className={classes.dialogContent}>
        <Grid className={classes.tabInputContent} container>
          <Table
            width={width}
            height={height}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={blockedItemsCopy ? blockedItemsCopy.length : 0}
            rowGetter={({index}) => blockedItemsCopy[index]}
            className={classes.blockTable}
          >
            <Column
              label="Add Fields"
              dataKey="name"
              width={width}
              cellRenderer={cellTextRenderer}
            />
          </Table>
        </Grid>
        <Grid container className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              addField(unblockList);
              hideModal();
            }}
          >
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

export default BlockListDialog;