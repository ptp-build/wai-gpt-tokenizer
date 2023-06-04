import {encode} from "gpt-tokenizer";
import CloudFlareR2 from "./share/storage/CloudFlareR2";
const worker = {
  async fetch(request:any,env:any) {
    if(request.method.toLowerCase() === "get"){
      const msg =  "use http post method to process text"
      return new Response(JSON.stringify({
        msg
      }),{
        status:200
      })
    }else{
      const {text} = await request.json();
      const storage = new CloudFlareR2().init(env['STORAGE']);
      const encode_data_string = await storage.get("encode_data.json");
      const encode_data = JSON.parse(encode_data_string!.toString())
      let encode_txt;
      encode_txt = encode(text)
      const tokenCount = encode_txt.length
      console.log({
        tokenCount,
        text,
        encode_txt
      })
      return new Response(JSON.stringify({
        tokenCount
      }), {
        status: 200
      });
    }

  },
};

export default worker
