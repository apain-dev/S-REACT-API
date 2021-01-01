import { JsonSchemaModule } from '@enoviah/nest-core';
import {
  HttpModule,
  Module,
} from '@nestjs/common';
import UsersModule from '../users/users.module';
import PlaylistsController from './playlists.controller';
import SpotifyController from './spotify.controller';
import SpotifyService from './spotify.service';

@Module({
  imports: [HttpModule, UsersModule, JsonSchemaModule],
  controllers: [SpotifyController, PlaylistsController],
  providers: [SpotifyService],
})
class SpotifyModule {
}

export default SpotifyModule;
