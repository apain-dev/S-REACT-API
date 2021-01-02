import { Module } from '@nestjs/common';
import SpotifyModule from '../../modules/spotify/spotify.module';
import SyncGateway from './sync.gateway';
import { SyncService } from './sync.service';

@Module({
  imports: [SpotifyModule],
  providers: [SyncService, SyncGateway],
  exports: [SyncService],
})
class SyncModule {
}

export default SyncModule;
