import { Paper } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import setRoom from "../redux/actions/room-actions";

import { roomSubject$ } from "../websocket";

const Rooms = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);

  return (
    <Paper
      style={{ justifySelf: "right", padding: "0 1rem" }}
      variant="outlined"
      square
    >
      <h2>subbed rooms</h2>
      <h5
        onClick={() => {
          if (room !== "global-messages") roomSubject$.next("global-messages");
          dispatch(setRoom("global-messages"));
        }}
      >
        GLOOBAL
      </h5>
      <h5
        onClick={() => {
          if (room !== "notGlobal") roomSubject$.next("notGlobal");
          dispatch(setRoom("notGlobal"));
        }}
      >
        notGloba
      </h5>
      <h5
        onClick={() => {
          if (room !== "prvi") roomSubject$.next("prvi");
          dispatch(setRoom("prvi"));
        }}
      >
        prvi
      </h5>
    </Paper>
  );
};

export default Rooms;
