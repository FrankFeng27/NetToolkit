
var mysql = require('mysql');
var strftime = require('strftime');

import { DatabaseUnconnectedError } from "../datatypes/errors";
import { IDatabase, IUserRecord, IMemoRecord, ISpeechLibraryRecord, emptySpeechLibrary } from "./datainterfaces";

/// const passphrase = "SIMPLEPHRASEBAR";

class MysqlDatabase implements IDatabase {
    pool : any;
    constructor() {
        this.pool = null;
    }
    isConnected() : boolean {
        return this.pool !== null;
    }

    connect(host: string, port: number, user: string, pwd: string, dbname: string, timeout : number, _xdata?: any) : Promise<void> {
        const CONNECTION_LIMIT = 10;
        return new Promise((resolve, reject) => {
            this.pool = mysql.createConnection({
                host: host,
                port: port,
                user: user,
                password: pwd,
                database: dbname,
                acquireTimeout: timeout,
                connectionLimit: CONNECTION_LIMIT
            });
            reject = reject || (err => {});
            resolve = resolve || (() => {});
            if (!this.pool) {
                reject(new Error("Failed to create MySql connection"));
                return;
            }
            resolve();
        });        
    }
    disconnect() : Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                resolve();
            }
            this.pool.end(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    createUserTableIfNotExisted() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.pool.query(`create table if not exists UserTable (
                id int auto_increment,
                name varchar(150) not null unique,
                email varchar(255),
                password varchar(255) not null,
                pwdsalt varchar(150) not null,
                delimiter varchar(32) not null,
                version varchar(32) not null,
                primary key (id)
            )`, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
    createMemoTableIfNotExisted() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.pool.query(`create table if not exists MemoTable (
                id int auto_increment,
                memo text,
                note varchar(255),
                notebook varchar(255),
                createdTime datetime,
                modifiedTime datetime,
                uid int,
                plainText text,
                deleted tinyint(1) default 0,
                deletedOn datetime,
                editVersion int default 0,
                foreign key (uid) 
                references UserTable(id) on delete cascade,
                primary key (id)
            )`, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
    async createSpeechTablesIfNotExisted(): Promise<boolean> {
      if (!this.isConnected()) {
        return false;
      }
      await this.pool.query(`create table if not exists SpeechChannel (
        id int primary key,
        name varchar(255),
        url varchar(255)
      )`);
      await this.pool.query(`create table if not exists SpeechOrderedChannel (
        channelId int,
        uid int,
        foreign key (channelId) references SpeechChannel(id),
        foreign key (uid) references UserTable(id)
      )`);
      await this.pool.query(`create table if not exists SpeechTemporaryLibraries (
        id int primary key,
        name varchar(255),
        createdTime datetime,
        modifiedTime datetime,
        article text,
        channelId int,
        foreign key(channelId) references SpeechChannel(id)
      )`);

      await this.pool.query(`create table if not exists SpeechLibraries (
        id int auto_increment,
        name varchar(255),
        content text,
        uid int,
        configuration text,
        tempLibraryId int,
        deleted tinyint(1) default 0,
        deletedOn datetime,
        foreign key (uid)
          references UserTable(id) on delete cascade,
        foreign key (tempLibraryId) 
          references SpeechTemporaryLibraries(id),
        primary key(id)
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
    addUser(name: string, email: string | null, pwd: string, pwdsalt: string, delimiter:string, version: string):Promise<IUserRecord> {
        return new Promise((resolve, reject) => {            
            this.pool.query('insert into UserTable (name, email, password, pwdsalt, delimiter, version) value (?, ?, ?, ?, ?, ?)', [
              name, email, pwd, pwdsalt, delimiter, version
            ], (err, result) => {
                if (err) {
                    reject(new Error(`Failed to add user - ${err}`));
                    return;
                }
                resolve({id: result.insertId, name: name, password: pwd, pwdsalt: pwdsalt, delimiter: delimiter, version: version});
            });
        });
    }
    getUser(name: string) : Promise<IUserRecord> {
        return new Promise((resolve, reject) => {
            this.pool.query('select * from UserTable where name = ?', [name], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result || result.length === 0) {
                    reject(new Error("Can't find the user."));
                    return;
                }
                resolve(result[0]);
            });
        });
    }
    getEmail(email: string): Promise<IUserRecord> {
        return new Promise((resolve, reject) => {
            this.pool.query('select * from UserTable where email = ?', [email], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result || result.length === 0) {
                    reject(new Error("Can't find the user."));
                    return;
                }
                resolve(result[0]);
            });
        });
    }
    removeUser(name:string, pwd:string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getUser(name).then((result: IUserRecord) => {
                if (!result || !result.id || result.password != pwd) {
                    reject(new Error("Can't find user."));
                    return;
                }
                this.pool.query('delete from UserTable where id = ?', [result.id], (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                });
            }).catch(err => {
                reject(err);
            });
        });        
    }
    isUserExisted(name: string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.pool.query('select name from UserTable where name = ?', [name], (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    isUserNameValid(name : string, pwd: string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.pool.query('select * from UserTable where name=?', [name], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result || result.length === 0) {
                    resolve(false);
                    return;
                }
                let record = result[0];
                resolve(record['password'] === pwd);
            });
        });
    }
    addMemo(notebook: string, note: string, memo:string, user: string) : Promise<IMemoRecord> {
      return new Promise((resolve, reject) => {
        this.get_user_id(user).then((uid) => {
          this.pool.query('select * from MemoTable where uid=? and notebook=? and note=?', [uid, notebook, note], (err, memos) => {
              if (err) {
                reject(err);
                return;
              }
              const tm = this.get_current_time();
              if (memos.length === 0) {
                this.pool.query('insert into MemoTable (memo, notebook, note, uid, createdTime, modifiedTime) value (?, ?, ?, ?, ?, ?)', [
                    memo, notebook, note, uid, tm, tm
                ], (err, result) => {
                  if (err) {
                    reject(err);
                    return;
		  }
		  console.log(result);
                  resolve({
                    id: result.insertId,
                    notebook,
                    note,
                    memo,
                    uid,
                    createdTime: tm,
                    modifiedTime: tm
                  });
                });
              }
              else {
                this.pool.query('update MemoTable set memo=?, deleted=?, modifiedTime=? where uid=? and notebook=? and note=?', [memo, 0, tm, uid, notebook, note], (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  resolve({
                    id: memos[0].id,
                    notebook,
                    note,
                    memo,
                    uid,
                    createdTime: memos[0].createdTime,
                    modifiedTime: tm
                  });
                });
              }
          });
        });
      });
    }
    async updateMemo(notebook: string, note: string, memo:string, user: string): Promise<boolean> {
      // fixme: by now, we won't handle conflict.
      try {
        await this.addMemo(notebook, note, memo, user);
        return true;
      }  catch (err) {
        throw err;
      }
    }
    removeMemo(memo_id: number, user: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.get_user_id(user).then((uid) => {
            this.pool.query('select deleted, deletedOn from MemoTable where id=? and uid=?', [memo_id, uid], (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              if (result.length === 0) {
                resolve(false);
                return;
              }
              const tm = this.get_current_time();
              this.pool.query('update MemoTable set deleted=?, deletedOn=? where id=? and uid=?', [1, tm, memo_id, uid], (err, _result) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(true);
              });
            });
        });
      });
    }
    getMemos(user: string): Promise<IMemoRecord[]> {
      return new Promise((resolve, reject) => {
        this.get_user_id(user).then(uid => {
          this.pool.query('select * from MemoTable where uid=? and deleted=?', [uid, 0], (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            if (result.length === 0) {
              resolve([]);
              return;
            }
            const arr: IMemoRecord[] = [];
            for (let ix = 0; ix < result.length; ix += 1) {
              const record = result[ix];
              arr.push({
                id: record.id, 
                notebook: record.notebook, 
                note: record.note, 
                memo: record.memo, 
                createdTime: record.createdTime, 
                modifiedTime: record.modifiedTime,
                uid
              });
            }
            resolve(arr);
          });
        }).catch(err => reject(err));
        
      });
    }
    addSpeechLibrary(name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      return new Promise((resolve, reject) => {
        this.get_user_id(user).then((uid) => {
          this.pool.query(`insert into SpeechLibraries (name, content, uid, configuration) value (?, ?, ?, ?)`, [
            name, content, uid, configuration
          ], (err, result) => {
		  console.log(result);
            if (err) {
              reject(err);
              return;
            }
            resolve({id: result.insertId, content, name, userName: user, configuration});
          })
        }).catch(err => reject(err));
      });
    }
    updateSpeechLibrary(id: number, name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord> {
      return new Promise((resolve, reject) => {
        this.pool.query(`update SpeechLibraries s inner join UserTable u on s.uid=u.id
        set s.name=?, s.content=?, s.configuration=?
        where u.name=? and s.id=?`, [name, content, configuration, user, id], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({id, name, content, userName: user, configuration});
        });
      });
    }
    renameSpeechLibrary(id: number, name: string): Promise<void> {
      return new Promise((resolve, reject) => {
        this.pool.query(`update SpeechLibraries set name=? where id=?`, [name, id], (err, _result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
    async removeSpeechLibrary(id: number): Promise<boolean> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      try {
        const res = await this.pool.query("update SpeechLibraries set deleted=?, deletedOn=? where id=?", [
          1, this.get_current_time(), id
        ]);
        return true;
      } catch (err) {
        throw err;
      }
    }
    getSpeechLibrary(id: number): Promise<ISpeechLibraryRecord> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      return new Promise((resolve, reject) => {
        this.pool.query("select id, name, content, configuration from SpeechLibraries where id=?", [id], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (!result || result.length === 0) {
            resolve(emptySpeechLibrary);
            return;
          }
          resolve(result[0]);
        });
      });
    }
    getSpeechLibraries(user: string): Promise<Array<ISpeechLibraryRecord>> {
      if (!this.isConnected()) {
        throw new DatabaseUnconnectedError();
      }
      return new Promise((resolve, reject) => {
        this.pool.query("select s.id, s.name from SpeechLibraries s inner join UserTable u where u.name=? and s.deleted=?", [
          user, 0
        ], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (!result || !result.length || result.length === 0) {
            resolve([]);
            return;
          }
          let arr: Array<ISpeechLibraryRecord> = [];
          console.log("result is: " + result.length);
          result.forEach(record => (arr.push({
            id: record.id,
            name: record.name,
            content: "",
            configuration: "",
            userName: user
          })));
          resolve(arr);
        });
      });

      /*
      const res = await this.pool.query("select s.id, s.name from SpeechLibraries s inner join UserTable u where u.name=? and s.deleted=?", [
        user, 0
      ]);
      if (!res || res.length === 0) {
        return [];
      }
      let arr: Array<ISpeechLibraryRecord> = [];
      console.log("result is: " + res.length);
      res.forEach(record => (arr.push({
        id: record.id,
        name: record.name,
        content: "",
        configuration: "",
        userName: user
      })));
      return arr;
      */
    }
    private get_user_id(user: string): Promise<number> {
      return new Promise((resolve, reject) => {
        this.pool.query('select id from UserTable where name=?', [user], (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result.length === 0) {
            resolve(-1);
            return;
          }
          resolve(result[0].id);
        });
      });
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
      await this.pool.query(`drop table if exists ${tableName}`);
    }
    private is_memo_existed(memoId: string, user: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.get_user_id(user).then((uid) => {
          this.pool.query('select * from MemoTable where id=? and uid=? and deleted=?', [memoId, uid, 0], (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            if (result.length === 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      });
    }
}

/// module.exports = MysqlDatabase; // commonjs
export default MysqlDatabase; // es6, but tsc can't convert it to commonjs module.exports = MysqlDatabase, 
                                  // so that, it can't be used in nodejs javascript var xxx = require('xxx');
/// export = MysqlDatabase; // This code will be converted to `module.exports = MysqlDatabase;` by tsc

