
export class DatabaseUnconnectedError extends Error {
  constructor() {
    super("Database disconnected");
  }
}
export class InvalidUserNameError extends Error {
  constructor(userName: string) {
    super(`Can't find specified user name ${userName}`);
  }
}