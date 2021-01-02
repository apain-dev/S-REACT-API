import { ApiProperty } from '@nestjs/swagger';
import { SpotifyTrack } from '../spotify.dto';

export class GetAllTracksResponse {
  @ApiProperty({ type: [SpotifyTrack] })
  results: SpotifyTrack[];
}

export class AddTracksToLibraryBody {
  @ApiProperty({
    description: 'Array of ids of tracks',
    example: ['4iV5W9uYEdYUVa79Axb7Rh'],
    type: [String],
  })
  ids: string[];
}
