import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The unique name of the product category',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'A brief description of the category',
    example: 'Devices, gadgets, and electronic accessories',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}