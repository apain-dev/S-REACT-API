import {
  DatabaseModule,
  JsonSchemaModule,
  Oauth2Module,
} from '@enoviah/nest-core';
import { Module } from '@nestjs/common';
import UsersController from './users.controller';
import userProviders from './users.providers';
import UsersService from './users.service';

@Module({
  imports: [DatabaseModule, JsonSchemaModule, Oauth2Module],
  controllers: [UsersController],
  providers: [...userProviders, UsersService],
  exports: [UsersService],
})
class UsersModule {
}

export default UsersModule;
