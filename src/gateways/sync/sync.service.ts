import { Injectable } from '@nestjs/common';
import {
  Subscription,
  timer,
} from 'rxjs';
import { take } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { PlayerStatus } from '../../models/spotify/player/player.dto';
import { SpotifyTrack } from '../../models/spotify/spotify.dto';
import SpotifyService from '../../modules/spotify/spotify.service';
import { SyncPreConnect } from '../models/sync.model';

export interface User {
  userId: string;
  shopId: string;
  sockets: Socket[];
  spotify: {
    player: {
      isActive: boolean;
      isPlaying: boolean;
      playing: 'track' | 'playlist';
      item: SpotifyTrack;
    }
  }
}

@Injectable()
export class SyncService {
  private users: User[] = [];

  private watcher$: Subscription;

  constructor(private readonly spotifyService: SpotifyService) {
  }

  addUser(payload: SyncPreConnect, socket: Socket) {
    console.log(payload);
    this.logUser(payload, socket);
  }

  public logOut(socketId: string) {
    const user = this.findUserBySocket(socketId);
    if (!user) {
      return;
    }
    if (user && user.sockets.length > 1) {
      const index = user.sockets.findIndex((socket) => socket.id === socketId);
      user.sockets.splice(index, 1);
    } else {
      const userIndex = this.users.findIndex((item: User) => item.userId === user.userId);
      this.users.splice(userIndex, 1);
    }

    if (this.users.length === 0) {
      this.watcher$.unsubscribe();
      this.watcher$ = null;
      console.info('Unsubscribe watcher');
    }
  }

  public findUserById(userId: string): User {
    return this.users.find((item: User) => item.userId === userId);
  }

  public findUserBySocket(socketId: string): User {
    return this.users.find((item: User) => !!item.sockets.find((socket) => socket.id === socketId));
  }

  registerWatcher() {
    this.watcher$ = timer(0, 5000).subscribe(() => {
      this.users.forEach((user: User) => {
        this.runPlayerWatcher(user);
      });
    });
  }

  runPlayerWatcher(user: User) {
    const stickyUser = user;
    this.spotifyService.getPlayerStatus(user.userId).pipe(take(1))
      .subscribe((playerStatus: PlayerStatus) => {
        let update = false;
        if (!playerStatus) {
          if (stickyUser.spotify.player.isPlaying || stickyUser.spotify.player.isActive) {
            update = true;
          }
          stickyUser.spotify.player = {
            playing: null,
            isPlaying: false,
            item: null,
            isActive: false,
          };
        } else {
          if (playerStatus.is_playing !== user.spotify.player.isPlaying
            || stickyUser.spotify.player.isActive === false) {
            stickyUser.spotify.player.isPlaying = playerStatus.is_playing;
            stickyUser.spotify.player.isActive = true;
            update = true;
          }
          if ((!stickyUser.spotify.player.item)
            || playerStatus.item?.id !== stickyUser.spotify.player.item.id) {
            stickyUser.spotify.player.item = playerStatus.item;
            update = true;
          }
        }

        if (update) {
          user.sockets.forEach((socket) => {
            if (update) {
              socket.emit('player-state', stickyUser.spotify.player);
            }
          });
        }
      });
  }

  private logUser(payload: SyncPreConnect, socket: Socket) {
    const user = this.findUserById(payload.userId);
    if (user) {
      user.sockets.push(socket);
    } else {
      this.users.push({
        ...payload,
        sockets: [socket],
        spotify: {
          player: {
            isPlaying: false, playing: null, item: null, isActive: false,
          },
        },
      });
    }
    if (this.users.length === 1 && !this.watcher$) {
      this.registerWatcher();
    }
  }
}
