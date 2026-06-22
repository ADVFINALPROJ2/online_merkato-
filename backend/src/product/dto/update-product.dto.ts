import { IsString, IsOptional, MinLength, MaxLength, IsNumber, IsInt, Min, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Wireless Bluetooth Headphones' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: 'High-quality wireless headphones with noise cancellation' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: 199.99 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
