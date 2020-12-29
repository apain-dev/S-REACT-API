import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter, Utils } from '@enoviah/nest-core';
import environment from './environment/env';
import { EnvStatus } from '@enoviah/nest-core/dist/models/environment.model';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import helmet = require('helmet');

function initSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('JS')
    .setDescription('API du projet JS.')
    .setVersion(Utils.getApiVersion((environment.getEnvStatus() === EnvStatus.LOCAL
      ? join(__dirname, '..', '..', '..', '..', 'package.json') : join(__dirname, 'package.json'))))
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs/', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.use(cors({ origin: '*' }));

  app.use(bodyParser.json());
  app.useGlobalFilters(new HttpExceptionFilter());
  initSwagger(app);
  await app.listen(+environment.environment.PORT);
}

bootstrap();
