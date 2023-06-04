import {encode} from "gpt-tokenizer";
import CloudFlareR2 from "./share/storage/CloudFlareR2";
import CloudFlareKv from "./share/db/CloudFlareKv";
const worker = {
  async fetch(request:any,env:any) {
    if (request.method.toLowerCase() === "get") {
      const msg = "use http post method to process text";
      return new Response(JSON.stringify({
        msg
      }), {
        status: 200
      });
    } else {
      const encode_data_key = "encode_data1.json";
      let tokenCount;
      const { text } = await request.json();

      let startTime = +(new Date())
      let endtime = +(new Date())
      let encode_data_string1
      const storage = new CloudFlareR2().init(env["STORAGE"]);
      const kv = new CloudFlareKv().init(env["WAI_KV_PROD"]);
      encode_data_string1 = await kv.get(encode_data_key);
      if(!encode_data_string1){
        let encode_data_string = await storage.get( "encode_data.json");
        endtime = +(new Date())
        console.log("fetch from storage",(endtime-startTime))
        startTime = +(new Date())
        encode_data_string1 = encode_data_string!.toString();
        await kv.put(encode_data_key,encode_data_string1)
      }else{
        endtime = +(new Date())
        console.log("fetch from kv",(endtime-startTime))
        startTime = +(new Date())
      }
      const encode_data = JSON.parse(encode_data_string1);
      endtime = +(new Date())
      console.log("decode from json",(endtime-startTime))
      startTime = +(new Date())
      let encode_txt;
      encode_txt = encode(text);
      endtime = +(new Date())
      console.log("encode ",(endtime-startTime))
      tokenCount = encode_txt.length;
      console.log({
        tokenCount,
        text,
        encode_txt
      });

      return new Response(JSON.stringify({
        tokenCount
      }), {
        status: 200
      });
    }
  },
};

export default worker
