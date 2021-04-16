import { useEffect } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import { useDispatch } from "react-redux";
import { setUser, setUserRooms } from "./redux/actions/user-actions";
import setRoom from "./redux/actions/room-actions";

import {
  useObservable,
  login$,
  userSubject$,
  roomSubject$,
  sendLogin,
  sendUserChange,
  sendRoomChange,
} from "./websocket";

import ChatWindow from "./components/chat-window/Chat-window";
import Header from "./components/header/Header";
import Rooms from "./components/rooms/Rooms";

import { CssBaseline, Container, Grid, Hidden } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import mainTheme from "./themes/main";
import appStyles from "./AppStyles";

function App() {
  const dispatch = useDispatch();
  const classes = appStyles();

  useObservable(login$, setUserRooms);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const signedUser = {
          username: user.displayName,
          uid: user.uid,
          avatar: user.photoURL,
        };
        dispatch(setUser(signedUser));

        sendLogin(user.uid, signedUser);
      } else {
        const randomUsername = `User.${Math.ceil(Math.random() * 10000)}`;
        const randomUser = {
          username: randomUsername,
          uid: randomUsername,
          avatar: null,
        };
        dispatch(setUser(randomUser));
        dispatch(setRoom("Global Chat"));
      }
    });

    userSubject$.subscribe(([oldUser, newUser]) => {
      if (
        oldUser.username !== newUser.username ||
        oldUser.uid !== newUser.uid
      ) {
        sendUserChange(oldUser, newUser);
        dispatch(setUser(newUser));
      }
    });

    roomSubject$.subscribe(([oldRoom, newRoom]) => {
      sendRoomChange(oldRoom, newRoom);
    });

    return () => {
      userSubject$.unsubscribe();
      roomSubject$.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <div className="App">
          <Header />
          <Container maxWidth="xl" className={classes.appContainer}>
            <Grid container direction="row" alignItems="center">
              <Hidden smDown>
                <Grid item md={3}>
                  <Rooms />
                </Grid>
              </Hidden>
              <Grid item xs={12} md={9}>
                <ChatWindow />
              </Grid>
            </Grid>
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
