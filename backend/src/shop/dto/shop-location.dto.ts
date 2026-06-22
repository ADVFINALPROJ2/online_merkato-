import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShopLocationDto {
  @ApiProperty({ example: 'Addis Ababa' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Bole' })
  @IsString()
  @IsNotEmpty()
  subCity: string;

  @ApiProperty({ example: 'Bole 01' })
  @IsString()
  @IsNotEmpty()
  woreda: string;

  @ApiProperty({ example: '01' })
  @IsString()
  @IsNotEmpty()
  terra: string;

  @ApiProperty({ example: 9.0222 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 38.7467 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: 'Near Bole Medhanealem' })
  @IsString()
  @IsNotEmpty()
  landmark?: string;
}
