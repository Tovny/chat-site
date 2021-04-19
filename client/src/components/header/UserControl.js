import { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";

import firebase from "firebase/app";
import "firebase/auth";

import { IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";

import {
  Button,
  Menu,
  Typography,
  Avatar,
  Zoom,
  Tooltip,
  Hidden,
} from "@material-ui/core";

import headerStyles from "./Header-styles";

import SignUp from "./SignUp";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import PasswordReset from "./PasswordReset";

const UserControl = () => {
  const classes = headerStyles();
  const user = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
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
          <Hidden xsDown>
            <Tooltip title={"Logout"} arrow TransitionComponent={Zoom}>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  firebase.auth().signOut();
                }}
                color="secondary"
                ref={buttonRef}
                size="small"
              >
                <Typography variant="subtitle2">{user.username}</Typography>
                <Avatar
                  variant="rounded"
                  src={user.avatar}
                  alt={user.username}
                  className={classes.userAvatar}
                ></Avatar>
              </Button>
            </Tooltip>
          </Hidden>
          <Hidden smUp>
            <Button
              onClick={() => {
                setSignOutOpen(true);
              }}
              color="secondary"
              ref={buttonRef}
              size="small"
            >
              <Avatar
                variant="rounded"
                src={user.avatar}
                alt={user.username}
                className={classes.userAvatar}
              ></Avatar>
            </Button>
          </Hidden>
        </IfFirebaseAuthed>
      )}
      <IfFirebaseUnAuthed>
        {user ? (
          <Tooltip
            title={`You can chat as ${user.username}`}
            arrow
            placement="left"
            TransitionComponent={Zoom}
          >
            <Button
              onClick={() => setMenuOpen(true)}
              color="secondary"
              ref={buttonRef}
              size="small"
            >
              Sign In
            </Button>
          </Tooltip>
        ) : (
          <Button
            onClick={() => setMenuOpen(true)}
            color="inherit"
            ref={buttonRef}
          >
            Sign In
          </Button>
        )}
      </IfFirebaseUnAuthed>
      <Menu
        anchorEl={buttonRef.current}
        onClose={() => setMenuOpen(false)}
        keepMounted
        open={menuOpen}
      >
        {activePage === "signIn" && <SignIn setActivePage={setActivePage} />}
        {activePage === "signUp" && <SignUp setActivePage={setActivePage} />}
        {activePage === "passwordReset" && (
          <PasswordReset setActivePage={setActivePage} />
        )}
      </Menu>
      <Menu
        anchorEl={buttonRef.current}
        onClose={() => setSignOutOpen(false)}
        keepMounted
        open={signOutOpen}
      >
        <SignOut setSignOutOpen={setSignOutOpen} />
      </Menu>
    </>
  );
};

export default UserControl;
