import { useState, useRef } from "react";

import { Button } from "@material-ui/core";

const JoinRoom = () => {
  const buttonRef = useRef(null);
  return <Button ref={buttonRef}>Join Room</Button>;
};

export default JoinRoom;
