import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role, User, ProductStatus } from '@prisma/client';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a product (seller only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 404, description: 'Shop or category not found' })
  create(@Body() dto: CreateProductDto, @CurrentUser() user: User) {
    return this.productService.create(dto, user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my products (seller only)' })
  @ApiResponse({ status: 200, description: 'List of seller products' })
  findMyProducts(@CurrentUser() user: User) {
    return this.productService.findAll(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active products (public)' })
  @ApiQuery({ name: 'shopId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, description: 'List of active products' })
  findAllPublic(
    @Query('shopId') shopId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productService.findAllPublic(shopId, categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID (public)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (seller only)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (seller only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productService.remove(id, user.id);
  }

  @Patch(':id/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product inventory/quantity (seller only)' })
  @ApiBody({ schema: { type: 'object', properties: { quantity: { type: 'integer', example: 100 } } } })
  @ApiResponse({ status: 200, description: 'Inventory updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateInventory(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @CurrentUser() user: User,
  ) {
    return this.productService.updateInventory(id, quantity, user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product availability status (seller only)' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT'], example: 'ACTIVE' } } } })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
    @CurrentUser() user: User,
  ) {
    return this.productService.updateStatus(id, status, user.id);
  }
}
