import { useState, useRef, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import setRoom from "../../redux/actions/room-actions";
import setOpenRoomDrawer from "../../redux/actions/rooms-drawer-actions";

import { roomSubject$, newRoomSuccess$, useObservable } from "../../websocket";

import { IfFirebaseAuthed } from "@react-firebase/auth";

import {
  Button,
  ButtonGroup,
  Container,
  Drawer,
  Menu,
  Typography,
} from "@material-ui/core";

import roomStyles from "./RoomStyles";

import CreateRoom from "./Create-room";
import JoinRoom from "./Join-room";

const Rooms = () => {
  const dispatch = useDispatch();
  const classes = roomStyles();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("createRoom");
  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);
  const openDrawer = useSelector((state) => state.roomDrawer);

  const buttonGroupRef = useRef(null);

  useObservable(newRoomSuccess$, setRoom);

  useEffect(() => {
    setMenuOpen(false);
    roomSubject$.next(room);
  }, [room]);

  const RoomsElt = () => {
    return (
      <>
        <Button
          fullWidth
          variant={room === "Global Chat" ? "contained" : "outlined"}
          color="primary"
          size="large"
          className={classes.globalButton}
          onClick={() => {
            if (room !== "Global Chat") dispatch(setRoom("Global Chat"));
          }}
        >
          Global Chat
        </Button>
        <IfFirebaseAuthed>
          <Typography
            variant="h6"
            align="center"
            className={classes.subbedHeading}
          >
            Subscribed Rooms
          </Typography>
          <div className={classes.subbedRooms}>
            <ButtonGroup orientation="vertical" variant="text" fullWidth>
              {user &&
                user.rooms &&
                user.rooms.map((subbedRoom) => {
                  return (
                    <Button
                      size="small"
                      variant={room === subbedRoom ? "contained" : "text"}
                      color="primary"
                      disableElevation
                      key={subbedRoom}
                      className={classes.roomButton}
                      onClick={() => {
                        if (room !== subbedRoom) dispatch(setRoom(subbedRoom));
                      }}
                    >
                      {subbedRoom}
                    </Button>
                  );
                })}
            </ButtonGroup>
          </div>
          <ButtonGroup fullWidth ref={buttonGroupRef}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setMenuOpen(true);
                setActiveMenu("joinRoom");
              }}
            >
              Join Room
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setMenuOpen(true);
                setActiveMenu("createRoom");
              }}
            >
              Create New Room
            </Button>
          </ButtonGroup>
          <Menu
            anchorEl={buttonGroupRef.current}
            onClose={() => setMenuOpen(false)}
            open={menuOpen}
          >
            {activeMenu === "createRoom" && (
              <CreateRoom setActiveMenu={setActiveMenu} />
            )}
            {activeMenu === "joinRoom" && (
              <JoinRoom setActiveMenu={setActiveMenu} />
            )}
          </Menu>
        </IfFirebaseAuthed>
      </>
    );
  };

  return (
    <>
      <Container className={classes.roomsContainer}>
        <RoomsElt />
      </Container>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => dispatch(setOpenRoomDrawer(false))}
      >
        <Container className={classes.roomsDrawer}>
          <RoomsElt />
        </Container>
      </Drawer>
    </>
  );
};

export default Rooms;
