import { AppBar, Typography, Toolbar } from "@material-ui/core";
import headerStyles from "./Header-styles";

import UserControl from "./UserControl";

const Header = () => {
  const classes = headerStyles();

  return (
    <AppBar position="sticky">
      <Toolbar className={classes.headerToolbar}>
        <Typography variant="h5">Global room</Typography>
        <UserControl />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
