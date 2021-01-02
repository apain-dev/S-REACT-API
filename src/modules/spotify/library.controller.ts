import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AddTracksToLibraryBody,
  GetAllTracksResponse,
} from '../../models/spotify/library/library.dto';
import { AddTrackToPlaylistResponse } from '../../models/spotify/playlists/addTrackToPlaylistRequest.dto';
import { DefaultPaginationQuery } from '../../models/spotify/spotify.dto';
import SpotifyService from './spotify.service';

@Controller('spotify/:userId/library')
@ApiTags('Spotify library')
class LibraryController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Put('')
  @ApiOperation({
    summary: 'Add track to user\'s library',
    description: 'Take ids from body and add them to playlistId',
  })
  @ApiOkResponse({ description: 'Tracks added', type: AddTrackToPlaylistResponse })
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
  addTrack(@Param('userId') userId: string,
    @Body() body: AddTracksToLibraryBody) {
    return this.spotifyService.addTrackToLibrary(body, userId);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all user\'s trakcs',
    description: 'Retrieve all tracks from userId',
  })
  @ApiOkResponse({ description: 'Tracks retrieved', type: GetAllTracksResponse })
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
  getUserTracks(@Param('userId') userId: string, @Query() query: DefaultPaginationQuery) {
    return this.spotifyService.getTracksFromLibrary(userId, query);
  }
}

export default LibraryController;
