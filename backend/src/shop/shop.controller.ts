import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { User } from '@prisma/client';

@ApiTags('Shops')
@Controller('shops')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shop (seller only)' })
  @ApiBody({ type: CreateShopDto })
  @ApiResponse({ status: 201, description: 'Shop created successfully' })
  @ApiResponse({ status: 409, description: 'Seller already owns a shop' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateShopDto, @CurrentUser() user: User) {
    return this.shopService.create(dto, user.id);
  }
}
