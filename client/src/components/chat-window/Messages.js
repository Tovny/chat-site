import { format, isToday, isYesterday } from "date-fns";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

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
import SendIcon from "@material-ui/icons/Send";

const Messages = ({ messages, sendMessage, user, room, classes }) => {
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(1);
  const [newMsgsWarning, setNewMsgsWarning] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (document.visibilityState !== "visible") {
      document.title = `(${newMessages}) Chat Site`;
      setNewMessages(newMessages + 1);
    }

    const container = containerRef.current;

    if (container.lastChild) {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setNewMsgsWarning(false);
            return;
          }
          if (entry.boundingClientRect.top > 0) {
            setNewMsgsWarning(true);
          }
        },
        {
          root: null,
          threshold: 0.75,
        }
      );

      const lastChild = container.lastChild;

      observer.observe(lastChild);

      return () => observer.unobserve(lastChild);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useLayoutEffect(() => {
    setTimeout(() => {
      const container = containerRef.current;
      if (container.lastChild) {
        container.lastChild.scrollIntoView({ behavior: "smooth" });
        container.scrollBy(0, 500);
      }
    }, 100);
  }, [messages]);

  const resetTitle = () => {
    if (document.visibilityState === "visible") {
      document.title = "Chat Site";
      setNewMessages(1);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", resetTitle);

    return () => document.removeEventListener("visibilitychange", resetTitle);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (message && user)
      sendMessage(
        {
          msg: message,
        },
        user,
        room
      );
    setMessage("");
  };

  return (
    <>
      <Container className={classes.messagesContainer}>
        {newMsgsWarning && (
          <Paper square elevation={3} className={classes.warningPaper}>
            <Typography variant="subtitle2">
              You are viewing older messages.
            </Typography>
          </Paper>
        )}
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
      <form onSubmit={onSubmit} className={classes.typingForm}>
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
            value={message}
            disabled={!message}
          >
            <SendIcon />
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
          {formatDate(messageDate, false, false, true)}
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
        ></Avatar>
        <Paper variant="outlined" className={classes.postHeadingPaper}>
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

const formatDate = (
  date,
  header = false,
  tooltip = false,
  sideDate = false
) => {
  if (tooltip) {
    return format(date, "iii, LLL do yyyy 'at' HH:mm");
  } else if (isToday(date) && header) {
    return format(date, "'Today', HH:mm");
  } else if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date) && !sideDate) {
    return format(date, "'Yesterday'");
  } else {
    return format(date, "dd.LL.");
  }
};

export default Messages;
