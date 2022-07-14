
import { LoginErrorType } from "../plugins/express/expresser";

const ErrorArray = [
    LoginErrorType.ERROR_USERNAME_EXISTED,
    LoginErrorType.ERROR_USERNAME_NOT_EXISTED,
    LoginErrorType.ERROR_EMAIL_EXISTED,
    LoginErrorType.ERROR_EMAIL_NOT_EXISTED,
    LoginErrorType.ERROR_USERNAME_OR_EMAIL_NOT_EXISTED,
    LoginErrorType.ERROR_USERNAME_EMPTY,
    LoginErrorType.ERROR_EMAIL_EMPTY,
    LoginErrorType.ERROR_PASSWORD_EMPTY,
    LoginErrorType.ERROR_UNKNOWN_ERROR,
    LoginErrorType.ERROR_INCORRECT_USERNAME_OR_PWD,
    // Last error
    LoginErrorType.ERROR_UNKNOWN
];

const userErrorToStatus = (type: LoginErrorType) => {
  if (type === LoginErrorType.ERROR_SUCCESS) {
    return 200;
  }
  const errorBase = 260;
  for (let ix = 0; ix < ErrorArray.length; ix += 1) {
    if (ErrorArray[ix] === type) {
      return errorBase + ix;
    }
  }
  return ErrorArray[ErrorArray.length-1] + errorBase;
};

export = userErrorToStatus;
