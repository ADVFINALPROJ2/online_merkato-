import { Controller, Get, Post, Body, Patch, UseGuards, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopLocationDto } from './dto/shop-location.dto';
import { User } from '@prisma/client';

@ApiTags('Shops')
@Controller('shops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Post()
  @Roles(Role.SELLER)
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

  @Patch()
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shop profile (seller only)' })
  @ApiBody({ type: UpdateShopDto })
  @ApiResponse({ status: 200, description: 'Shop updated successfully' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() dto: UpdateShopDto, @CurrentUser() user: User) {
    return this.shopService.update(dto, user.id);
  }

  @Post('location')
  @Roles(Role.SELLER)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update shop location (seller only)' })
  @ApiBody({ type: ShopLocationDto })
  @ApiResponse({ status: 201, description: 'Shop location saved successfully' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setLocation(@Body() dto: ShopLocationDto, @CurrentUser() user: User) {
    return this.shopService.setLocation(user.id, dto);
  }

  @Get('my')
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my shop profile (seller only)' })
  @ApiResponse({ status: 200, description: 'Shop found' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  getMyShop(@CurrentUser() user: User) {
    return this.shopService.findBySellerId(user.id);
  }

  @Get('dashboard')
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller dashboard stats (seller only)' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  getDashboard(@CurrentUser() user: User) {
    return this.shopService.getDashboard(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shop by public ID' })
  @ApiParam({ name: 'id', description: 'Shop public ID' })
  @ApiResponse({ status: 200, description: 'Shop found' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  findOne(@Param('id') id: string) {
    return this.shopService.findByPublicId(id);
  }
}
