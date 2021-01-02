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
    this.syncService.addUser(payload, socket);
  }

  @SubscribeMessage('new-conversation')
  handleNewConversation(@MessageBody() payload: { candidate: string }) {
    this.server.emit('new-conversation-created', payload);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this.syncService.logOut(socket.id);
  }
}

export default SyncGateway;
