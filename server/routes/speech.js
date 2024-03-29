
const extendSpeechRouter = (router, arch) => {
  const exp = arch.getService('express');
  router.get('/api/v1/speechLibraries', async (request, response) => {    
    const res = await exp.getSpeechLibraries(request);
    response.status(200).send({result: res});
  });
  router.get('/api/v1/speechLibrary', async (request, response) => {
    const res = await exp.getSpeechLibrary(request);
    response.status(200).send({result: res});
  });
  router.post('/api/v1/speechLibrary', async (request, response) => {
    const res = await exp.addSpeechLibrary(request);
    response.status(200).send({result: res});
  });
  router.delete('/api/v1/speechLibraries', async (request, response) => {
    const res = await exp.removeSpeechLibraries(request);
    response.status(200).send({result: res});
  });
  router.post('/api/v1/speechLibraries/rename', async (request, response) => {
    const res = await exp.renameSpeechLibraries(request);
    response.status(200).send({result: res});
  });
};

module.exports = extendSpeechRouter;