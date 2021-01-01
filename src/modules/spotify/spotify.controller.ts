import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import SearchRequestQuery from '../../models/spotify/search/searchRequest.dto';
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

  @Get(':userId/search')
  search(@Param('userId') userId: string, @Query() query: SearchRequestQuery) {
    return this.spotifyService.search(query, userId);
  }
}

export default SpotifyController;
