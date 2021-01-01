import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreatePlaylistRequestBody {
  @ApiProperty({ description: 'Name of the playlist' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the playlist' })
  description: string;
}

export class CreatePlaylistResponse {
}
