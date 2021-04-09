import { useState, useRef } from "react";

import { Button, Menu, Typography, Avatar } from "@material-ui/core";

import headerStyles from "./Header-styles";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";

import { useSelector } from "react-redux";

const UserControl = () => {
  const classes = headerStyles();
  const user = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit" ref={buttonRef}>
        <IfFirebaseAuthed>
          {() => (
            <>
              <Typography variant="subtitle1">{user.username}</Typography>
              <Avatar
                variant="rounded"
                src={user.avatar}
                alt={user.username}
                className={classes.userAvatar}
              ></Avatar>
            </>
          )}
        </IfFirebaseAuthed>
        <IfFirebaseUnAuthed>{() => "Sign In"}</IfFirebaseUnAuthed>
      </Button>
      <Menu
        anchorEl={buttonRef.current}
        onClose={handleClose}
        keepMounted
        open={menuOpen}
      >
        <SignIn />
      </Menu>
    </>
  );
};

export default UserControl;
