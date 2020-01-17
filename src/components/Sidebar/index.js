import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: 112,
    height: `calc(100vh - 112px)`
  },
  listItemText: {
    fontSize: 20,
  },
}));

const Sidebar = ({ match, data }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        {Array.isArray(data) && data.map((navItem, index) => (
          <ListItem button key={`navitem-${index}`} component={NavLink} to={navItem.link}>
            {
              match.params.entity === navItem.link ?
                <ListItemText
                  primary={navItem.name}
                  classes={{ primary: classes.listItemText }}
                />
              :
                <ListItemText
                  secondary={navItem.name}
                  classes={{ secondary: classes.listItemText }}
                />
            }
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default withRouter(Sidebar);
