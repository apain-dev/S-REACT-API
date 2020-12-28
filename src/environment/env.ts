import { EnvironmentService } from '@enoviah/nest-core';
import envSchema from './env.schema';
import { Environment } from './env.model';

const environment = new EnvironmentService<Environment>();
environment.validators = envSchema;
environment.loadEnvironment(true);
export default environment;
