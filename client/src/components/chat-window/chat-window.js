import { useEffect } from "react";

import { useSelector } from "react-redux";
import setMessages from "../../redux/actions/message-actions";
import setActiveUsers from "../../redux/actions/active-users-actions";

import {
  messages$,
  activeUsers$,
  useObservable,
  getMessages,
  sendMessage,
} from "../../websocket";

import Messages from "./messages";
import ActiveUsers from "./active-users";

import { Container, Grid } from "@material-ui/core";

const ChatWindow = () => {
  const messages = useSelector((state) => state.messages);
  const activeUsers = useSelector((state) => state.activeUsers);

  useObservable(messages$, setMessages);
  useObservable(activeUsers$, setActiveUsers);

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={10}>
          <Messages messages={messages} sendMessage={sendMessage} />
        </Grid>
        <Grid item xs={2}>
          <ActiveUsers activeUsers={activeUsers} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatWindow;
