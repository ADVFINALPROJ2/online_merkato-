import {IsString, IsNotEmpty,MinLength,MaxLength,IsOptional,IsEmail,IsEnum, Matches,} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client'; 

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: '0911234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+2519|09)\d{8}$/, {
    message: 'phoneNumber must be in format +2519XXXXXXXX or 09XXXXXXXX',
  })
  phoneNumber!: string;

  @ApiProperty({ example: 'BUYER', enum: Role, description: 'Role must be BUYER, SELLER, or DELIVERY' })
  @IsEnum(Role)
  role: Role = Role.BUYER; // Defaults to BUYER

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'password must contain uppercase, lowercase, and a number',
  })
  password!: string;
}