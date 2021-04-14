import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import {
  joinRoomError$,
  useObservableLocal,
  joinNewRoom,
} from "../../websocket";

import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import roomStyles from "./RoomStyles";

const JoinRoom = ({ setActiveMenu }) => {
  const classes = roomStyles();

  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);

  const newRoomRef = useRef(null);

  useObservableLocal(joinRoomError$, setError);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      joinNewRoom(newRoomRef.current.value, user);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Join Room
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="joinRoom"
            label="Join Room"
            name="joinRoom"
            autoFocus
            inputRef={newRoomRef}
          />
          <Link
            href="#"
            variant="body2"
            onClick={() => setActiveMenu("createRoom")}
          >
            Create New Room
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Join Room
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default JoinRoom;
