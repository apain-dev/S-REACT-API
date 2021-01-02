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
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AddTrackToPlaylistBody,
  AddTrackToPlaylistResponse,
} from '../../models/spotify/playlists/addTrackToPlaylistRequest.dto';
import { CreatePlaylistRequestBody } from '../../models/spotify/playlists/createPlaylistRequest.dto';
import {
  GetPlaylistsResponse,
  PlaylistItem,
} from '../../models/spotify/playlists/getPlaylistsResponse';
import GetPlaylistsTracksResponse from '../../models/spotify/playlists/getPlaylistsTracksRequest';
import { DefaultPaginationQuery } from '../../models/spotify/spotify.dto';
import SpotifyService from './spotify.service';

@Controller('spotify/:userId/playlists')
@ApiTags('Spotify playlists')
class PlaylistsController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Post('')
  @ApiOperation({
    summary: 'Create playlist',
    description: 'Create playlist and assign it to spotify user',
  })
  @ApiCreatedResponse({ description: 'Playlist created', type: PlaylistItem })
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
  create(@Param('userId') userId: string, @Body() body: CreatePlaylistRequestBody) {
    return this.spotifyService.createPlaylist(body, userId);
  }

  @Get(':playlistId/tracks')
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
  getPlaylistTracks(@Param('userId') userId: string, @Param('playlistId') playlistId: string,
    @Query() query: DefaultPaginationQuery) {
    return this.spotifyService.getPlaylistTracks(userId, playlistId, query);
  }

  @Post(':playlistId/tracks')
  @ApiOperation({
    summary: 'Add track to user\'s playlist',
    description: 'Take uris from body and add them to playlistId',
  })
  @ApiCreatedResponse({ description: 'Tracks added', type: AddTrackToPlaylistResponse })
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
  addTrack(@Param('userId') userId: string, @Param('playlistId') playlistId: string,
    @Body() body: AddTrackToPlaylistBody) {
    return this.spotifyService.addTrackToPlaylist(body, playlistId, userId);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all user\'s playlists',
    description: 'Retrieve all playlists from userId',
  })
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
  getUserPlaylists(@Param('userId') userId: string, @Query() query: DefaultPaginationQuery) {
    return this.spotifyService.getPlaylists(userId, query);
  }
}

export default PlaylistsController;
