import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty() // <-- Must be required
  name!: string; // <-- NO question mark here!

  @ApiProperty({ example: 'Devices and gadgets', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}