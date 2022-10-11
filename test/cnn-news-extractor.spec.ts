
import * as path from "path";
var assert = require("assert");
import { JobSqliteDatabase } from "../server/libs/cnn-news-extractor/extract-job";

class LoggerMocker {
  logError(msg: string) {
    console.log(msg);
  }
  logInfo(msg: string) {
    console.log(msg);
  }
}

describe("JobSqliteDatabase", () => {
  it("should test to query speech channel", async () => {
    const logger = new LoggerMocker();
    const rootDir = path.resolve(__dirname, "../");
    const database = new JobSqliteDatabase(rootDir, logger);
    const result = await database.getChannels();
    assert(result !== undefined);
    assert(result.length >= 0);
  });
});
