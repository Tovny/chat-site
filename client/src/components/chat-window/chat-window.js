import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/user-actions";
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
  userSubject$,
  roomSubject$,
  messages$,
  activeUsers$,
  userLeave$,
  useObservable,
  getMessages,
  sendMessage,
} from "../../websocket";

import Messages from "./Messages";
import ActiveUsers from "./Active-users";

import { Grid, Paper, Hidden, Typography } from "@material-ui/core";
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

    roomSubject$.next(room);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    userSubject$.next(user);
  }, [user]);

  return (
    <Grid container className={classes.chatWindow}>
      <Grid item xs={12} sm={9} className={classes.messageWindow}>
        <Messages
          messages={messages}
          sendMessage={sendMessage}
          user={user}
          room={room}
          classes={classes}
        />
      </Grid>
      <Hidden xsDown>
        <Grid item sm={3} className={classes.activeUsersContainer}>
          <Typography
            variant="h6"
            align="center"
            className={classes.activesHeading}
          >
            Active Users
          </Typography>
          <Paper variant="outlined" square className={classes.activeUsers}>
            <ActiveUsers activeUsers={activeUsers} classes={classes} />
          </Paper>
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default ChatWindow;
