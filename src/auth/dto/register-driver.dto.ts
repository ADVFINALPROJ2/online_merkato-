import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDriverDto {
  @ApiProperty({ example: 'Abebe' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Bekele' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'driver@merkato.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+251912345678' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'MOTORCYCLE' })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ example: 'AA-B32145' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ example: 'https://example.com/id.jpg' })
  @IsString()
  @IsNotEmpty()
  idImageUrl: string;

  @ApiProperty({ example: 'https://example.com/license.jpg' })
  @IsString()
  @IsNotEmpty()
  licenseImageUrl: string;
}
