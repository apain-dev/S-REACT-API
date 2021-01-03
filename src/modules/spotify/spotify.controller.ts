import {
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import environment from '../../environment/env';
import SearchRequestQuery from '../../models/spotify/search/searchRequest.dto';
import SpotifyService from './spotify.service';

@Controller('spotify')
@ApiTags('Spotify')
class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Get('callback')
  async getCode(@Query() query: { code: string, state: string }, @Res() res: Response) {
    try {
      await this.spotifyService.applyCodeToUser(query.code, query.state);
      res.status(403).redirect(`${environment.environment.APP_URL}/callback?status=success`);
    } catch (e) {
      res.status(403).redirect(`${environment.environment.APP_URL}/callback?status=error`);
    }
  }

  @Get(':userId/search')
  search(@Param('userId') userId: string, @Query() query: SearchRequestQuery) {
    return this.spotifyService.search(query, userId);
  }
}

export default SpotifyController;
