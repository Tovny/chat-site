import { useEffect } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import { useDispatch } from "react-redux";
import setUser from "./redux/actions/user-actions";
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

import { CssBaseline, Grid } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();

  useObservable(login$, setUser);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        sendLogin(user.uid, user);
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
      if (newUser.rooms && oldUser.rooms !== newUser.rooms) {
        const newRoom = newUser.rooms[newUser.rooms.length - 1];
        dispatch(setRoom(newRoom)); //naj da noveega usera v global
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
      <CssBaseline />
      <div className="App">
        <Header />
        <Grid container direction="row" justify="center">
          <Grid item xs={2}>
            <Rooms />
          </Grid>
          <Grid item xs={10}>
            <ChatWindow />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default App;
