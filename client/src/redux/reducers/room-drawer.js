const roomDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_OPEN_ROOM_DRAWER": {
      return action.payload;
    }
    default:
      return state;
  }
};

export default roomDrawerReducer;
