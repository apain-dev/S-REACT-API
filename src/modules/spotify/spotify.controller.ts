import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import environment from '../../environment/env';
import SearchRequestQuery from '../../models/spotify/search/searchRequest.dto';
import { SpotifyTrack } from '../../models/spotify/spotify.dto';
import SpotifyService from './spotify.service';

@Controller('spotify')
@ApiTags('Spotify')
class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Get('callback')
  @ApiExcludeEndpoint()
  async getCode(@Query() query: { code: string, state: string }, @Res() res: Response) {
    try {
      await this.spotifyService.applyCodeToUser(query.code, query.state);
      res.status(403).redirect(`${environment.environment.APP_URL}/callback?status=success`);
    } catch (e) {
      res.status(403).redirect(`${environment.environment.APP_URL}/callback?status=error`);
    }
  }

  @Get(':userId/search')
  @ApiUnauthorizedResponse({
    description: 'Not allowed to access resources',
    type: UnauthorizedErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'Not allowed to access resources',
    type: UnauthorizedErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An internal error occurred',
    type: InternalErrorResponse,
  })
  @ApiOkResponse({
    description: 'Response type change based on type query param',
    type: [SpotifyTrack],
  })
  search(@Param('userId') userId: string, @Query() query: SearchRequestQuery) {
    return this.spotifyService.search(query, userId);
  }
}

export default SpotifyController;
