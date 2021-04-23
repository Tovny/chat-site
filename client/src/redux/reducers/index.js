import { combineReducers } from "redux";
import messagesReducer from "./messages";
import activeUsersReducer from "./active-users";
import userReducer from "./user";
import roomReducer from "./room";
import roomDrawerReducer from "./room-drawer";
import activeUsersDrawerReducer from "./active-users-drawer";

const rootReducer = combineReducers({
  messages: messagesReducer,
  activeUsers: activeUsersReducer,
  user: userReducer,
  room: roomReducer,
  roomDrawer: roomDrawerReducer,
  activeUsersDrawer: activeUsersDrawerReducer,
});

export default rootReducer;
