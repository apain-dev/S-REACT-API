import {
  HttpModule,
  Module,
} from '@nestjs/common';
import UsersModule from '../users/users.module';
import AccountController from './account.controller';

@Module({
  imports: [UsersModule, HttpModule],
  controllers: [AccountController],
  providers: [],
})
class AccountModule {
}

export default AccountModule;
