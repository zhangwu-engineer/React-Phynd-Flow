import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  getIDFromName,
  getNameFromID
} from 'utils/helper';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
  box: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

const Sidebar = ({ fieldsReducer, match }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {Object.keys(fieldsReducer.fields).map((text, index) => (
          <ListItem button key={text} component={NavLink} to={getIDFromName(text)}>
            {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
            {
              getNameFromID(match.params.entity) === text ?
                <ListItemText primary={text} />
              :
                <ListItemText secondary={text} />
            }
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default withRouter(Sidebar);
