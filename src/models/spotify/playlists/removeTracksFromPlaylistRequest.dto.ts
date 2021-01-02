import { ApiProperty } from '@nestjs/swagger';

class TrackItem {
  @ApiProperty()
  uri: string;
}

class RemoveTracksFromPlaylistBody {
  @ApiProperty({ type: [TrackItem], description: 'Array of spotify uris to remove' })
  tracks: TrackItem[];
}

export default RemoveTracksFromPlaylistBody;
