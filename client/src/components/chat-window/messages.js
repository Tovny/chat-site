import { format, isToday, isYesterday } from "date-fns";

import { useState, useEffect, useRef } from "react";

import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Tooltip,
  Avatar,
  Zoom,
} from "@material-ui/core";

const Messages = ({ messages, sendMessage, user, room, classes }) => {
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container.lastChild)
      container.lastChild.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Container className={classes.messagesContainer}>
        <ul ref={containerRef} className={classes.messagesList}>
          {messages?.map((msg, i) => (
            <Message
              message={msg}
              prevMessage={messages[i - 1]}
              index={i}
              key={i}
              classes={classes}
            />
          ))}
        </ul>
      </Container>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (message && user)
            sendMessage(
              {
                msg: message,
              },
              user,
              room
            );
          setMessage("");
        }}
      >
        <ButtonGroup fullWidth className={classes.typingGroup}>
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            placeholder="Your message"
            color="primary"
            onChange={(e) => setMessage(e.target.value)}
          ></TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Send
          </Button>
        </ButtonGroup>
      </form>
    </>
  );
};

const Message = ({ message, prevMessage, index, classes }) => {
  const [visible, setVisible] = useState(false);
  const messageDate = new Date(message.time["_seconds"] * 1000);

  return index !== 0 && prevMessage.uid === message.uid ? (
    <li
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(!visible)}
      className={classes.messageLi}
    >
      <Tooltip
        title={formatDate(messageDate, false, true)}
        arrow
        TransitionComponent={Zoom}
      >
        <Typography
          variant="subtitle2"
          className={visible ? classes.visiblePostTime : classes.hiddenPostTime}
        >
          {formatDate(messageDate)}
        </Typography>
      </Tooltip>
      <Typography variant="subtitle1" className={classes.messageText}>
        {message.msg}
      </Typography>
    </li>
  ) : (
    <>
      <li className={classes.messageLi}>
        <Avatar
          alt={`${message.username} avatar`}
          src={message.avatar}
          className={classes.messageAvatar}
        ></Avatar>
        <Paper square variant="outlined" className={classes.postHeadingPaper}>
          <Typography variant="subtitle1" className={classes.postUsername}>
            {message.username}
          </Typography>
          <Tooltip
            title={formatDate(messageDate, false, true)}
            arrow
            TransitionComponent={Zoom}
          >
            <Typography variant="subtitle2" className={classes.postTime}>
              {formatDate(messageDate, true)}
            </Typography>
          </Tooltip>
        </Paper>
      </li>
      <li className={classes.messageLi}>
        <Typography variant="subtitle1" className={classes.messageText}>
          {message.msg}
        </Typography>
      </li>
    </>
  );
};

const formatDate = (date, header = false, tooltip = false) => {
  if (tooltip) {
    return format(date, "iii, LLL do yyyy 'at' HH:mm");
  } else if (isToday(date) && header) {
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
