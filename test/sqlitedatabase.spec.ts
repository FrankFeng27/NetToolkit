var assert = require("assert");
var path = require("path");
import SqliteDatabase from "../server/plugins/dataaccessor/sqlitedatabase";

describe("SqliteDatabase - tests", () => {
  let database: SqliteDatabase | undefined;
  let memoItemsToRemove: Array<{memo_id: number, user: string}> = [];
  before(async () => {
    database = new SqliteDatabase();
    await database.connect("", 0, "", "", "NetToolkitSpec", 0, {sqliteFolder: path.join(__dirname, "../server/temporary")});
    await database.createUserTableIfNotExisted();
    await database.createMemoTableIfNotExisted();
    await database.createSpeechTablesIfNotExisted();
  });
  after(async () => {
    for (let ix = 0; ix < memoItemsToRemove.length; ix++) {
      await database.removeMemo(memoItemsToRemove[ix].memo_id, memoItemsToRemove[ix].user);
    }
    await database.removeUser("test", "123456");
    await database.dropSpeechTables();
    await database.dropMemoTable();
    await database.dropUserTable();
    await database.disconnect();
  });
  it("should test add user", async () => {
    let existed = await database.isUserExisted("test");
    if (!existed) {
      let res = await database.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
      assert(res.id >= 0);
    }
    let result = await database.getUser("test");
    assert(result.id >= 0);
  });
  it("should test to add memo", async () => {
    let existed = await database.isUserExisted("test");
    if (!existed) {
      await database.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
    }
    let memoRecord = await database.getMemo("test", "notebook1", "note1");
    if (memoRecord.id < 0) {
      memoRecord = await database.addMemo("notebook1", "note1", "balahbalah", "test");
      memoItemsToRemove.push({memo_id: memoRecord.id, user: "test"});
    }
    assert(memoRecord.id >= 0);
  });
  it("should test to add and remove speech library", async () => {
    let existed = await database.isUserExisted("test");
    if (!existed) {
      await database.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
    }
    let record1 = await database.addSpeechLibrary("2022-6-27", "placeholder", "test", "{\"speed\": 1}");
    assert(record1.id >= 0);
    let record2 = await database.addSpeechLibrary("2022-6-28", "placeholder", "test", "{\"speed\": 1}");
    assert(record2.id >= 0);
    const recordGot = await database.getSpeechLibrary(record2.id);
    assert(recordGot.name === "2022-6-28");
    let records = await database.getSpeechLibraries("test");
    assert(records.length === 2);
    let res = await database.removeSpeechLibrary(record2.id);
    assert(res);
    records = await database.getSpeechLibraries("test");
    assert(records.length === 1);
    res = await database.removeSpeechLibrary(record1.id);
    assert(res);
    records = await database.getSpeechLibraries("test");
    assert(records.length === 0);
  });
  it("should test to update an existed library", async () => {
    let existed = await database.isUserExisted("test");
    if (!existed) {
      await database.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
    }
    let record1 = await database.addSpeechLibrary("2022-6-27", "placeholder", "test", "{\"speed\": 1}");
    assert(record1.id >= 0);
    let res = await database.updateSpeechLibrary(record1.id, "2022-6-27", "balahbalah", "test", "{}");
    assert(res !== undefined);
  });
  it("should test to rename an existed library", async () => {
    let existed = await database.isUserExisted("test");
    if (!existed) {
      await database.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
    }
    let record1 = await database.addSpeechLibrary("/memo/2022/2022-6-27", "placeholder", "test", "{\"speed\": 1}");
    assert(record1.id >= 0);
    await database.renameSpeechLibrary(record1.id, "/backup/2022/2022-6-27");
    const res = await database.getSpeechLibrary(record1.id);
    assert(res !== undefined);
    assert(res.name === "/backup/2022/2022-6-27")
  });
});
