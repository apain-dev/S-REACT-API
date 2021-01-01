import { ApiProperty } from '@nestjs/swagger';
import {
  SpotifyImage,
  SpotifyUser,
} from '../spotify.dto';

export class PlaylistItem {
  @ApiProperty()
  collaborative: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  href: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: [SpotifyImage] })
  images: SpotifyImage[];

  @ApiProperty()
  name: string;

  @ApiProperty({ type: SpotifyUser })
  owner: SpotifyUser;

  @ApiProperty()
  primary_color: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  snapshot_id: string;

  @ApiProperty()
  tracks: {
    href: string;
    total: number;
  };

  @ApiProperty()
  type: string;

  @ApiProperty()
  uri: string;
}

export class GetPlaylistsResponse {
  @ApiProperty({ type: [PlaylistItem] })
  results: PlaylistItem[];
}
