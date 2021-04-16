import { combineReducers } from "redux";
import messagesReducer from "./messages";
import activeUsersReducer from "./active-users";
import userReducer from "./user";
import roomReducer from "./room";
import roomDrawerReducer from "./room-drawer";

const rootReducer = combineReducers({
  messages: messagesReducer,
  activeUsers: activeUsersReducer,
  user: userReducer,
  room: roomReducer,
  roomDrawer: roomDrawerReducer,
});

export default rootReducer;
