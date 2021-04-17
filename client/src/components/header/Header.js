import { useSelector, useDispatch } from "react-redux";
import setOpenRoomDrawer from "../../redux/actions/rooms-drawer-actions";
import setOpenActiveUsersDrawer from "../../redux/actions/active-users-drawer-actions";

import { AppBar, Button, Typography, Toolbar, Hidden } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import headerStyles from "./Header-styles";

import UserControl from "./UserControl";

const Header = () => {
  const dispatch = useDispatch();
  const classes = headerStyles();

  const room = useSelector((state) => state.room);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar className={classes.headerToolbar}>
        <Hidden mdDown>
          <Typography variant="h5">{room}</Typography>
        </Hidden>
        <Hidden mdUp>
          <Button
            color="secondary"
            size="small"
            onClick={() => dispatch(setOpenRoomDrawer(true))}
          >
            <div className={classes.roomsOpen}>
              <MenuIcon className={classes.roomsMenu} />
              <Typography variant="subtitle2">{room}</Typography>
            </div>
          </Button>
        </Hidden>
        <Hidden xsDown>
          <UserControl />
        </Hidden>
        <Hidden smUp>
          <div className={classes.usersOpen}>
            <UserControl />
            <PeopleAltIcon
              className={classes.usersMenu}
              onClick={() => dispatch(setOpenActiveUsersDrawer(true))}
            />
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
