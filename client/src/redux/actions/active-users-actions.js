export const setActiveUsers = (payload) => {
  return {
    type: "SET_ACTIVE_USERS",
    payload,
  };
};

export const removeActiveUser = (payload) => {
  return {
    type: "REMOVE_ACTIVE_USER",
    payload,
  };
};

export const resetActiveUsers = () => {
  return {
    type: "RESET_ACTIVE_USER",
  };
};
