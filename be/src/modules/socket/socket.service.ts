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
import multiavatar from '@multiavatar/multiavatar';
import { createCanvas, loadImage } from 'canvas';

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
  private positions = new Map<
    string,
    { position: { x: number; y: number }; avatarImg: string }
  >();

  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {}

  afterInit(server: Server) {
    console.log('Server initialized');
    this.positions.clear();
  }

  async handleConnection(socket: Socket) {
    console.log(`Connected: ${socket.id}`);
    const avatarImg = await this.generateRandomAvatar();
    this.positions.set(socket.id, {
      avatarImg,
      position: { x: 100, y: 100 },
    });
    socket.emit('init', Object.fromEntries(this.positions));
  }

  handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}`);
    this.positions.delete(socket.id);
    socket.broadcast.emit('player_left', socket.id);
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody()
    data: { position: { x: number; y: number }; avatarImg: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('socket is moving', { data });

    this.positions.set(socket.id, data);
    socket.broadcast.emit('moved', {
      id: socket.id,
      position: data.position,
    });
  }
  private async generateRandomAvatar(): Promise<string> {
    const seed = Math.random().toString(36).substring(2, 10);
    const svg = multiavatar(seed, true);
    const fixedSvg = svg.replace('<svg', '<svg width="64" height="64"');

    const svgBase64 = Buffer.from(fixedSvg).toString('base64');
    const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;
    const img = await loadImage(svgUrl);

    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 64, 64);

    const base64 = canvas.toDataURL('image/png');
    return base64;
  }
}
