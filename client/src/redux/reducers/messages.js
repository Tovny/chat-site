//export let lastMessage;

const messagesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_MESSAGES": {
      //lastMessage = action.payload[action.payload.length - 1];
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
