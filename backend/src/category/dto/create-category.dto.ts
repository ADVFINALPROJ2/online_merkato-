import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Handwoven Clothing', description: 'The unique name of the category' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Traditional garments made with organic cotton', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}