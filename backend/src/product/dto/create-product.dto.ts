import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsInt, Min, IsOptional, IsArray, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Handmade Cotton Habesha Kemis' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name!: string; // <-- Added ! here

  @ApiProperty({ example: 'Beautiful traditional dress made with pure organic cotton' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  description!: string; // <-- Added ! here

  @ApiProperty({ example: 4500.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number; // <-- Added ! here

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  quantity!: number; // <-- Added ! here

  @ApiPropertyOptional({ example: ProductStatus.ACTIVE, enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: ['https://example.com/kemis1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The UUID of the assigned Category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string; // <-- Added ! here
}