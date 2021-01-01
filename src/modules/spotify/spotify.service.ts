import {
  BadRequest,
  JsonSchemaService,
} from '@enoviah/nest-core';
import {
  HttpService,
  Injectable,
} from '@nestjs/common';
import {
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import {
  from,
  iif,
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
} from 'rxjs/operators';
import environment from '../../environment/env';
import {
  PlayerResponse,
  ResumePlayerRequest,
} from '../../models/spotify/player/player.dto';
import resumePlayerSchema from '../../models/spotify/player/validation';
import { AddTrackToPlaylistBody } from '../../models/spotify/playlists/addTrackToPlaylistRequest.dto';
import { CreatePlaylistRequestBody } from '../../models/spotify/playlists/createPlaylistRequest.dto';
import { PlaylistItem } from '../../models/spotify/playlists/getPlaylistsResponse';
import createPlaylistSchema, { addTrackToPlaylistSchema } from '../../models/spotify/playlists/validation';
import SearchRequestQuery from '../../models/spotify/search/searchRequest.dto';
import {
  CreateTokenResponse,
  GetAccountResponse,
} from '../../models/spotify/spotify.dto';
import { UserDocument } from '../../models/user/user.document';
import UsersService from '../users/users.service';

@Injectable()
class SpotifyService {
  private readonly spotify = {
    auth: {
      url: 'https://accounts.spotify.com/api/token',
    },
    api: {
      root: 'https://api.spotify.com/v1',
      account: 'me',
      playlists: 'me/playlists',
      search: 'search',
      player: 'me/player',
    },
  };

  constructor(private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly validationService: JsonSchemaService) {
  }

  static getHeadersFromUser(user: UserDocument) {
    if (!user?.spotify?.accessToken) {
      throw new BadRequest({
        code: 'ESPOTIFYNOTINIT',
        message: 'User is not connected to spotify',
      });
    }
    return { Authorization: `Bearer ${user.spotify.accessToken}` };
  }

  getPlayer(userId: string) {
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'GET',
          url: `${this.spotify.api.root}/${this.spotify.api.player}`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
        };
        return this.httpService.request<{ device: PlayerResponse }>(config).pipe(
          map((response) => response.data.device),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  pausePlayer(userId: string) {
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'PUT',
          url: `${this.spotify.api.root}/${this.spotify.api.player}/pause`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
        };
        return this.httpService.request<void>(config).pipe(
          map((response) => response.data),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  resumePlayer(userId: string, body: ResumePlayerRequest) {
    const validation = this.validationService.validate(body, resumePlayerSchema);
    if (validation?.errors?.length) {
      throw new BadRequest({
        message: 'Validation failed',
        code: 'EVALIDATIONFAIL',
        metadata: validation.errors,
      });
    }
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'PUT',
          url: `${this.spotify.api.root}/${this.spotify.api.player}/play`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
          data: {
            context_uri: body.context_uri,
            uris: body.uris,
          },
        };
        return this.httpService.request<void>(config).pipe(
          map((response) => response.data),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  search(query: SearchRequestQuery, userId: string) {
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'GET',
          url: `${this.spotify.api.root}/${this.spotify.api.search}`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
          params: {
            q: query.q,
            type: query.type,
          },
        };
        return this.httpService.request<{ [key: string]: { items: unknown } }>(config).pipe(
          map((response) => {
            const key = Object.keys(response.data)[0];
            return { results: response.data[key].items };
          }),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  applyCodeToUser(code: string, userId: string) {
    return from(this.userService.findOne({ _id: userId })).pipe(mergeMap((user) => {
      const stickUser = user;
      return this.createToken(code).pipe(map((res) => {
        stickUser.spotify = {
          id: null,
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        };
        return stickUser;
      }));
    })).pipe(mergeMap((user) => this.applyTokenToUser(user)));
  }

  getAccount(token: string) {
    return this.httpService.get<GetAccountResponse>(`${this.spotify.api.root}/${this.spotify.api.account}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).pipe(map((response) => response.data));
  }

  getPlaylists(userId: string) {
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'GET',
          url: `${this.spotify.api.root}/${this.spotify.api.playlists}`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
        };
        return this.httpService.request<{ items: [PlaylistItem] }>(config).pipe(
          map((response) => ({ results: response.data.items })),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  createPlaylist(body: CreatePlaylistRequestBody, userId: string) {
    const validation = this.validationService.validate(body, createPlaylistSchema);
    if (validation?.errors?.length) {
      throw new BadRequest({
        message: 'Validation failed',
        code: 'EVALIDATIONFAIL',
        metadata: validation.errors,
      });
    }
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'POST',
          url: `${this.spotify.api.root}/users/${userDocument.spotify.id}/playlists`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
          data: {
            name: body.name,
            description: body.description,
          },
        };
        return this.httpService.request<PlaylistItem>(config).pipe(
          map((response) => (response.data)),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  addTrackToPlaylist(body: AddTrackToPlaylistBody, playlistId: string, userId: string) {
    const validation = this.validationService.validate(body, addTrackToPlaylistSchema);
    if (validation?.errors?.length) {
      throw new BadRequest({
        message: 'Validation failed',
        code: 'EVALIDATIONFAIL',
        metadata: validation.errors,
      });
    }
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((userDocument) => {
        const config: AxiosRequestConfig = {
          method: 'POST',
          url: `${this.spotify.api.root}/playlists/${playlistId}/tracks`,
          headers: SpotifyService.getHeadersFromUser(userDocument),
          data: {
            uris: body.uris,
          },
        };
        return this.httpService.request<PlaylistItem>(config).pipe(
          map((response) => (response.data)),
        );
      })).pipe(catchError((err) => this.handleUnauthorized<AxiosError>(err, userId)));
  }

  private createToken(code: string = null, refreshToken: string = null)
    : Observable<CreateTokenResponse> {
    const method = (code) ? { grant_type: 'authorization_code', code } : {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return this.httpService.post<CreateTokenResponse>(this.spotify.auth.url, null, {
      params: {
        redirect_uri: environment.environment.SPOTIFY_REDIRECT_URI,
        client_id: environment.environment.SPOTIFY_CLIENT_ID,
        client_secret: environment.environment.SPOTIFY_CLIENT_SECRET,
        ...method,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).pipe(map((response) => response.data));
  }

  private applyTokenToUser(user: UserDocument) {
    const stickyUser = user;
    return this.getAccount(user.spotify.accessToken).pipe(mergeMap((spotifyUser) => {
      stickyUser.spotify.id = spotifyUser.id;
      return from(stickyUser.save());
    }));
  }

  private updateTokenFromRefreshToken(userId: string) {
    return from(this.userService.findOne({ _id: userId }))
      .pipe(mergeMap((user) => this.createToken(null, user.spotify.refreshToken)
        .pipe(mergeMap((token) => {
          const stickyUser = user;
          stickyUser.spotify.accessToken = token.access_token;
          return from(stickyUser.save());
        }))));
  }

  private handleUnauthorized<RequestType>(err: AxiosError, userId: string) {
    const retryStrategy$ = this.updateTokenFromRefreshToken(userId).pipe(mergeMap((user) => {
      const { config } = err;
      config.headers = SpotifyService.getHeadersFromUser(user);
      return this.httpService.request<RequestType>(config).pipe(map((response) => response.data));
    }));
    return iif(() => err.response.status === 401, retryStrategy$, throwError(err));
  }
}

export default SpotifyService;
