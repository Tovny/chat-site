import { Paper } from "@material-ui/core";

import { useSelector } from "react-redux";

const Rooms = () => {
  const user = useSelector((state) => state.user);
  return (
    <Paper
      style={{ justifySelf: "right", padding: "0 1rem" }}
      variant="outlined"
      square
    >
      <h2>subbed rooms</h2>
      {user && user.rooms && user.rooms.map((room) => <h5>{room}</h5>)}
    </Paper>
  );
};

export default Rooms;
