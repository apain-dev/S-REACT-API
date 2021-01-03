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

  @ApiProperty()
  spotify?: {
    id: string;
    accessToken: string;
    refreshToken: string;
  };

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  updatedAt?: string;
}

export default User;
