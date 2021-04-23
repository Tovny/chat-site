const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER": {
      return action.payload;
    }
    case "SET_USER_ROOMS": {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

export default userReducer;
