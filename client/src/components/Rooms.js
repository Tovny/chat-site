import { Paper } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import setRoom from "../redux/actions/room-actions";

const Rooms = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  return (
    <Paper
      style={{ justifySelf: "right", padding: "0 1rem" }}
      variant="outlined"
      square
    >
      <h2>subbed rooms</h2>
      <h5
        onClick={() => {
          dispatch(setRoom("global-messages"));
        }}
      >
        GLOOBAL
      </h5>
      <h5
        onClick={() => {
          dispatch(setRoom("notGlobal"));
        }}
      >
        notGloba
      </h5>
      <h5
        onClick={() => {
          dispatch(setRoom("prvi"));
        }}
      >
        prvi
      </h5>
    </Paper>
  );
};

export default Rooms;
