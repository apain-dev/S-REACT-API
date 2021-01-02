import { ApiProperty } from '@nestjs/swagger';
import { SpotifyTrack } from '../spotify.dto';

class GetPlaylistsTracksResponse {
  @ApiProperty({ type: [SpotifyTrack] })
  results: SpotifyTrack[];
}

export default GetPlaylistsTracksResponse;
