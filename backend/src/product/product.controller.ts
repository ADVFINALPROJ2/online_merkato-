import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Create a new product (Sellers Only)' })
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    // If your token directly payload maps user id as the shop scope anchor:
    const shopId = req.user.shopId || req.user.id || req.user.sub;
    return this.productService.create(createProductDto, shopId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all marketplace products (Public)' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID (Public)' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Update an owned product (Owner Only)' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: any) {
    const shopId = req.user.shopId || req.user.id || req.user.sub;
    return this.productService.update(id, updateProductDto, shopId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Delete an owned product (Owner Only)' })
  remove(@Param('id') id: string, @Req() req: any) {
    const shopId = req.user.shopId || req.user.id || req.user.sub;
    return this.productService.remove(id, shopId);
  }
}