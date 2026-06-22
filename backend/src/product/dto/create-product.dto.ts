import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsInt, Min, IsOptional, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Bluetooth Headphones' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'High-quality wireless headphones with noise cancellation' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: [ProductStatus.ACTIVE], enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
