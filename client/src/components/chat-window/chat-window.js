import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import setUser from "../../redux/actions/user";
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
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.messages);
  const activeUsers = useSelector((state) => state.activeUsers);
  const user = useSelector((state) => state.user);

  useObservable(messages$, setMessages);
  useObservable(activeUsers$, setActiveUsers);

  useEffect(() => {
    if (!user) {
      const randomUsername = `User.${Math.ceil(Math.random() * 1000)}`;
      const randomUser = {
        username: randomUsername,
        uid: randomUsername,
        avatar: null,
      };
      dispatch(setUser(randomUser));

      getMessages(randomUser);
    } else {
      getMessages(user);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container disableGutters>
      <Grid container>
        <Grid item xs={12} md={10}>
          <Messages messages={messages} sendMessage={sendMessage} user={user} />
        </Grid>
        <Grid item xs={false} md={2}>
          <Container>
            <ActiveUsers activeUsers={activeUsers} />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatWindow;
