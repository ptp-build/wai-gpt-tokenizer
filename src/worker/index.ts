import { Environment } from './env';
import { WaiRouter } from './route';
import ProtoController from './controller/ProtoController';

const iRouter = new WaiRouter({
  title: 'Api',
  version: '1.0.1',
}).setRoute((router: any) => {
  router.post('/api/proto', ProtoController);
});

const worker: ExportedHandler<Environment> = {
  async fetch(request, env) {
    iRouter.setEnv(env);
    return iRouter.handleRequest(request);
  },
  async scheduled(event, env, ctx) {
    return await iRouter.setEnv(env).handleScheduled(event, ctx);
  },
};

export default worker;
