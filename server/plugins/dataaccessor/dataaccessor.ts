
/// var MySqlDatabase = require('./mysqldatabase');
import { IDatabaseAccessor, IUserRecord, IMemoRecord, IDatabase, ISpeechLibraryRecord, emptySpeechLibrary, SpeechRenameStruct } from "./datainterfaces";
import MysqlDatabase from "./mysqldatabase";
import SqliteDatabase from "./sqlitedatabase";
import path = require("path");
import { InvalidUserNameError } from "../datatypes/errors";

export interface IUserPasswordResult {
    result: boolean;
    name: string | undefined;
    password: string | undefined;
}

class DatabaseAccessor implements IDatabaseAccessor {
    mySqlDb : IDatabase = null;
    sqliteDb: IDatabase = null;
    currentDb: IDatabase = null;
    commUtils = null;
    config = null;
    constructor(options: any = {}) {
        this.mySqlDb = new MysqlDatabase();
        this.sqliteDb = new SqliteDatabase();
        this.currentDb = this.mySqlDb;
        this.commUtils = options.commUtils || null;
        this.config = options.config || null;
    }
    isConnected() : boolean {
        return this.mySqlDb.isConnected();
    }
    async connect() : Promise<boolean> {
      let res = await this.connectMysql();
      if (res) {
        this.config.set("databaseName", "mysql");
        return true;
      }
      res = await this.connectSqlite();
      this.config.set("databaseName", "sqlite");
      return res;
    }
    private async connectMysql(): Promise<boolean> {
      let db = this.config.get('database');
      try {
        await this.mySqlDb.connect(db.host, db.port, db.user, db.password, db.database, db.timeout);
        await this.mySqlDb.createUserTableIfNotExisted();
        await this.mySqlDb.createMemoTableIfNotExisted();
        await this.mySqlDb.createSpeechTablesIfNotExisted();
        this.currentDb = this.mySqlDb;
        return true;
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    private async connectSqlite(): Promise<boolean> {
      // Let's switch to sqlite
      let db = this.config.get('database');
      try {
        await this.sqliteDb.connect("", 0, "", "", db.database, 0, {sqliteFolder: db.sqliteFolder});
        await this.sqliteDb.createUserTableIfNotExisted();
        await this.sqliteDb.createMemoTableIfNotExisted();
        await this.sqliteDb.createSpeechTablesIfNotExisted();
        this.currentDb = this.sqliteDb;
        return true;
      } catch (err) {
        this.commUtils.handle(err);
        this.currentDb = null;
        return false;
      }
    }
    disconnect() {
        return this.currentDb.disconnect();
    }

    async isUserExisted(name: string) : Promise<boolean> {
        try {
            let _record: IUserRecord = await this.currentDb.getUser(name);
            return true;
        } catch (_err) {
            return false;
        }
    }
    async isEmailExisted(email: string): Promise<boolean> {
        try {
            let _record: IUserRecord = await this.currentDb.getEmail(email);
            return true;
        } catch {
            return false;
        }
    }
    isUserValid(name : string, pwdSalted : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.currentDb.getUser(name).then(result => {
                ///  let {crypto} = this.commUtils.encryptWithSalt(pwd, result.pwdsalt, result.delimiter);
                resolve(pwdSalted === result.password);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async isUserPasswordValid(name: string, pwd: string) : Promise<IUserPasswordResult> {
        try {
            let record = await this.currentDb.getUser(name);
            let {crypto} = this.commUtils.encryptWithSalt(pwd, record.pwdsalt, record.delimiter);
            if (crypto === record.password) {
                return {result: true, name: name, password: crypto};
            } else {
                return {result: false, name: name, password: null};
            }
        } catch (err) {
            return { result: false, name, password: pwd };
        }
    }
    async getUserPassword(name: string) : Promise<string | null> {
        try {
            let recrod = await this.currentDb.getUser(name);
            return recrod.password;
        } catch (err) {
            return null;
        }
    }
    async addUser(name, email, pwd) : Promise<IUserPasswordResult | null> {
        try {
            const vers = "1.1";
            let {crypto, salt, delimiter, version} = this.commUtils.encryptWithRandomSalt(pwd, vers);
            let record = await this.currentDb.addUser(name, email, crypto, salt, delimiter, version);
            return {name: record.name, password: record.password, result: true};
        } catch (err) {
            return null;
        }
    }
    removeUser(name, pwd) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.currentDb.getUser(name).then(result => {
                let {crypto} = this.commUtils.encryptWithSalt(pwd, result.pwdsalt, result.delimiter);
                this.currentDb.removeUser(name, crypto).then(res => {
                    resolve(true);
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            });
        });
    }
    async addMemo(usr : string, notebook: string, note: string, memo: string) : Promise<any>  {
        try {
          const res = this.currentDb.addMemo(notebook, note, memo, usr);
          return res;
        } catch (err) {
          this.commUtils.handleError(err);
          return false;
        }
    }
    async removeMemo(memo_id: number, user: string) : Promise<boolean> {
      try {
        return await this.currentDb.removeMemo(memo_id, user);
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    async updateMemo(notebook: string, note: string, memo:string, user: string): Promise<boolean>  {
      try {
        return await this.currentDb.updateMemo(notebook, note, memo, user);
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    async getMemos(name: string): Promise<IMemoRecord[]> {
      try {
        return await this.currentDb.getMemos(name);
      } catch (err) {
        this.commUtils.handleError(err);
        return [];
      }
    }
    async addSpeechLibrary(name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      try {
        const res = await this.currentDb.addSpeechLibrary(name, content, user, configuration);
        return res;
      } catch (err) {
        if (err instanceof InvalidUserNameError) {
          throw err;
        } else {
          this.commUtils.handleError(err);
          return emptySpeechLibrary;
        }
      }
    }
    async updateSpeechLibrary(id: number, name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      try {
        const res = await this.currentDb.updateSpeechLibrary(id, name, content, user, configuration);
        return res;
      } catch (err) {
        if (err instanceof InvalidUserNameError) {
          throw err;
        } else {
          this.commUtils.handleError(err);
          return emptySpeechLibrary;
        }
      }
    }
    async removeSpeechLibrary(id: number): Promise<boolean> {
      try {
        return await this.currentDb.removeSpeechLibrary(id);
      } catch (err) {
        this.commUtils.handleError(err);
        return true;
      }
    }
    async getSpeechLibraries(user: string): Promise<ISpeechLibraryRecord[]> {
      try {
        return await this.currentDb.getSpeechLibraries(user);
      } catch (err) {
        if (err instanceof InvalidUserNameError) {
          throw err;
        } else {
          this.commUtils.handleError(err);
          return [];
        }
      }
    }
    async getSpeechLibrary(id: number): Promise<ISpeechLibraryRecord> {
      try {
        return await this.currentDb.getSpeechLibrary(id);
      } catch (err) {
        this.commUtils.handleError(err);
        return emptySpeechLibrary;
      }
    }
    async dropTables(): Promise<void> {
      await this.currentDb.dropSpeechTables();
      await this.currentDb.dropMemoTable();
      await this.currentDb.dropUserTable();
    }
    async renameSpeechLibraries(speeches: SpeechRenameStruct[]): Promise<boolean> {
      const promises = speeches.map(speech => (this.currentDb.renameSpeechLibrary(speech.id, speech.name)));
      try {
        await Promise.all(promises);
      } catch (err) {
        return false;
      }
      return true;
    }
}

/// module.exports = DatabaseAccessor;
export default DatabaseAccessor; // es6, but tsc can't convert it to commonjs module.exports = MysqlDatabase, 
                                     // so that, it can't be used in nodejs javascript var xxx = require('xxx');
/// export = DatabaseAccessor;
