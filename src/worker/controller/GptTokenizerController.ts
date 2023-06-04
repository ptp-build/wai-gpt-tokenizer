import WaiOpenAPIRoute from '../share/cls/WaiOpenAPIRoute';
import {Str} from '@cloudflare/itty-router-openapi';
import {encode} from "gpt-tokenizer";


const requestBody = {
  text: new Str({
    example: '',
    description: 'encode text',
  }),
};

export default class GptTokenizerController extends WaiOpenAPIRoute {
  static schema = {
    tags: ['Proto'],
    requestBody,
    parameters: {},
    responses: {
      '200': {
        schema: {},
      },
    },
  };
  async handle(request: Request, data: Record<string, any>) {
    const {text} = data.body;
    const encodeText = encode(text)
    const tokenCount = encodeText.length
    return WaiOpenAPIRoute.responseJson({ tokenCount });
  }
}
