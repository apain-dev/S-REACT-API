import { BadRequest } from '@enoviah/nest-core';
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
  CreateTokenResponse,
  GetAccountResponse,
  GetPlaylistsResponse,
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
    },
  };

  constructor(private readonly httpService: HttpService,
    private readonly userService: UsersService) {
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
        return this.httpService.request<GetPlaylistsResponse>(config).pipe(
          map((response) => response.data),
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
