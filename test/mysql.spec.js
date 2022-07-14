
var mysql = require('mysql');
var assert = require('chai').assert;

const host = 'localhost';
const user = 'fengsh';
const pwd = '!23456fF';
const database = 'NetToolkit';
const timeout = 1000; // 10 seconds

describe.skip('MySql - connect to mysql', () => {
    var connection = null;
    before((done) => {
        connection = mysql.createConnection({
            host: host,
            user: user,
            password: pwd,
            database: database,
            connectTimeout: timeout
        });
        connection.connect((err) => {
            done();
        });
    });
    after((done) => {
        connection.end();
        done();
    });

    it('should test basic query.', (done) => {
        connection.query('select * from UserTable', (error, results, fields) => {
            if (error) {
                throw error;
            }
            done();
        });
    });
    it ('should test escapeId', (done) => {
        var name = "testUserName@3$";
        var email = "foo@hotmail.com";
        var name_escape = connection.escape(name);
        assert.equal(name_escape, "'" + name + "'");
        var name_escapeId = connection.escapeId(name);
        assert.equal(name_escapeId, "`testUserName@3$`");
        var email_escape = connection.escape(email);
        assert.equal(email_escape, "'foo@hotmail.com'");   
        var email_escapeId = connection.escapeId(email);     
        assert.equal(email_escapeId, "`foo@hotmail`.`com`");
        var name_raw = mysql.raw(name).toSqlString();
        assert.equal(name_raw, name);
        var email_raw = mysql.raw(email).toSqlString();
        assert.equal(email_raw, email);
        done();
    });
});

describe.skip('MySql - create table', () => {
    var connection = null;
    before(async () => {
	try {
        connection = mysql.createConnection({
            host: host,
            user: user,
            password: pwd,
            connectTimeout: timeout,
	    database: "testDB"
        });
	await connection.connect();
	/*await connection.query("create database if not exists testDB");
	await connection.query("use testDB");
        */} catch (err) {
	    console.log(`Error ocurred: ${err}`);
	}
    });
    after(async () => {
        await connection.query("drop table if exists MemoTable");
	await connection.query("drop table if exists UserTable");
      /// await connection.query("drop table if exists MemoTable");
    });
    it('should test create table UserTable', (done) => {
        connection.query("create table if not exists `UserTable` (\
            `id` INT UNSIGNED AUTO_INCREMENT,\
            `name` VARCHAR(150) NOT NULL UNIQUE,\
            `email` VARCHAR(255),\
            `password` VARCHAR(255) NOT NULL,\
            `pwdsalt` VARCHAR(150),\
            `delimiter` VARCHAR(32),\
            `version` VARCHAR(32),\
            PRIMARY KEY (`id`, `name`)\
        )", err => {
            assert.ok(err === null);
            done();
        });
    });
    it('should test insert row', done => {
        connection.query('insert into UserTable (`name`, `email`, `password`, `pwdsalt`, `delimiter`, `version`)\
        values ("test name", "foo@hotmail.com", "testpassword", "salt", "delimiter", "1.1")', (err, result) => {
            assert.ok(err === null);
            assert.ok(result.insertId > 0);
            done();
        });
    });
    it('should test search user', done => {
        connection.query('select name from UserTable where name = ?', ["test name"], (err, results, fields) => {
            assert.ok(err === null);
            assert.equal(results.length, 1);
            done();
        });
    });
});

