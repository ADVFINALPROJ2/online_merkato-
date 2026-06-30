import { Controller, Post, Body, HttpCode, HttpStatus, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // Added this import

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new seller' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Seller registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Validation failed' })

  async register(@Body() dto: RegisterDto) {
  const result = await this.authService.register(dto);

  return result;
}


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in an existing seller' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }





  @Get('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate access token (optional utility)' })
  validateToken(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.authService['jwtService'].verify(token, {
        secret: process.env.JWT_SECRET || 'secret',
      });
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }
}