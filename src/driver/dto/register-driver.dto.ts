import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { VehicleType } from '@prisma/client';

export class RegisterDriverDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsNotEmpty()
  idImageUrl: string;

  @IsString()
  @IsOptional()
  licenseImageUrl?: string;
}