var express = require('express');
var router = express.Router();
var extendUserRouter = require('./users');
var extendMemoRouter = require('./memo');
var extendSpeechRouter = require("./speech");

var ApplicationRouter = function(arch) {
  /* GET home page. */
  router.get('/', function(req, res, _next) {  
    res.render('index');
  });

  extendUserRouter(router, arch);
  extendMemoRouter(router, arch);
  extendSpeechRouter(router, arch);

  this.getRouter = () => {
    return router;
  };

};

module.exports = ApplicationRouter;
