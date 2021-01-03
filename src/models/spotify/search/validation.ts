import { Schema } from 'jsonschema';

const searchSchema: Schema = {
  id: '/searchRequest',
  type: 'object',
  properties: {
    q: { type: 'string', minLength: 1 },
    type: { type: 'string', enum: ['album', 'artist', 'playlist', 'track', 'show', 'episode'] },
  },
  required: ['q', 'type'],
};

export default searchSchema;
