import { Module } from '@nestjs/common';
import { DatabaseModule } from '@enoviah/nest-core';
import userProviders from './users.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders],
})
class UsersModule {
}

export default UsersModule;
