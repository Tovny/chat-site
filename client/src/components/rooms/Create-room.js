import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import {
  createRoomError$,
  useObservableLocal,
  createNewRoom,
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

const CreateRoom = ({ setActiveMenu }) => {
  const classes = roomStyles();

  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);

  const newRoomRef = useRef(null);

  useObservableLocal(createRoomError$, setError);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      createNewRoom(newRoomRef.current.value, user);
    } catch (err) {
      setError(err);
    }
  };

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
