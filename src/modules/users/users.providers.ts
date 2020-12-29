import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import UserSchema from '../../schema/user.schema';

const providers: Provider[] = [{
  provide: 'USERS_MODEL',
  useFactory: (connection: Connection) => connection.model('Users', UserSchema),
  inject: ['DATABASE_CONNECTION'],
}];
export default providers;
