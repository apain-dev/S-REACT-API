import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvStatus } from '@enoviah/nest-core/dist/models/environment.model';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter, Utils } from '@enoviah/nest-core';
import * as helmet from 'helmet';
import { Logger } from '@nestjs/common';
import AppModule from './app.module';
import environment from './environment/env';

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
  Logger.debug(`API listening on ${environment.environment.PORT}`);
  await app.listen(+environment.environment.PORT);
}

bootstrap();
