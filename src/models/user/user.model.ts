import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  authId: string;
}

export default User;
