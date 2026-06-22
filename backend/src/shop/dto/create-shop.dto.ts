import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({ example: "John's Electronics" })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Best electronics in town' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.png' })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @ApiPropertyOptional({ example: '+251911234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'contactPhone must be a valid phone number',
  })
  contactPhone?: string;

  @ApiPropertyOptional({
    example: 'ELECTRONICS',
    enum: ['ELECTRONICS', 'FASHION', 'FOOD', 'AGRICULTURE', 'HOME', 'OTHER'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['ELECTRONICS', 'FASHION', 'FOOD', 'AGRICULTURE', 'HOME', 'OTHER'])
  businessType?: string;
}
