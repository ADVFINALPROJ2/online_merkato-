import { Controller, Post, Body } from '@nestjs/common';
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
}
