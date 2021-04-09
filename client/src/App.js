import { useEffect } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import { useDispatch } from "react-redux";
import setUser from "./redux/actions/user";

import { useObservable, login$, sendLogin, sendLogout } from "./websocket";

import ChatWindow from "./components/chat-window/Chat-window";
import Header from "./components/header/Header";
import Rooms from "./components/Rooms";

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
        sendLogout(randomUser);
      }
    });

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
