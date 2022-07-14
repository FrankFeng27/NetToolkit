var assert = require('assert');
import MysqlDatabase from '../server/plugins/dataaccessor/mysqldatabase';
var mysql = require('mysql');

const host = 'localhost';
const user = 'fengsh';
const pwd = '!23456fF';
const port = 3306;
const database = 'testMySqlDB';

describe.skip('MysqlDatabase - tests.', () => {
    let mysqlDB: MysqlDatabase | null = null;
    let connection = null;
    before(async() => {
        try {
        connection = mysql.createConnection({
            host: host,
            user: user,
            password: pwd,
	    database,
	    connectTimeout: 1000
        });
	await connection.connect();
        mysqlDB = new MysqlDatabase();
	await mysqlDB.connect(host, port, user, pwd, database, 72000);
        await mysqlDB.createUserTableIfNotExisted();
	await mysqlDB.createMemoTableIfNotExisted();
	await mysqlDB.createSpeechTablesIfNotExisted();
	} catch (err) {
	    console.log(`Error occurred ${err}`);
	}
    });
    after(async () => {
        await mysqlDB.dropSpeechTables();
    	await mysqlDB.disconnect();
    	await connection.query('drop table if exists MemoTable');
	await connection.query('drop table if exists UserTable');
	await connection.end();
    });

    it ('should test add user.', (done) => {
        mysqlDB.addUser('test', 'boo@gmail.com', "123456ff", "salttemp", "+=-", "1.1").then((record) => {
            assert(record.id >= 0);
            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });
    it ('should check user.', (done) => {
        mysqlDB.isUserNameValid('test', '123456ff').then((valid) => {
            assert.equal(valid, true);
            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });
    it ('should test add memo', (done) => {
        mysqlDB.addMemo("Ariticles", "2021-6-23", "blablablablabla", "test").then(res => {
          assert(res);
          done();
        }).catch(err => {
          console.log(err);
          done();
        });
    });
    it ('should test get all memos', (done) => {
      mysqlDB.getMemos("test").then((memos) => {
        assert.equal(memos.length, 1);
        done();
      }).catch(err => {
        console.log(err);
        done();
      });
    });
    it('should test remove a memo', (done) => {
      mysqlDB.getMemos("test").then(memos => {
        assert(memos.length > 0);
        const memo = memos[0];
        mysqlDB.removeMemo(memo.id, "test").then((res: boolean) => {
          assert(res);
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
    it ("should test to add and remove speech library", async () => {
      let existed = await mysqlDB.isUserExisted("test");
      console.log(`user "test" existed: ${existed}`);
      if (!existed) {
        await mysqlDB.addUser("test", "123@456.com", "123456", "salttemp", "+=-", "1.1");
      }
      let record = await mysqlDB.addSpeechLibrary("2022-6-27", "placeholder", "test", "{\"speed\": 1}");
      console.log(record.id);
      assert(record.id >= 0);
      record = await mysqlDB.addSpeechLibrary("2022-6-28", "placeholder", "test", "{\"speed\": 1}");
      assert(record.id >= 0);
      let records = await mysqlDB.getSpeechLibraries("test");
      assert(records.length === 2);
      const res = await mysqlDB.removeSpeechLibrary(record.id);
      records = await mysqlDB.getSpeechLibraries("test");
      assert(records.length === 1);
      assert(res);
    });
});

