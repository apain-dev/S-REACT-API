import {
  AuthenticatedRequest,
  BearerGuard,
  InternalErrorResponse,
  TokenInfoResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetAccountResponse } from '../../models/user/user.dto';
import UsersService from '../users/users.service';

@Controller('account')
@ApiTags('Account')
class AccountController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @UseGuards(BearerGuard)
  @ApiHeader({ name: 'Authorization', description: 'Access token from auth.outworld.fr' })
  @ApiOperation({
    summary: 'Get account from token',
    description: 'Return account',
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
  @ApiOkResponse({ description: 'User found', type: GetAccountResponse })
  async getAccount(@Req() req: AuthenticatedRequest<TokenInfoResponse>) {
    const user = await this.usersService.findOne({ authId: req.user.userId });
    return {
      ...user.toObject(),
      spotify: !!(user.spotify && user.spotify.accessToken),
    };
  }
}

export default AccountController;
