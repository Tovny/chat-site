import { AppBar, Typography, Toolbar } from "@material-ui/core";
import headerStyles from "./Header-styles";

import UserControl from "./UserControl";

import { useSelector, useDispatch } from "react-redux";
import setOpenRoomDrawer from "../../redux/actions/rooms-drawer-actions";

const Header = () => {
  const dispatch = useDispatch();
  const classes = headerStyles();

  const room = useSelector((state) => state.room);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar className={classes.headerToolbar}>
        <Typography
          variant="h5"
          onClick={() => dispatch(setOpenRoomDrawer(true))}
        >
          {room}
        </Typography>
        <UserControl />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
