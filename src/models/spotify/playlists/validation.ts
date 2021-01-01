import { Schema } from 'jsonschema';

const createPlaylistSchema: Schema = {
  id: '/createPlaylistSchema',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
  },
  required: ['name'],
};
export default createPlaylistSchema;
