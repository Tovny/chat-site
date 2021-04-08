const activeUsersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ACTIVE_USERS": {
      let unique = true;

      state.forEach((user) => {
        if (user.uid === action.payload[0].uid) unique = false;
      });

      if (unique) {
        return [...state, ...action.payload];
      } else {
        return state;
      }
    }
    case "REMOVE_ACTIVE_USER": {
      return state.filter((user) => user.uid !== action.payload);
    }
    default:
      return state;
  }
};

export default activeUsersReducer;
