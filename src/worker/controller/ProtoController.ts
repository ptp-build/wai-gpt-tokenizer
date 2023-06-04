import WaiOpenAPIRoute from '../share/cls/WaiOpenAPIRoute';

export default class ProtoController extends WaiOpenAPIRoute {
  static schema = {
    tags: ['Proto'],
    parameters: {},
    responses: {
      '200': {
        schema: {},
      },
    },
  };
  async handle(request: Request, data: Record<string, any>) {
    return WaiOpenAPIRoute.responseJson({ status: 200 });
  }
}
