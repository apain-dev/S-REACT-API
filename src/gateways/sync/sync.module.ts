import { Module } from '@nestjs/common';
import SpotifyModule from '../../modules/spotify/spotify.module';
import UsersModule from '../../modules/users/users.module';
import SyncGateway from './sync.gateway';
import { SyncService } from './sync.service';

@Module({
  imports: [SpotifyModule, UsersModule],
  providers: [SyncService, SyncGateway],
  exports: [SyncService],
})
class SyncModule {
}

export default SyncModule;
