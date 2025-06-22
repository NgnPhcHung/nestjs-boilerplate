import { UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketsExceptionFilter } from './socket.exception-filter';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@UseFilters(new WebsocketsExceptionFilter())
export class SocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private positions = new Map<string, { x: number; y: number }>();

  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {}

  afterInit(server: Server) {
    console.log('Server initialized');
    this.positions.clear(); // reset state mỗi lần khởi động
  }

  handleConnection(socket: Socket) {
    console.log(`Connected: ${socket.id}`);
    this.positions.set(socket.id, { x: 100, y: 100 });
    socket.emit('init', Object.fromEntries(this.positions));
  }

  handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}`);
    this.positions.delete(socket.id);
    socket.broadcast.emit('player_left', socket.id);
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() data: { x: number; y: number },
    @ConnectedSocket() socket: Socket,
  ) {
    this.positions.set(socket.id, data);
    socket.broadcast.emit('moved', { id: socket.id, x: data.x, y: data.y });
  }
}
