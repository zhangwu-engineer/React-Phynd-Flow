import React from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Column, Table } from 'react-virtualized';
// style
import useStyles from './style';

const height = 400;
const rowHeight = 50;
const headerHeight = 30;
const width = 800;

const BlockListDialog = ({ isModalShown, hideModal, blockedItems, addField }) => {
  const classes = useStyles();
  const closeModal = () => {
    hideModal();
  }

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
    <Typography>cellData</Typography>
)

  return (
    <Dialog
      open={isModalShown}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
        <Typography>Add Fields</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid className={classes.tabInputContent} container>
          <Table
            width={width}
            height={height}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={blockedItems ? blockedItems.length : 0}
            rowGetter={({index}) => blockedItems[index]}
            className={classes.stashTable}
          >
            <Column
              label="Module"
              dataKey="module"
              width={150}
              cellRenderer={cellTextRenderer}
            />
          </Table>
          {_.map(blockedItems, (value, key) =>
            <Grid
              item
              xs={6}
              key={key}
              onClick={() => {
                if (unblockList.indexOf(value) < 0) {
                  handleNewUnblockItem(value, true);
                } else {
                  handleNewUnblockItem(value, false);
                }
              }}
            >
              <Box className={unblockList.indexOf(value) < 0 ? classes.blockItem : classes.unblockItem}>
                <Typography className={classes.blockItemLabel}>{value}</Typography>
              </Box>
            </Grid>
            )}
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