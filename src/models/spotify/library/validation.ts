import { Schema } from 'jsonschema';

const addTrackToLibrarySchema: Schema = {
  id: '/addTrackToLibrary',
  type: 'object',
  properties: {
    ids: { type: 'array', minItems: 1, items: [{ type: 'string', minLength: 1 }] },
  },
  required: ['ids'],
};

export default addTrackToLibrarySchema;
