import { useState, useRef, useEffect } from "react";

import {
  Button,
  Menu,
  Typography,
  Avatar,
  Zoom,
  Tooltip,
} from "@material-ui/core";

import headerStyles from "./Header-styles";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";

import { useSelector } from "react-redux";

import firebase from "firebase/app";

const UserControl = () => {
  const classes = headerStyles();
  const user = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("signIn");
  const buttonRef = useRef(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      setMenuOpen(false);
    });
  }, []);

  useEffect(() => {
    setActivePage("signIn");
  }, [menuOpen]);

  return (
    <>
      {user && (
        <IfFirebaseAuthed>
          <Tooltip title={"Logout"} arrow TransitionComponent={Zoom}>
            <Button
              onClick={() => {
                setMenuOpen(false);
                firebase.auth().signOut();
              }}
              color="inherit"
              ref={buttonRef}
            >
              <Typography variant="subtitle1">{user.username}</Typography>
              <Avatar
                variant="rounded"
                src={user.avatar}
                alt={user.username}
                className={classes.userAvatar}
              ></Avatar>
            </Button>
          </Tooltip>
        </IfFirebaseAuthed>
      )}
      <IfFirebaseUnAuthed>
        <Button
          onClick={() => setMenuOpen(true)}
          color="inherit"
          ref={buttonRef}
        >
          Sign In
        </Button>
      </IfFirebaseUnAuthed>
      <Menu
        anchorEl={buttonRef.current}
        onClose={() => setMenuOpen(false)}
        keepMounted
        open={menuOpen}
      >
        {activePage === "signIn" ? (
          <SignIn setActivePage={setActivePage} />
        ) : (
          <SignUp setActivePage={setActivePage} />
        )}
      </Menu>
    </>
  );
};

export default UserControl;
