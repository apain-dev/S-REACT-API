import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import SyncModule from './gateways/sync/sync.module';
import SpotifyModule from './modules/spotify/spotify.module';
import UsersModule from './modules/users/users.module';

@Module({
  imports: [UsersModule, SpotifyModule, SyncModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {
}

export default AppModule;
