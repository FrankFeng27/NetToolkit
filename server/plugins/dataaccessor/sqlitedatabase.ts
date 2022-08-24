
var sqlite3 = require("sqlite3");
import { open, Database } from "sqlite";
import * as path from "path";
var strftime = require('strftime');
import { DatabaseUnconnectedError, InvalidUserNameError } from "../datatypes/errors";
import { IDatabase, IUserRecord, IMemoRecord, ISpeechLibraryRecord, emptyUser, emptyMemo, emptySpeechLibrary} from "./datainterfaces";

class SqliteDatabase implements IDatabase {
    private db: Database | undefined;
    constructor() {}
    connect(_host: string, _port: number, _user: string, _pwd: string, dbname: string, _timeout: number, xdata?: any): Promise<void> {
      return new Promise((resolve, reject) => {
          var dbFileName = path.join(xdata.sqliteFolder, dbname+".db");
          open({
            filename: dbFileName,
            driver: sqlite3.Database
          }).then(db => {
            this.db = db;
            resolve();
          }).catch(err => (reject(err)));
      });
    }
    isConnected(): boolean {
      return this.db !== undefined;
    }
    disconnect(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.db.close().then(() => resolve()).catch(err => reject(err));
      });
    }
    async createUserTableIfNotExisted(): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      try {
        await this.db.run(`create table if not exists UserTable (
          id integer primary key,
          name varchar(150) not null unique,
          email varchar(255),
          password varchar(255) not null,
          pwdsalt varchar(150) not null,
          delimiter varchar(32) not null,
          version varchar(32) not null
        )`);
        return true;
      } catch (err) {
        throw err;
      }
    }
    async createMemoTableIfNotExisted(): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      await this.db.run(`create table if not exists MemoTable(
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
      return true;
    }
    async createSpeechTablesIfNotExisted(): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      await this.db.run(`create table if not exists SpeechChannel (
        id integer primary key,
        name varchar(255),
        url varchar(255)
      )`);
      await this.db.run(`create table if not exists SpeechOrderedChannel (
        channelId integer,
        uid integer,
        foreign key (channelId) references SpeechChannel(id),
        foreign key (uid) references UserTable(id)
      )`);
      await this.db.run(`create table if not exists SpeechTemporaryLibraries (
        id integer primary key,
        name varchar(255),
        createdTime datetime,
        modifiedTime datetime,
        article text,
        channelId integer,
        foreign key(channelId) references SpeechChannel(id)
      )`);
      await this.db.run(`create table if not exists SpeechLibraries (
        id integer primary key,
        name varchar(255),
        content text,
        uid integer,
        configuration text,
        tempLibraryId integer,
        deleted tinyint(1) default 0,
        deletedOn datetime,
        foreign key (uid)
        references UserTable(id) on delete cascade,
        foreign key (tempLibraryId) 
        references SpeechTemporaryLibraries(id)
      )`);
    }
    async dropSpeechTables(): Promise<void> {
      await this.drop_table("SpeechLibraries");
      await this.drop_table("SpeechTemporaryLibraries");
      await this.drop_table("SpeechOrderedChannel");
      await this.drop_table("SpeechChannel");
    }
    async dropMemoTable() {
      await this.drop_table("MemoTable");
    }
    async dropUserTable() {
      await this.drop_table("UserTable");
    }
    async addUser(name: string, email: string, pwd: string, pwdsalt: string, delimiter: string, version: string): Promise<IUserRecord> {
      
      if (!this.isConnected()) {
        return emptyUser;
      }
      try {
        let result = await this.db.run("insert into UserTable (name, email, password, pwdsalt, delimiter, version) values (?, ?, ?, ?, ?, ?)", [
          name, email, pwd, pwdsalt, delimiter, version
        ]);
        return {id: result.lastID, name, password: pwd, pwdsalt, delimiter, version};
      } catch (err) {
        throw err;
      }
    }
    async getUser(name: string): Promise<IUserRecord> {
      if (!this.isConnected()) {
        return emptyUser;
      }
      try {
        let result = await this.db.get("select * from UserTable where name=?", [name]);
        if (!result || result.length === 0) {
          throw  new InvalidUserNameError(name);
        }
        return result;
      } catch (err) {
        throw err;
      }
    }
    async getEmail(email: string): Promise<IUserRecord> {
      if (!this.isConnected()) {
        return emptyUser;
      }
      try {
        let result = await this.db.get("select * from UserTable where email=?", [email]);
        if (!result || result.length === 0) {
          throw  Error("Can't find the specified email.");
        }
        return result;
      } catch (err) {
        throw err;
      }
    }
    async removeUser(name: string, pwd: string): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      try {
        let result = await this.getUser(name);
        if (!result || result.id === undefined || result.password != pwd) {
          throw new InvalidUserNameError(name);
        }
        await this.db.run("delete from UserTable where id=?", [result.id]);
        return true;
      } catch (err) {
        if (err instanceof InvalidUserNameError) {
          return false;
        }
        throw err;
      }
    }
    async isUserExisted(name: string): Promise<boolean> {
      if (!this.db) {
        return false;
      }
      try {
      var result = await this.db.get('select name from UserTable where name=?', [name]);

      return result !== undefined;
      } catch (err) {
        throw err; 
      }
    }
    async isUserNameValid(name: string, pwdSalted: string): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      try {
        let result = await this.db.get("select name from UserTable where name=?", [name]);
        if (!result || result.length === 0) {
          return false;
        }
        let record = result;
        return record["password"] === pwdSalted;
      } catch (err) {
        throw err;
      }
    }
    async addMemo(notebook: string, note: string, memo: string, user: string): Promise<IMemoRecord> {
      try {
        let uid = await this.get_user_id(user);
        let result = await this.getMemo(user, notebook, note);
        const tm = this.get_current_time();
        let mid = result.id;
        let createdTime = result.createdTime;
        if (mid === emptyMemo.id) {
          let result = await this.db.run("insert into MemoTable (memo, notebook, note, uid, createdTime, modifiedTime) values (?, ?, ?, ?, ?, ?)", [
            memo, notebook, note, uid, tm, tm
          ]);
          createdTime = tm;
          mid = result.lastID;
        } else {
          await this.db.run("update MemoTable set memo=?, deleted=?, modifiedTime=? where uid=? and notebook=? and note=?", [
            memo, 0, tm, uid, notebook, note
          ]);
        }
        return {id: mid, notebook, note, memo, createdTime, modifiedTime: tm, uid};
      } catch (err) {
        throw err;
      }
    }
    async updateMemo(notebook: string, note: string, memo: string, user: string): Promise<boolean> {
      try {
        await this.addMemo(notebook, note, memo, user);
        return true;
      } catch (err) {
        throw err;
      }
    }
    async removeMemo(memo_id: number, user: string): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      try {
        let uid = await this.get_user_id(user);
        let result = await this.db.get("select deleted, deletedOn from MemoTable where id=? and uid=?", [memo_id, uid]);
        if (!result || result.length === 0) {
          return false;
        }
        const tm = this.get_current_time();
        await this.db.run("update MemoTable set deleted=?, deletedOn=? where id=? and uid=?", [1, tm, memo_id, uid]);
        return true;
      } catch (err) {
        throw err;
      }
    }
    async getMemos(user: string): Promise<IMemoRecord[]> {
      if (!this.isConnected()) {
        return [];
      }
      try {
        var uid = await this.get_user_id(user);
        var result = await this.db.get("select * from MemoTable where uid=? and deleted=?", [uid, 0]);
        if (!result || result.length === 0) {
          return [];
        }
        const arr: IMemoRecord[] = [];
        for (let ix = 0; ix < result.length; ix++) {
          arr.push(result[ix] as IMemoRecord);
        }
        return arr;
      } catch (err) {
        throw err;
      }
    }
    async getMemo(user: string, notebook: string, note: string): Promise<IMemoRecord> {
      if (!this.isConnected()) {
        return emptyMemo;
      }
      try {
        let result = await this.db.get("select u.name, m.id as id, u.id as uid, m.notebook, m.note, m.memo, m.createdTime, m.modifiedTime from UserTable as u inner join MemoTable as m on u.id=m.uid where u.name=? and notebook=? and m.note=?", [
          user, notebook, note
        ]);
        if (result === undefined) {
          return emptyMemo;
        }
        return {
          id: result.id,
          notebook: result.notebook, 
          note: result.note, 
          memo: result.memo,
          createdTime: result.createdTime, 
          modifiedTime: result.modifiedTime,
          uid: result.uid
        };
      } catch (err) {
        throw err;
      }
    }
    async addSpeechLibrary(name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      const uid = await this.get_user_id(user);
      const res = await this.db.run(`insert into SpeechLibraries (name, content, uid, configuration) values (?, ?, ?, ?)`, [
        name, content, uid, configuration
      ]);
      return {id: res.lastID, name, content, userName: user, configuration};
    }
    async updateSpeechLibrary(id: number, name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      // Todo: I don't know how to update query with inner join in Sqlite, so we don't allow to change user when updating SpeechLibraries by now.
      /// const res = await this.db.run(`update SpeechLibraries as s inner join UserTable u on s.uid=u.id
      /// set s.name=?, s.content=?, s.configuration=?
      /// where u.name=? and s.id=?`, [name, content, configuration, user, id]);
      const res = await this.db.run(`update SpeechLibraries set name=?, content=?, configuration=?
      where id=?`, [name, content, configuration, id]);
      return {id, name, content, userName: user, configuration};
    }
    async renameSpeechLibrary(id: number, name: string): Promise<void> {
      const res = await this.db.run(`update SpeechLibraries set name=? where id=?`, [name, id]);
      return;
    }
    async removeSpeechLibrary(id: number): Promise<boolean> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      try {
        const res = await this.db.run("update SpeechLibraries set deleted=?, deletedOn=? where id=?", [
          1, this.get_current_time(), id
        ]);
        return res.changes ? res.changes > 0 : false;
      } catch(err) {
        throw err;
      }
    }
    async getSpeechLibraries(user: string): Promise<ISpeechLibraryRecord[]> {
      const arr: ISpeechLibraryRecord[] = [];
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      const res = await this.db.all("select s.id, s.name from SpeechLibraries s inner join UserTable u where u.name=? and s.deleted=?", [
        user, 0
      ]);
      /// const uid = await this.get_user_id(user);
      /// const res = await this.db.all("select id, name from SpeechLibraries where uid=? and deleted=?", [uid, 0]);
      if (!res || res.length === undefined || res.length === 0) {
        return arr;
      }
      res.forEach(record => (arr.push({
        id: record.id,
        name: record.name,
        content: record.content,
        configuration: "",
        userName: user
      })));
      return arr;
    }
    async getSpeechLibrary(id: number): Promise<ISpeechLibraryRecord> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      const res = await this.db.get("select id, name, content, configuration from SpeechLibraries where id=?", [id]);
      if (!res) {
        return emptySpeechLibrary;
      }
      return res;
    }
    private async get_user_id(user: string): Promise<number> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      try {
        let result = await this.db.get("select id from UserTable where name=?", user);
        if (!result || result.length === 0) {
          throw new InvalidUserNameError(user);
        }
        return result.id;
      } catch (err) {
        throw err;
      }
    }
    private get_current_time() : string {
      const d = new Date();
      const tm = strftime("%Y-%m-%d %H:%M:%S", d);
      return tm;
    }
    private async drop_table(tableName: string): Promise<void> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      await this.db.run(`drop table if exists ${tableName}`);
    }
}

export default SqliteDatabase;
