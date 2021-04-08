import { useState } from "react";

import { Button, Menu, Typography, Avatar } from "@material-ui/core";

import headerStyles from "./Header-styles";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";

import { useSelector } from "react-redux";

const UserControl = () => {
  const classes = headerStyles();
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IfFirebaseAuthed>
        {() => (
          <Button onClick={handleClick}>
            <Typography variant="h6">{user.username}</Typography>
            <Avatar
              src={user.avatar}
              alt={user.username}
              className={classes.userAvatar}
            ></Avatar>
          </Button>
        )}
      </IfFirebaseAuthed>
      <IfFirebaseUnAuthed>
        {() => <Button onClick={handleClick}>Sign In</Button>}
      </IfFirebaseUnAuthed>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <SignIn />
      </Menu>
    </>
  );
};

export default UserControl;
