import { AppBar, Typography, Toolbar } from "@material-ui/core";
import headerStyles from "./Header-styles";

import UserControl from "./UserControl";

import { useSelector } from "react-redux";

const Header = () => {
  const classes = headerStyles();

  const room = useSelector((state) => state.room);

  return (
    <AppBar position="sticky" elevation={false}>
      <Toolbar className={classes.headerToolbar}>
        <Typography variant="h5">{room}</Typography>
        <UserControl />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
