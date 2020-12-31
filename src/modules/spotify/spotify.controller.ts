import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SpotifyService from './spotify.service';

@Controller('spotify')
@ApiTags('Spotify')
class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Get('callback')
  getCode(@Query() query: { code: string, state: string }) {
    return this.spotifyService.applyCodeToUser(query.code, query.state);
  }

  @Get(':userId/playlists')
  getUserPlaylists(@Param('userId') userId: string) {
    return this.spotifyService.getPlaylists(userId);
  }
}

export default SpotifyController;
