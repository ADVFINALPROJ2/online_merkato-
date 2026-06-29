import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCraftDto {
  @ApiProperty({ example: 'Custom Hand-Woven Dress' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Need a custom size Habesha Kemis with gold tilet borders.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  @IsNotEmpty()
  budget!: number;

  @ApiProperty({ example: 'https://example.com/design.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}