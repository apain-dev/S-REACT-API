import { Schema } from 'jsonschema';

const creatUserSchema: Schema = {
  id: '/createUserSchema',
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6, format: 'password' },
    confirmPassword: { type: 'string', format: 'password', minLength: 6 },
  },
  required: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
};

export default creatUserSchema;
