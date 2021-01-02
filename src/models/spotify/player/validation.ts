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

export const setPlayerRepeatStateSchema: Schema = {
  id: '/setPlayerRepeatState',
  type: 'object',
  properties: {
    state: { type: 'string', enum: ['track', 'off', 'context'] },
  },
  required: ['state'],
};

export const setPlayerShuffleStateSchema: Schema = {
  id: '/setPlayerShuffleState',
  type: 'object',
  properties: {
    state: { type: 'boolean' },
  },
  required: ['state'],
};

export default resumePlayerSchema;
