import {
  AuthenticatedRequest,
  BearerGuard,
  TokenInfoResponse,
} from '@enoviah/nest-core';
import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiTags,
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
  @ApiOkResponse({ description: 'User found', type: GetAccountResponse })
  getAccount(@Req() req: AuthenticatedRequest<TokenInfoResponse>) {
    return this.usersService.findOne({ authId: req.user.userId });
  }
}

export default AccountController;
