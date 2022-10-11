
var createLogger = require("../../plugins/commutils/logger");

export class JobBase {
  logger: any;
  constructor(logFile: string) {
    this.logger = createLogger(logFile);
  }
  logInfo(msg: string) {
    this.logger.log('info', msg);
  }
  logError(msg: string) {
    this.logger.log('error', msg);
  }
}

