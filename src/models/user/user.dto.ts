import { ApiProperty } from '@nestjs/swagger';

class CreateUserRequest {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}

export class GetAccountResponse {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Boolean, description: 'True if spotify is initialized' })
  spotify: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export default CreateUserRequest;
