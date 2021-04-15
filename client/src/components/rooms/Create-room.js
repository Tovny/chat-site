import { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";

import { createRoomError$, createNewRoom } from "../../websocket";

import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import roomStyles from "./RoomStyles";

const CreateRoom = ({ setActiveMenu }) => {
  const classes = roomStyles();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const user = useSelector((state) => state.user);

  const newRoomRef = useRef(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setDisabled(true);
      setError(null);
      createNewRoom(newRoomRef.current.value, user);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    setDisabled(false);
  }, [error]);

  useEffect(() => {
    createRoomError$.subscribe((err) => setError(err));

    return () => {
      createRoomError$.unsubscribe();
    };
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create New Room
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="room"
            label="New Room"
            name="room"
            autoFocus
            inputRef={newRoomRef}
          />
          <Link
            href="#"
            variant="body2"
            onClick={() => setActiveMenu("joinRoom")}
          >
            Join Room
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disabled}
            className={classes.submit}
          >
            Create new Room
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CreateRoom;
