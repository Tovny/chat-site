const activeUsersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ACTIVE_USERS": {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};

export default activeUsersReducer;
