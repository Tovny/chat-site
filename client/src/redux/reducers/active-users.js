const activeUsersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ACTIVE_USERS": {
      if (action.payload.length > 1) {
        return action.payload;
      } else {
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
    }
    case "REMOVE_ACTIVE_USER": {
      return state.filter((user) => user.uid !== action.payload);
    }
    case "RESET_ACTIVE_USER": {
      return [];
    }
    default:
      return state;
  }
};

export default activeUsersReducer;
