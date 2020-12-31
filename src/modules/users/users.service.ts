import {
  AuthUser,
  BadRequest,
  JsonSchemaService,
  Oauth2Service,
} from '@enoviah/nest-core';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
} from 'mongoose';
import {
  from,
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
  mergeMap,
} from 'rxjs/operators';
import { UserDocument } from '../../models/user/user.document';
import CreateUserRequest from '../../models/user/user.dto';
import creatUserSchema from '../../models/user/user.validations';

@Injectable()
class UsersService {
  constructor(@Inject('USERS_MODEL') private readonly userModel: Model<UserDocument>,
    private readonly jsonSchemaService: JsonSchemaService,
    private readonly oauthService: Oauth2Service) {
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

  create(body: CreateUserRequest): Observable<UserDocument> {
    const validation = this.jsonSchemaService.validate(body, creatUserSchema, true);
    if (validation.errors?.length) {
      throw new BadRequest({
        message: 'Validation failed',
        code: 'EVALIDATIONFAIL',
        metadata: validation.errors,
      });
    }
    if (body.confirmPassword !== body.password) {
      throw new BadRequest({ message: 'Passwords missmatch', code: 'EPASSWORDMISSMATCH' });
    }
    return this.oauthService.createUser(body).pipe(catchError(
      (e) => throwError(new BadRequestException(e?.response?.data?.errors)),
    ), mergeMap((authUser) => from(this.createDbUser(body, authUser.data))));
  }

  private async createDbUser(body: CreateUserRequest, authUser: AuthUser): Promise<UserDocument> {
    try {
      return await this.userModel.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        // eslint-disable-next-line no-underscore-dangle
        authId: authUser._id,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

export default UsersService;
