import { format, isToday, isTomorrow, isYesterday } from "date-fns";

import { useState, useEffect, useRef } from "react";

import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Grid,
  Avatar,
} from "@material-ui/core";

import useMessageStyles from "./chat-window-styles";

const Messages = ({ messages, sendMessage }) => {
  const classes = useMessageStyles();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(`User ${Math.ceil(Math.random() * 1000)}`);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container.lastChild)
      container.lastChild.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Container className={classes.messagesContainer} ref={containerRef}>
        {messages?.map((msg, i) => (
          <Message
            message={msg}
            prevMessage={messages[i - 1]}
            index={i}
            classes={classes}
          />
        ))}
      </Container>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage({ msg: message, user: user });
          setMessage("");
        }}
      >
        <ButtonGroup fullWidth>
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            placeholder="type here"
            onChange={(e) => setMessage(e.target.value)}
          ></TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Submit
          </Button>
        </ButtonGroup>
      </form>
    </>
  );
};

const Message = ({ message, prevMessage, index, classes }) => {
  const [visible, setVisible] = useState(false);
  const messageDate = new Date(message.time["_seconds"] * 1000);

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      spacing={1}
      key={index}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {index !== 0 && prevMessage.user === message.user ? (
        <>
          <Grid
            item
            xs={1}
            className={
              visible ? classes.visiblePostTime : classes.hiddenPostTime
            }
          >
            {formatDate(messageDate)}
          </Grid>
          <Grid item xs={11}>
            <Typography variant="subtitle1" className={classes.messageText}>
              {message.msg}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={1}>
            <Avatar
              alt={`${message.user} avatar`}
              src={message.avatar}
            ></Avatar>
          </Grid>
          <Grid item xs={11}>
            <Grid container direction="column">
              <Paper
                square
                variant="outlined"
                className={classes.postHeadingPaper}
              >
                <Grid container alignItems="center">
                  <Typography
                    variant="subtitle1"
                    className={classes.postUsername}
                  >
                    {message.user}
                  </Typography>
                  <Typography variant="subtitle2" className={classes.postTime}>
                    {formatDate(messageDate, true)}
                  </Typography>
                </Grid>
              </Paper>
              <Grid item>
                <Typography variant="subtitle1" className={classes.messageText}>
                  {message.msg}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

const formatDate = (date, header = false) => {
  if (isToday(date) && header) {
    return format(date, "'Today', HH:mm");
  } else if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return format(date, "'Yesterday'");
  } else {
    return format(date, "dd.LL.yyyy");
  }
};

export default Messages;
