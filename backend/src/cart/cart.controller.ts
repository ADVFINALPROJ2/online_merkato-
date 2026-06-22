import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CraftService } from './craft.service';
import { CreateCraftDto } from './dto/create-craft.dto';
import { UpdateCraftDto } from './dto/update-craft.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Craft Requests')
@Controller('craft')
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BUYER) // Enforces that only BUYERS can request custom crafts
  @ApiOperation({ summary: 'Submit a new custom craft request (Buyers Only)' })
  create(@Body() createCraftDto: CreateCraftDto, @Req() req: any) {
    const buyerId = req.user.id || req.user.sub;
    return this.craftService.create(createCraftDto, buyerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user custom craft requests (Public/Sellers View)' })
  findAll() {
    return this.craftService.findAll();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BUYER)
  @ApiOperation({ summary: 'Update an owned craft request (Owner Only)' })
  update(@Param('id') id: string, @Body() updateCraftDto: UpdateCraftDto, @Req() req: any) {
    const buyerId = req.user.id || req.user.sub;
    return this.craftService.update(id, updateCraftDto, buyerId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.BUYER)
  @ApiOperation({ summary: 'Cancel/Delete an owned craft request (Owner Only)' })
  remove(@Param('id') id: string, @Req() req: any) {
    const buyerId = req.user.id || req.user.sub;
    return this.craftService.remove(id, buyerId);
  }
}