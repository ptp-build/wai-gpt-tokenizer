import CloudFlareKv from './share/db/CloudFlareKv';
import CloudFlareR2 from './share/storage/CloudFlareR2';

export type Environment = {
  IS_PROD: boolean;
  Access_Control_Allow_Origin: string;
  KV_NAMESPACE_BINDING_KEY: string;
};

export const ENV: Environment = {
  IS_PROD: true,
  Access_Control_Allow_Origin: '*',
  KV_NAMESPACE_BINDING_KEY: 'DATABASE',
};

export let kv: CloudFlareKv;
export let storage: CloudFlareR2;

export function initEnv(env: Environment) {
  Object.assign(ENV, env);
  kv = new CloudFlareKv();
  //@ts-ignore
  kv.init(env[ENV.KV_NAMESPACE_BINDING_KEY]);
}
