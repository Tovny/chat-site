const roomReducer = (state = "Global Chat", action) => {
  switch (action.type) {
    case "SET_ROOM": {
      if (action.payload) {
        return action.payload;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export default roomReducer;
