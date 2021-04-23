let currentUser;

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER": {
      currentUser = action.payload;
      return action.payload;
    }
    case "SET_USER_ROOMS": {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

module.exports = { userReducer, currentUser };
