import { combineReducers } from "redux";
import messagesReducer from "./messages";
import activeUsersReducer from "./active-users";
import userReducer from "./user";
import roomReducer from "./room";

const rootReducer = combineReducers({
  messages: messagesReducer,
  activeUsers: activeUsersReducer,
  user: userReducer,
  room: roomReducer,
});

export default rootReducer;
