import { useState, useRef, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import setRoom from "../../redux/actions/room-actions";

import { roomSubject$ } from "../../websocket";

import {
  Button,
  ButtonGroup,
  Container,
  Menu,
  Paper,
  Typography,
} from "@material-ui/core";

import CreateRoom from "./Create-room";
import JoinRoom from "./Join-room";

const Rooms = () => {
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("createRoom");
  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);

  const buttonGroupRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [room]);

  return (
    <Container style={{ justifySelf: "right", padding: "1rem 1rem" }}>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() => {
          if (room !== "global-messages") roomSubject$.next("global-messages");
          dispatch(setRoom("global-messages"));
        }}
      >
        Global Chat
      </Button>
      <Paper
        variant="outlined"
        style={{ height: "calc(100vh - 15rem)", overflowY: "auto" }}
      >
        <Typography variant="body1">Subscribed Rooms</Typography>
        <ButtonGroup orientation="vertical" fullWidth>
          {user &&
            user.rooms &&
            user.rooms.map((subbedRoom) => {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={room === subbedRoom}
                  onClick={() => {
                    roomSubject$.next(subbedRoom);
                    dispatch(setRoom(subbedRoom));
                  }}
                >
                  {subbedRoom}
                </Button>
              );
            })}
        </ButtonGroup>
      </Paper>
      <ButtonGroup fullWidth ref={buttonGroupRef}>
        <Button>Join Room</Button>
        <Button
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          Create New Room
        </Button>
      </ButtonGroup>
      <Menu
        anchorEl={buttonGroupRef.current}
        onClose={() => setMenuOpen(false)}
        keepMounted
        open={menuOpen}
      >
        {activeMenu === "createRoom" && (
          <CreateRoom setActiveMenu={setActiveMenu} />
        )}
        {activeMenu === "joinRoom" && (
          <JoinRoom setActiveMenu={setActiveMenu} />
        )}
      </Menu>
    </Container>
  );
};

export default Rooms;
