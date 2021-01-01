import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class PlayerResponse {
  @ApiProperty()
  'id': string;

  @ApiProperty()
  'is_active': boolean;

  @ApiProperty()
  'is_private_session': boolean;

  @ApiProperty()
  'is_restricted': boolean;

  @ApiProperty()
  'name': string;

  @ApiProperty()
  'type': string;

  @ApiProperty()
  'volume_percent': number;
}

export class ResumePlayerRequest {
  @ApiPropertyOptional({ description: 'Optional playlist / album to play. Only for playlist & album' })
  context_uri: string;

  @ApiPropertyOptional({ description: 'Optional tracks to play. Only for tracks' })
  uris: string[];
}
