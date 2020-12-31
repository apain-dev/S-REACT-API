import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UsersService from './users.service';
import CreateUserRequest from '../../models/user/user.dto';

@Controller('users')
@ApiTags('Users')
class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  create(@Body() body: CreateUserRequest) {
    return this.usersService.create(body);
  }
}

export default UsersController;
