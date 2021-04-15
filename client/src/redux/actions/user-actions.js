export const setUser = (payload) => {
  return {
    type: "SET_USER",
    payload,
  };
};

export const setUserRooms = (payload) => {
  return {
    type: "SET_USER_ROOMS",
    payload,
  };
};
