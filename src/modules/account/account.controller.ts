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
import { ApiTags } from '@nestjs/swagger';
import UsersService from '../users/users.service';

@Controller('account')
@ApiTags('Account')
class AccountController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @UseGuards(BearerGuard)
  getAccount(@Req() req: AuthenticatedRequest<TokenInfoResponse>) {
    return this.usersService.findOne({ authId: req.user.userId });
  }
}

export default AccountController;
