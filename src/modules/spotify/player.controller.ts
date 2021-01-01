import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  PlayerResponse,
  ResumePlayerRequest,
} from '../../models/spotify/player/player.dto';
import SpotifyService from './spotify.service';

@Controller('/spotify/:userId/player')
@ApiTags('Spotify player')
class PlayerController {
  constructor(private readonly spotifyService: SpotifyService) {
  }

  @Get('')
  @ApiOperation({
    summary: 'Get current player',
    description: 'Return currently playing player. If none, empty body is returned',
  })
  @ApiOkResponse({ description: 'return player object', type: PlayerResponse })
  @ApiUnauthorizedResponse({
    description: 'Not allowed to access resources',
    type: UnauthorizedErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An internal error occurred',
    type: InternalErrorResponse,
  })
  getPlayer(@Param('userId') userId: string) {
    return this.spotifyService.getPlayer(userId);
  }

  @Put('pause')
  @HttpCode(204)
  @ApiOperation({ summary: 'Pause player', description: 'Try to pause the current player' })
  @ApiNoContentResponse({ description: 'Player paused' })
  @ApiUnauthorizedResponse({
    description: 'Not allowed to access resources',
    type: UnauthorizedErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An internal error occurred',
    type: InternalErrorResponse,
  })
  pause(@Param('userId') userId: string) {
    return this.spotifyService.pausePlayer(userId);
  }

  @Put('play')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Play / resume player',
    description: 'this route can either play a new song on the player or resume the currently paused'
      + ' song. If you want to play a track / album, you must specify either "context_uri" or "uris" ',
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Not allowed to access resources',
    type: UnauthorizedErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An internal error occurred',
    type: InternalErrorResponse,
  })
  play(@Param('userId') userId: string, @Body() body: ResumePlayerRequest) {
    return this.spotifyService.resumePlayer(userId, body);
  }
}

export default PlayerController;
