
import { combineReducers } from "redux";
import LoginReducer from "../LoginDialog/LoginSlice";
import SpeechReducer from "../Speech/SpeechSlice";

export default combineReducers({
  login: LoginReducer,
  speeches: SpeechReducer,
});
