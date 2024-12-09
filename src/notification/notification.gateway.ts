import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*", // #ndak tnsa matbdelch l'etoile par le lien de l'application
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private connectedUsers: { [userId: string]: Socket } = {};

  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);

    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers[userId] = client;
      console.log(`User connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const userId in this.connectedUsers) {
      if (this.connectedUsers[userId].id === client.id) {
        delete this.connectedUsers[userId];
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  sendNotification(userId: string, message: string) {
    const userSocket = this.connectedUsers[userId];
    if (userSocket) {
      userSocket.emit("notification", message);
      console.log(`Notification sent to user ${userId}: ${message}`);
    }
  }

  broadcastNotification(message: string) {
    this.server.emit("notification", message);
    console.log(`Broadcast notification: ${message}`);
  }
}
