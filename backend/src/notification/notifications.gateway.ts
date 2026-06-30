import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this to your frontend URL in production
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // When a user/seller logs in, they join a private room named after their User ID
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId);
    console.log(`User/Seller ${userId} joined their notification room.`);
  }

  // Helper method that your other backend services can call to send notifications
  sendNotification(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }
}