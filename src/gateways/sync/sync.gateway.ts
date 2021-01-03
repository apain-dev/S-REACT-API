import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Server,
  Socket,
} from 'socket.io';
import { SyncPreConnect } from '../models/sync.model';
import { SyncService } from './sync.service';

@WebSocketGateway(8081, { path: '/sync' })
class SyncGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private syncService: SyncService) {
  }

  @SubscribeMessage('preconnect')
  handlePreConnect(@MessageBody() payload: SyncPreConnect, @ConnectedSocket() socket: Socket) {
    return this.syncService.addUser(payload, socket);
  }

  @SubscribeMessage('new-room')
  handleNewConversation(@MessageBody() payload: { ids: string[] },
    @ConnectedSocket() socket: Socket) {
    const room = this.syncService.createRoom(payload.ids, socket);
    this.server.to(room.name).emit('new-room', { messages: room.messages, id: room.id });
  }

  @SubscribeMessage('new-message')
  handleNewMessage(@MessageBody() payload: { roomId: number, message: string },
    @ConnectedSocket() socket: Socket) {
    const room = this.syncService.addMessageToRoom(payload, socket);
    this.server.to(room.name).emit('new-message', { messages: room.messages, id: room.id });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() payload: { roomId: number },
    @ConnectedSocket() socket: Socket) {
    this.syncService.leaveRoom(payload.roomId, socket, this.server);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const deletedUser = this.syncService.logOut(socket.id);
    if (deletedUser) {
      this.syncService.unlinkUserFromRooms(deletedUser, this.server);
    }
  }
}

export default SyncGateway;
