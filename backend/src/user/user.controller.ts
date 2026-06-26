import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Using NestJS's built-in Passport Guard
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth() // Tells Swagger that this controller requires a JWT Token
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt')) // Automatically triggers your jwt.strategy.ts!
  @Get('profile')
  @ApiOperation({ summary: 'Get the logged-in user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: any) {
    // Passport automatically parses the token and attaches the payload to req.user
    const userId = req.user.id || req.user.sub; 
    return this.userService.getProfile(userId);
  }
}