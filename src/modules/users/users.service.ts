import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument } from '../../models/user/user.document';

@Injectable()
class UsersService {
  constructor(@Inject('USERS_MODEL') private readonly userModel: Model<UserDocument>) {
  }

  async findOne(conditions: FilterQuery<UserDocument>): Promise<UserDocument> {
    let user;
    try {
      user = await this.userModel.findOne(conditions).exec();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    if (!user) {
      throw new BadRequestException({ message: 'Cannot find user', code: 'EUSERNOTFOUND' });
    }
    return user;
  }
}

export default UsersService;
