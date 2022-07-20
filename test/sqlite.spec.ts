
var sqlite3 = require("sqlite3");
var sqlite = require("sqlite");
var path = require("path");
var assert = require("assert");

describe("Sqlite - usage demo", () => {
  var database = null;
  before(done => {
    sqlite.open({
      driver: sqlite3.Database,
      filename: path.join(__dirname, "../server/temporary/NetToolkit.db")
    }).then((db) => {
      database = db;
      done();
    }).catch(err => {
      console.log(err);
      done();
    });
  });
  after(done =>{
      database.close();
      done();
  });

  it("should test basic query", (done) => {
    assert.ok(database !== null);
    done();
  });
  it("should test if not exists create table", async () => {
    try {
      let result = await database.run(`create table if not exists UserTable (
        id integer primary key,
        name varchar(150) not null unique,
        email varchar(255),
        password varchar(255) not null,
        pwdsalt varchar(150) not null,
        delimiter varchar(32) not null,
        version varchar(32) not null
      )`);
      result = await database.run(`create table if not exists MemoTable(
        id integer primary key,
        memo text,
        note varchar(255),
        notebook varchar(255),
        createdTime datetime,
        modifiedTime datetime,
        uid integer,
        plainText text,
        deleted tinyint(1) default 0,
        deletedOn datetime,
        editVersion int default 0,
        foreign key (uid) 
        references UserTable(id) on delete cascade
      )`);
    } catch (err) {
      console.log(err);
    }
  });
  it("should test add user and memo", async () => {
    try {
      let id1 = -1, id2 = -1;
      let result = await database.get("select * from UserTable where name=?", ["test"]);
      if (!result) {
        result = await database.run("insert into UserTable (name, email, password, pwdsalt, delimiter, version) values (?, ?, ?, ?, ?, ?)", [
          "test", "123@456.com", "123456", "balah", "+=-", "1.1"
        ]);
        assert(result != undefined);
        id1 = result.lastID;
      } else {
        id1 = result.id;
      }
      result = await database.get("select * from UserTable where name=?", ["test1"]);
      if (!result) {
        result = await database.run("insert into UserTable (name, email, password, pwdsalt, delimiter, version) values (?, ?, ?, ?, ?, ?)", [
          "test1", "12@3456.com", "123456", "balah", "+=-", "1.1"
        ]);
        assert(result != undefined);
        id2 = result.lastID;
      } else {
        id2 = result.id;
      }
      assert(id1 >= 0 && id2 >= 0);

      result = await database.get("select * from MemoTable where uid=? and note=?", [id1, "note1"]);
      if (!result) {
        result = await database.run("insert into MemoTable (memo, notebook, note, uid, createdTime, modifiedTime) values (?, ?, ?, ?, ?, ?)", [
          "memo 123456", "notebook1", "note1", id1, "2022-06-14 08:55:32", "2022-06-14 08:55:32"
        ]);
        assert(result !== undefined);
      }
      result = await database.get("select * from MemoTable where uid=? and note=?", [id2, "note1"]);
      if (!result) {
        result = await database.run("insert into MemoTable (memo, notebook, note, uid, createdTime, modifiedTime) values (?, ?, ?, ?, ?, ?)", [
          "memo 123456", "notebook1", "note1", id2, "2022-06-14 08:55:32", "2022-06-14 08:55:32"
        ]);
        assert(result !== undefined);
      }
    } catch (err) {

    }
  });
  it("should test to get memo by user and note", async () => {
    try {
      let user = "test", note = "note1";
      let result = await database.get("select u.name, m.notebook, m.note, m.memo from UserTable as u inner join MemoTable as m on u.id=m.uid where u.name=? and m.note=?", [
        user, note
      ]);
      assert(result !== undefined);
    } catch (err) {
      console.log(err);
    }
  });
});
