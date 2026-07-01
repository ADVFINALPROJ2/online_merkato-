import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { AssignmentService } from './assignment.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, AssignmentService],
  exports: [DeliveryService, AssignmentService],
})
export class DeliveryModule {}
