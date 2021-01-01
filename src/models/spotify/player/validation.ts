import { Schema } from 'jsonschema';

const resumePlayerSchema: Schema = {
  id: '/resumePlayerSchema',
  type: 'object',
  properties: {
    context_uri: { type: 'string', minLength: 1 },
    uris: { type: 'array', items: [{ type: 'string', minLength: 1 }] },
  },
  required: [],
};

export default resumePlayerSchema;
