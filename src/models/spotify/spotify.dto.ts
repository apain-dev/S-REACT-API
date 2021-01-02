import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export interface CreateTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface GetAccountResponse {
  country: string;
  display_name: string;
  email: string;
  external_urls: { spotify: string; },
  followers: { href: string, total: number };
  href: string;
  id: string;
  product: string;
  type: string;
  uri: string;
}

export class SpotifyImage {
  @ApiProperty()
  height: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  width: number;
}

export class SpotifyUser {
  @ApiProperty()
  display_name: string;

  @ApiProperty()
  href: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uri: string;
}

export class SpotifyArtist {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uri: string;
}

export class SpotifyTrack {
  @ApiProperty({ type: [SpotifyArtist] })
  artists: SpotifyArtist[];

  @ApiProperty()
  duration_ms: number;

  @ApiProperty()
  id: string;

  @ApiProperty()
  is_local: boolean;

  @ApiProperty()
  is_playable: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  track_number: 1;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uri: string;
}

export class DefaultPaginationQuery {
  @ApiPropertyOptional({ type: String, description: 'Limit of results. Limit is 50', example: 'limit=35' })
  limit: string | number;

  @ApiPropertyOptional({ type: String, description: 'Offset of results', example: 'offset=35' })
  offset: string | number;
}
