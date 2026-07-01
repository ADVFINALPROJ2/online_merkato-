import { IsIn } from 'class-validator';

export const DELIVERY_STATUSES = [
  'ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export class UpdateDeliveryStatusDto {
  @IsIn(DELIVERY_STATUSES)
  status: DeliveryStatus;
}
