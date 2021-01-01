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
export const addTrackToPlaylistSchema: Schema = {
  id: '/addTrackToPlaylist',
  type: 'object',
  properties: {
    uris: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
    },
  },
  required: ['uris'],
};
export default createPlaylistSchema;
