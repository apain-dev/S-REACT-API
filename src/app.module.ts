import { Module } from '@nestjs/common';
import SyncModule from './gateways/sync/sync.module';
import AccountModule from './modules/account/account.module';
import SpotifyModule from './modules/spotify/spotify.module';
import UsersModule from './modules/users/users.module';

@Module({
  imports: [UsersModule, SpotifyModule, SyncModule, AccountModule],
  controllers: [],
  providers: [],
})
class AppModule {
}

export default AppModule;
