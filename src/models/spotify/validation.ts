import { Schema } from 'jsonschema';

const defaultPaginationSchema: Schema = {
  id: '/defaultPaginationSchema',
  type: 'object',
  properties: {
    offset: { type: ['number', 'null'], minimum: 0, required: false },
    limit: { type: ['number', 'null'], maximum: 50, minimum: 1 },
  },
};
export default defaultPaginationSchema;
