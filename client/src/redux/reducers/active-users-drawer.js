const activeUsersDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_OPEN_ACTIVE_USERS_DRAWER": {
      return action.payload;
    }
    default:
      return state;
  }
};

export default activeUsersDrawerReducer;
