import {
  InternalErrorResponse,
  UnauthorizedErrorResponse,
} from '@enoviah/nest-core';
import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import CreateUserRequest from '../../models/user/user.dto';
import User from '../../models/user/user.model';
import UsersService from './users.service';

@Controller('users')
@ApiTags('Users')
class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Add user to oauth and apply it to db user',
  })
  @ApiCreatedResponse({
    type: User,
    description: 'User created',
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
  create(@Body() body: CreateUserRequest) {
    return this.usersService.create(body);
  }
}

export default UsersController;
