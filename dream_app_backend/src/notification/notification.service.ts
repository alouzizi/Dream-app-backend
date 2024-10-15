import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async notifyWebUser(userId: string, message: string) {
    console.log(`Notify web user ${userId}: ${message}`);
    this.notificationGateway.sendNotification(userId, message);
  }


  async broadcastNotification(message: string) {
    this.notificationGateway.broadcastNotification(message);
  }
}
