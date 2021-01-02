import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { SpotifyTrack } from '../spotify.dto';

export class PlayerResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  is_private_session: boolean;

  @ApiProperty()
  is_restricted: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  volume_percent: number;
}

export class ResumePlayerRequest {
  @ApiPropertyOptional({ description: 'Optional playlist / album to play. Only for playlist & album' })
  context_uri: string;

  @ApiPropertyOptional({ description: 'Optional tracks to play. Only for tracks' })
  uris: string[];
}

export interface PlayerStatus {
  timestamp: number;
  progress_ms: number;
  currently_playing_type: string;
  is_playing: boolean;
  item: SpotifyTrack;
}

export class SetPlayerRepeatStateBody {
  @ApiProperty({ type: String, enum: ['track', 'off', 'context'], description: 'State of the player repeat.' })
  state: 'track' | 'off' | 'context';
}

export class SetPlayerShuffleStateBody {
  @ApiProperty({ type: Boolean, description: 'State of the player shuffle.' })
  state: boolean;
}
