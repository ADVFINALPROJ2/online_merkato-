import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
<<<<<<< Updated upstream
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto'; // Added this import
=======
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LoginDto } from './dto/login.dto';
>>>>>>> Stashed changes

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/driver')
  async registerDriver(@Body() dto: RegisterDriverDto) {
    return this.authService.registerDriver(dto);
  }

  @Post('login')
<<<<<<< Updated upstream
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in an existing seller' })
  @ApiBody({ type: LoginSellerDto })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  login(@Body() dto: LoginSellerDto) {
    return this.authService.login(dto);
  }
}
=======
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
>>>>>>> Stashed changes
