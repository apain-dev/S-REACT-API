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

export interface SpotifyImage {

  height: number;
  url: string;
  width: number;
}

export interface PlaylistItem {
  collaborative: boolean,
  description: string,
  external_urls: {
    spotify: string,
  },
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    },
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  },
  type: string;
  uri: string;
}

export interface GetPlaylistsResponse {
  href: string;
  items: PlaylistItem[];
}
