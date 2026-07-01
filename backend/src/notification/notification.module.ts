import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // <--- This is the key! Without this, other modules can't see it.
})
export class NotificationModule {}