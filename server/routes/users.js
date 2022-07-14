
var userErrorToStatus = require('./user-error-to-status');

const extendUserRouter = (router, arch) => {
  /* GET users listing. */
  router.get('/', function(req, res, next) {
  });

  router.get('/api/v1/signInStatus', async (request, response) => {
    const exp = arch.getService('express');
    const valid = await exp.isSessionUserValid(request);
    response.status(200).send({isLoggedIn: valid});
    
    /// const login = arch.getService('login');
    /// if (!request.session.user || !request.session.pwd) {
    ///   response.status(200).send({isLoggedIn: false});
    ///   return;
    /// }
    /// response.status(200).send({isLoggedIn: login.isUserLoggedIn()});
  });
  router.post('/api/v1/signIn', async (request, response) => {
    const exp = arch.getService('express');
    const res = await exp.signIn(request);
    const code = userErrorToStatus(res);
    response.status(code).send({result: res});
  });
  router.post('/api/v1/signUp', async (request, response) => {
    const exp = arch.getService('express');
    const res = await exp.signUp(request);
    const code = userErrorToStatus(res);
    response.status(code).send({result: res});
  });
  router.post('/api/v1/signOut', async (request, response) => {
    const exp = arch.getService('express');
    exp.signOut(request);
    response.status(200).send({result: true});
  });
};


module.exports = extendUserRouter;
