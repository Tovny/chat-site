import { useSelector, useDispatch } from "react-redux";
import setRoom from "../redux/actions/room-actions";

import { roomSubject$, createNewRoom } from "../websocket";

import {
  Button,
  ButtonGroup,
  Container,
  Paper,
  Typography,
} from "@material-ui/core";

const Rooms = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);

  return (
    <Container style={{ justifySelf: "right", padding: "1rem 1rem" }}>
      <Paper square variant="outlined" style={{ height: "calc(100vh - 6rem)" }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => {
            if (room !== "global-messages")
              roomSubject$.next("global-messages");
            dispatch(setRoom("global-messages"));
          }}
        >
          Global Chat
        </Button>

        <Typography variant="body1">Subscribed Rooms</Typography>
        <ButtonGroup orientation="vertical" fullWidth>
          {user &&
            user.rooms &&
            user.rooms.map((subbedRoom) => {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (subbedRoom !== room) roomSubject$.next(subbedRoom);
                    dispatch(setRoom(subbedRoom));
                  }}
                >
                  {subbedRoom}
                </Button>
              );
            })}
        </ButtonGroup>
        <ButtonGroup fullWidth>
          <Button>Join Room</Button>
          <Button
            onClick={() => {
              createNewRoom("Neki Novi Room z Buttnom", user);
            }}
          >
            Create New Room
          </Button>
        </ButtonGroup>
      </Paper>
    </Container>
  );
};

export default Rooms;
