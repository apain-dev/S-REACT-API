import {
  HttpModule,
  Module,
} from '@nestjs/common';
import UsersModule from '../users/users.module';
import SpotifyController from './spotify.controller';
import SpotifyService from './spotify.service';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
})
class SpotifyModule {
}

export default SpotifyModule;
