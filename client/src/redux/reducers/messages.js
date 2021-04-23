const messagesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_MESSAGES": {
      return [...state, ...action.payload];
    }
    case "RESET_MESSAGES": {
      return [];
    }
    default:
      return state;
  }
};

export default messagesReducer;
