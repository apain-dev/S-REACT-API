import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  Subscription,
  timer,
} from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Server,
  Socket,
} from 'socket.io';
import { PlayerStatus } from '../../models/spotify/player/player.dto';
import { SpotifyTrack } from '../../models/spotify/spotify.dto';
import SpotifyService from '../../modules/spotify/spotify.service';
import UsersService from '../../modules/users/users.service';
import Utils from '../../utils/utils';
import { SyncPreConnect } from '../models/sync.model';

export interface User {
  userId: string;
  sockets: Socket[];
  rooms: number[];
  spotify: {
    player: {
      isActive: boolean;
      isPlaying: boolean;
      playing: 'track' | 'playlist';
      item: SpotifyTrack;
    }
  }
}

interface Room {
  users: User[];
  messages: { userId: string, text: string }[];
  id: number;
  name: string;
}

@Injectable()
export class SyncService {
  private users: User[] = [];

  private rooms: Room[] = [];

  private watcher$: Subscription;

  constructor(private readonly spotifyService: SpotifyService,
    private readonly usersService: UsersService) {
  }

  static joinRoom(users: User[], room: Room) {
    users.forEach((user) => user.sockets.forEach((socket) => {
      socket.join(room.name);
      user.rooms.push(room.id);
    }));
  }

  createRoom(users: string[], socket: Socket): Room {
    const currentUser = this.findUserBySocket(socket.id);
    const currentId = this.rooms.reduce(
      (prevValue: number, value) => ((value.id > prevValue) ? value.id : prevValue), 0,
    );
    const room: Room = {
      users: [],
      id: currentId + 1,
      name: `room-${currentUser.userId}-${currentId + 1}`,
      messages: [],
    };
    const validatedUsers = [currentUser];
    users.forEach((user) => {
      const connectedUser = this.users.find((connectUser) => connectUser.userId === user);
      if (connectedUser) {
        validatedUsers.push(connectedUser);
      }
    });
    SyncService.joinRoom(validatedUsers, room);
    room.users = validatedUsers;
    this.rooms.push(room);
    return room;
  }

  async addUser(payload: SyncPreConnect, socket: Socket) {
    let user;
    try {
      user = await this.usersService.findOne({ _id: payload.userId });
    } catch (e) {
      return { error: 'cannot find user', code: 'SUSERNOTFOUND' };
    }
    if (!user.spotify || !user.spotify.accessToken) {
      return { error: 'User not connected to spotify', code: 'SSPOTIFYNOTCONNECTED' };
    }
    this.logUser(payload, socket);
    return null;
  }

  public logOut(socketId: string): User {
    const user = this.findUserBySocket(socketId);
    let deletedUser = null;
    if (!user) {
      return null;
    }
    if (user && user.sockets.length > 1) {
      const index = user.sockets.findIndex((socket) => socket.id === socketId);
      user.sockets.splice(index, 1);
    } else {
      const userIndex = this.users.findIndex((item: User) => item.userId === user.userId);
      [deletedUser] = this.users.splice(userIndex, 1);
    }

    if (this.users.length === 0) {
      this.watcher$.unsubscribe();
      this.watcher$ = null;
    }
    return deletedUser;
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

  leaveRoom(roomId: number, socket: Socket, server: Server) {
    const user = this.findUserBySocket(socket.id);

    const foundRoom = Utils.find<Room>(this.rooms, (room) => room.id === roomId);
    if (foundRoom.index === -1) {
      throw new WsException('Cannot find room');
    }
    const { index } = Utils.find<User>(foundRoom.value.users, (u) => u.userId === user.userId);
    if (index === -1) {
      throw new WsException(`Cannot find user in room ${foundRoom.value.id}`);
    }
    if (foundRoom.value.users.length > 2) {
      foundRoom.value.users.splice(index, 1);
      server.to(foundRoom.value.name).emit('room-user-left', { userId: user.userId });
    } else {
      this.rooms.splice(foundRoom.index, 1);
      server.to(foundRoom.value.name).emit('room-delete', { id: foundRoom.value.id });
    }
  }

  addMessageToRoom(payload: { roomId: number; message: string }, socket: Socket) {
    const room = this.rooms.find((roomItem) => roomItem.id === payload.roomId);
    if (!room) {
      throw new WsException(`Cannot find room ${room.id}`);
    }
    const user = this.findUserBySocket(socket.id);
    if (!user) {
      throw new WsException(`Cannot find user with socketId ${socket.id}`);
    }
    room.messages.push({ userId: user.userId, text: payload.message });
    return room;
  }

  unlinkUserFromRooms(deletedUser: User, server: Server) {
    deletedUser.rooms.forEach((roomId: number) => {
      const room = this.rooms.findIndex((item) => item.id === roomId);
      if (room === -1) {
        return;
      }
      if (this.rooms[room].users.length > 2) {
        const userIndex = this.rooms[room].users.findIndex(
          (user) => user.userId === deletedUser.userId,
        );
        if (userIndex === -1) {
          return;
        }
        this.rooms[room].users.splice(userIndex, 1);
        server.to(this.rooms[room].name).emit('room-user-left', { userId: deletedUser.userId });
      } else {
        server.to(this.rooms[room].name).emit('room-delete', { id: this.rooms[room].id });
        this.rooms.splice(room, 1);
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
        rooms: [],
        spotify: {
          player: {
            isPlaying: false, playing: null, item: null, isActive: false,
          },
        },
      });
    }
    /** if (this.users.length === 1 && !this.watcher$) {
      this.registerWatcher();
    }* */
  }
}
