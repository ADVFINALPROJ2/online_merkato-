import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { IsEnum, IsEmail, IsString } from 'class-validator';

class SelectPaymentMethodDto {
  @IsEnum(['CASH', 'CHAPA'])
  method: 'CASH' | 'CHAPA';
}

class InitiatePaymentDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // #33
  @Post(':orderId/method')
  selectMethod(@CurrentUser() user: any, @Param('orderId') orderId: string, @Body() dto: SelectPaymentMethodDto) {
    return this.paymentService.selectPaymentMethod(user.id, orderId, dto.method);
  }

  // #34
  @Post(':orderId/initiate')
  initiate(@CurrentUser() user: any, @Param('orderId') orderId: string, @Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(user.id, orderId, dto.email, dto.firstName, dto.lastName);
  }

  // Callback (Chapa redirects here)
  @Get('verify/:txRef')
  @Public()
  verify(@Param('txRef') txRef: string) {
    return this.paymentService.verifyPayment(txRef);
  }
}