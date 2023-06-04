import { Environment } from './env';
import { WaiRouter } from './route';
import ProtoController from './controller/ProtoController';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const iRouter = new WaiRouter({
  title: 'Api',
  version: '1.0.1',
}).setRoute((router: any) => {
  router.post('/api/proto', ProtoController);
});

const worker: ExportedHandler<Environment> = {
  async fetch(request, env) {
    iRouter.setEnv(env);
    return iRouter.handleRequest(request, env);
  },
  async scheduled(event, env, ctx) {
    return await iRouter.setEnv(env).handleScheduled(event, ctx);
  },
};

// export default worker;

async function handleEvent(event: FetchEvent) {
  const uri = new URL(event.request.url);
  if (
    uri.pathname.startsWith('/docs') ||
    uri.pathname.startsWith('/openapi.json') ||
    uri.pathname.startsWith('/api')
  ) {
    //@ts-ignore
    return worker.fetch(event.request, global);
  } else {
    try {
      return await getAssetFromKV(event);
    } catch (e) {
      let pathname = new URL(event.request.url).pathname;
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      });
    }
  }
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleEvent(event));
});
