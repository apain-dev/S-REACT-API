import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePlaylistRequestBody } from '../../models/spotify/playlists/createPlaylistRequest.dto';
import { GetPlaylistsResponse } from '../../models/spotify/playlists/getPlaylistsResponse';
import SpotifyService from './spotify.service';

@Controller('spotify/:userId/playlists')
@ApiTags('Spotify playlists')
class PlaylistsController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Post('')
  create(@Param('userId') userId: string, @Body() body: CreatePlaylistRequestBody) {
    return this.spotifyService.createPlaylist(body, userId);
  }

  @Get('')
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
}

export default PlaylistsController;
