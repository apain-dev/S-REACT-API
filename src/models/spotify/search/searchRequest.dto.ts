import { ApiProperty } from '@nestjs/swagger';

class SearchRequestQuery {
  @ApiProperty({ description: 'terms to be searched' })
  q: string;

  @ApiProperty({
    description: 'type of the searched terms. Separate each type with ,',
    example: 'type=album,artist',
    enum: ['album', 'artist', 'playlist', 'track', 'show', 'episode'],
  })
  type: string;
}

export default SearchRequestQuery;
