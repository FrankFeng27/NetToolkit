
import { combineReducers } from "redux";
import LoginReducer from "../LoginDialog/LoginSlice";

export default combineReducers({
  login: LoginReducer
});
