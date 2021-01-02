import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import BrowseNewReleasesResponse from '../../models/spotify/browse/browse.dto';
import GetPlaylistsTracksResponse from '../../models/spotify/playlists/getPlaylistsTracksRequest';
import SpotifyService from './spotify.service';

@Controller('spotify/:userId/browse')
@ApiTags('Spotify browse')
class BrowseController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Get('new-releases')
  @ApiOperation({
    summary: 'Get new released albums',
    description: 'Return new albums. Default 20',
  })
  @ApiOkResponse({ type: BrowseNewReleasesResponse })
  @ApiOkResponse({
    type: GetPlaylistsTracksResponse,
    description: 'Tracks of the playlist are returned',
  })
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
  newReleases(@Param('userId') userId: string) {
    return this.spotifyService.browseNewReleases(userId);
  }
}

export default BrowseController;
