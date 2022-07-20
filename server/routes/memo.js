
const extendMemoRouter = (router, arch) => {
  router.post('/api/v1/memo', async (request, response) => {
    const exp = arch.getService('express');
    const res = await exp.addMemo(request);
    response.status(200).send({result: res});
  });
  router.get('/api/v1/memos', async (request, response) => {
    const exp = arch.getService('express');
    const arr = await exp.getMemos(request);
    response.status(200).send({result: arr});
  });
  router.delete('/api/v1/memo', async (request, response) => {
    const exp = arch.getService('express');
    const res = await exp.removeMemo(request);
    response.status(200).send({result: res});
  });
  router.patch('/api/v1/memo', async (request, response) => {
    const exp = arch.getService('express');
    const res = await exp.updateMemo(request);
    response.status(200).send({result: res});
  });
};

module.exports = extendMemoRouter;
