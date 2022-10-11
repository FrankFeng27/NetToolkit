
import { extractCNNNews } from "./extractor";
import * as path from "path";
const mysql = require("mysql");
var sqlite3 = require("sqlite3");
import { open, Database } from "sqlite";
import { JobBase } from "../baseclasses/jobs";

const CONNECTION_LIMIT = 10;
const tempFolder = "./server/temporary";

export class MySqlDatabase {
  connection: any;
  configPath: string;
  logger: any;
  constructor(rootDir, logger) {
    this.configPath = path.join(rootDir, "config/config.json");
    this.logger = logger;
  }
  connect() {
    try {
      const config = require(this.configPath);
      const dbConfig = config.database;
      this.connection = mysql.createConnection({
        ...dbConfig,
        acquireTimeout: dbConfig.timeout,
        connectionLimit: CONNECTION_LIMIT
      });
    } catch (err) {
      this.logger.logError(err);
    }
  }
  disconnect() {
    if (!this.connection) {
      return;
    }
    this.connection.end();
  }
  getChannels() {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        this.connect();      
      }
      this.connection.query(`select name from SpeechChannel`, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

export class JobSqliteDatabase {
  configPath: string;
  logger: any;
  db: any;
  constructor(rootDir: string, logger: any) {
    this.configPath = path.join(rootDir, "config/config.json");
    this.logger = logger;
  }
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbConfig = require(this.configPath).database;
      const dbFileName = path.join(dbConfig.sqliteFolder, dbConfig.database+".db");
      open({
        filename: dbFileName,
        driver: sqlite3.Database
      }).then(db => {
        this.db = db;
        resolve();
      }).catch(err => (reject(err)));
    });
  }
  disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close().then(() => resolve()).catch(err => reject(err));
    });
  }
  async getChannels(): Promise<Array<{name: string, url: string}>> {
    if (!this.db) {
      await this.connect();
    }
    try {
      let result = await this.db.all("select name, url from SpeechChannel");
      if (!result) {
        return [];
      }
      return result;
    } catch (err) {
      this.logger.logError(err);
      throw err;
    }
  }
}

class CnnNewsExtractJob extends JobBase {
  rootDir: string;
  constructor(rootDir: string) {
    super(path.join(rootDir, "extractCNN-job.log"));
    this.rootDir = rootDir;
  }
  async execute() {
    const arrNews = await extractCNNNews(path.join(this.rootDir, tempFolder));

  }
}
