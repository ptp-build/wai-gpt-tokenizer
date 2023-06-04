/**
 * @typedef {import('./bindings').DurableObjectNamespace} DurableObjectNamespace
 * @typedef {import('./bindings').DurableObjectState} DurableObjectState
 * @typedef {import('node-fetch').Request} Request
 * @typedef {import('node-fetch').Response} Response
 */

import CloudFlareKv from "../db/CloudFlareKv";

/**
 * Durable Object
 */
export class GptEncoder {
    private state: DurableObjectState;
    private kv: any;
    /**
     * @param {DurableObjectState} state
     */
    constructor(state:DurableObjectState,env:any) {
        this.state = state;
        this.kv = env["WAI_KV_PROD"]
    }

    /**
     * Handle HTTP requests from clients.
     * @param {Request} request
     * @returns {Promise<Response>}
     */
    async fetch(request:Request) {
        // Apply the requested action.
        // @ts-ignore
        const {encode_data_key} = await request.json()
        let encode_data = await this.state.storage.get(encode_data_key);
        if(!encode_data){
            const kv = new CloudFlareKv().init(this.kv);
            let encode_data_string1 = await kv.get(encode_data_key);
            if(encode_data_string1){
                await this.state.storage.put(encode_data_key, encode_data_string1);
                encode_data = encode_data_string1
            }else{
                return new Response("",{status:404})
            }
        }
        return new Response(encode_data as string,{
            status:200
        });
    }
}
