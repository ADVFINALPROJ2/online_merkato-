import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Handmade Cotton Habesha Kemis' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Beautiful traditional dress made with pure organic cotton' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 4500.00 })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The UUID of the assigned Category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
