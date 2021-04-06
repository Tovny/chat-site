import { combineReducers } from "redux";
import messagesReducer from "./messages";
import activeUsersReducer from "./active-users";
import userReducer from "./user";

const rootReducer = combineReducers({
  messages: messagesReducer,
  activeUsers: activeUsersReducer,
  user: userReducer,
});

export default rootReducer;
