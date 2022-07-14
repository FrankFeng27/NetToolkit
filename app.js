var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var architect = require('architect');
var session = require('express-session');
var sqlite3 = require("sqlite3");
var MySqlSession = require('express-mysql-session')(session);
var sqliteStoreFactory = require('express-session-sqlite').default;

var ApplicationRouter = require('./server/routes/index');
//// var usersRouter = require('./server/routes/users');

class CoreEngine {
  constructor(props) {
    this.expressApp = express();
    this.arch = null;
  }

  init_resource() {
    let app = this.expressApp;
    var logger = morgan(':remote-addr [:date[clf]] ":method :url :status :response-time ms - :res[content-length]"');
    // view engine setup
    app.set('views', path.join(__dirname, 'server/views'));
    app.set('view engine', 'pug');
    
    /// app.use(favicon(path.join(__dirname, './public/resources/images/favicon.png')));
    app.use(logger);
    /// app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/dist', express.static(path.join(__dirname, 'public/dist')));
    app.use('/imgs', express.static(path.join(__dirname, 'public/resources/images')));
    /// app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
        
  }
  init_plugin() {
    return new Promise((resolve, reject) => {
      var plugin_config = architect.loadConfig(path.join(__dirname, 'server/plugins/plugins.js'));
      architect.createApp(plugin_config, (err, arch) => {
        if (err) {
          reject(err);
          return;
        }
        this.arch = arch;
        resolve();
      });
    });
  }
  init_session() {
    // initialize session database
    let app = this.expressApp;
    let config = this.arch.getService('config');
    let dbName = config.get("databaseName");
    if (dbName === "mysql") {
      let options = {
        host: config.get('database')['host'],
        port: config.get('database')['port'],
        user: config.get('database')['user'],
        password: config.get('database')['password'],
        database: config.get('database')['database'],
        createDatabaseTable: true,
        schema: {
          tableName: 'sessions',
          columnNames: {
              session_id: 'session_id',
              expires: 'expires',
              data: 'data'
          }
        }
      };
      let sessionStore = new MySqlSession(options);
      app.use(session({
        key: "net-toolkit",
        secret: "nettoolkit",
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: false},// 7 days
      }));
    } else if (dbName === "sqlite") {
      /// let factory = SqliteSession.sqliteStoreFactory;
      let SqliteStore = sqliteStoreFactory(session);
      let store = new SqliteStore({
        // Database library to use. Any library is fine as long as the API is compatible
        // with sqlite3, such as sqlite3-offline
        driver: sqlite3.Database,
        // for in-memory database
        // path: ':memory:'
        path: path.join(__dirname, "server/temporary/NettoolkitSession.db"),
        // Session TTL in milliseconds
        ttl: 10*60*60*1000, // 10 * 60 min
        // (optional) Session id prefix. Default is no prefix.
        prefix: 'sess:',
        // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
        // Default is 5 minutes.
        cleanupInterval: 300000
      });
      app.use(session({
        store: store,
        key: "net-toolkit",
        secret: "nettoolkit",
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},// 7 days
      }));
    }
    
  }
  init_router() {
    let app = this.expressApp;
    // router
    const appRouter = new ApplicationRouter(this.arch);
    app.use('/', appRouter.getRouter());
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });
    
    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

  async intialize() {
    try {
      await this.init_plugin();
    } catch (err) {
      console.log(err);
    }
    this.init_resource();
    this.init_session();
    this.init_router();
  }
}

module.exports = CoreEngine;
