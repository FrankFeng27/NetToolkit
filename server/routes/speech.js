
const extendSpeechRouter = (router, arch) => {
  const exp = arch.getService('express');
  router.get('/api/v1/speechLibraries', async (request, response) => {    
    const res = await exp.getSpeechLibraries(request);
    response.status(200).send({result: res});
  });
  router.post('/api/v1/speechLibrary', async (request, response) => {
    const res = await exp.addSpeechLibrary(request);
    response.status(200).send({result: res});
  });
  router.delete('/api/v1/speechLibrary/:libraryId', async (request, response) => {
    const res = await exp.removeSpeechLibrary(request);
    response.status(200).send({result: res});
  });
};

module.exports = extendSpeechRouter;