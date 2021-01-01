import { ApiProperty } from '@nestjs/swagger';

export class AddTrackToPlaylistBody {
  @ApiProperty({
    type: [String],
    description: 'List of uris of tracks',
    example: ['spotify:tracks:xxxx'],
  })
  uris: string[];
}

export class AddTrackToPlaylistResponse {
  @ApiProperty({ type: String })
  snapshot_id: string;
}
