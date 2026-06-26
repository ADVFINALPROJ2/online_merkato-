import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN) 
  create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    return this.productService.create(createProductDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto, 
    @Request() req: any 
  ) {
    return this.productService.update(id, updateProductDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  remove(
    @Param('id') id: string, 
    @Request() req: any 
  ) {
    return this.productService.remove(id, req.user.id, req.user.role);
  }
}