import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetPlaylistsResponse } from '../../models/spotify/playlists/getPlaylistsResponse';
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

  @Get(':userId/playlists')
  @ApiOkResponse({ description: 'Playlist retrieved', type: GetPlaylistsResponse })
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
  getUserPlaylists(@Param('userId') userId: string) {
    return this.spotifyService.getPlaylists(userId);
  }

  @Get(':userId/search')
  search(@Param('userId') userId: string, @Query() query: SearchRequestQuery) {
    return this.spotifyService.search(query, userId);
  }
}

export default SpotifyController;
