export const setMessages = (payload) => {
  return {
    type: "SET_MESSAGES",
    payload,
  };
};

export const resetMessages = () => {
  return {
    type: "RESET_MESSAGES",
  };
};
