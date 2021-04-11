import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import setUser from "../../redux/actions/user-actions";
import {
  setMessages,
  resetMessages,
} from "../../redux/actions/message-actions";
import {
  setActiveUsers,
  removeActiveUser,
  resetActiveUsers,
} from "../../redux/actions/active-users-actions";

import {
  messages$,
  activeUsers$,
  userLeave$,
  useObservable,
  getMessages,
  sendMessage,
} from "../../websocket";

import Messages from "./Messages";
import ActiveUsers from "./Active-users";

import { Container, Grid, Paper } from "@material-ui/core";
import useMessageStyles from "./Chat-window-styles";

const ChatWindow = () => {
  const dispatch = useDispatch();

  const classes = useMessageStyles();

  const messages = useSelector((state) => state.messages);
  const activeUsers = useSelector((state) => state.activeUsers);
  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);

  useObservable(messages$, setMessages);
  useObservable(activeUsers$, setActiveUsers);
  useObservable(userLeave$, removeActiveUser);

  useEffect(() => {
    if (!user) {
      const randomUsername = `User.${Math.ceil(Math.random() * 10000)}`;
      const randomUser = {
        username: randomUsername,
        uid: randomUsername,
        avatar: null,
      };
      dispatch(setUser(randomUser));

      getMessages(randomUser, room);
    } else {
      getMessages(user, room);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(resetMessages());
      dispatch(resetActiveUsers());
      getMessages(user, room);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <Container maxWidth="xl" className={classes.chatWindow}>
      <Grid container>
        <Grid item xs={8} className={classes.messageWindow}>
          <Messages
            messages={messages}
            sendMessage={sendMessage}
            user={user}
            room={room}
            classes={classes}
          />
        </Grid>
        <Paper xs={4} variant="outlined" square className={classes.activeUsers}>
          <ActiveUsers activeUsers={activeUsers} classes={classes} />
        </Paper>
      </Grid>
    </Container>
  );
};

export default ChatWindow;
