export const DEFAULT_LANG_MNEMONIC = 'chinese_simplified';

export const SWAGGER_DOC = {
  schema: {
    info: {
      title: 'Api',
      version: '1.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};
