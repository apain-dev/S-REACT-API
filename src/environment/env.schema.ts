import { Schema } from 'jsonschema';

const envSchema: Schema = {
  id: '/Env',
  type: 'object',
  properties: {
    PORT: { type: 'string' },
    MONGO_DATABASE: { type: 'string' },
    OAUTH_API: { type: 'string' },
    CLIENT_SECRET: { type: 'string' },
    CLIENT_ID: { type: 'string' },
    APP_URL: { type: 'string' },
  },
  required: ['PORT', 'MONGO_DATABASE', 'CLIENT_SECRET', 'CLIENT_ID'],
};
export default envSchema;
