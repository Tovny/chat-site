import { useEffect } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import setUser from "./redux/actions/user";

import { useObservable, login$, sendLogin, sendLogout } from "./websocket";

import ChatWindow from "./components/chat-window/Chat-window";
import Header from "./components/header/Header";
import Rooms from "./components/Rooms";

import { CssBaseline, Grid } from "@material-ui/core";

function App() {
  useObservable(login$, setUser);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) sendLogin(user.uid, user);
    });
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
