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

export default CreateUserRequest;
