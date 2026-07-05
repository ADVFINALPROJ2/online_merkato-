import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { DriverService } from './driver.service';
import { RegisterDriverDto } from './dto/register-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('register')
  async register(@Body() dto: RegisterDriverDto) {
    return this.driverService.register(dto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.driverService.login(email, password);
  }

  @Get('deliveries/:userId')
  async getDriverDeliveries(
    @Param('userId') userId: string,
  ) {
    return this.driverService.getDriverDeliveries(userId);
  }

  @Patch('deliveries/:deliveryId/complete')
  async markAsDelivered(@Param('deliveryId') deliveryId: string) {
    return this.driverService.markAsDelivered(deliveryId);
  }

  @Get('profile/:userId')
async getDriverProfile(@Param('userId') userId: string) {
  return this.driverService.getDriverProfile(userId);
}

}