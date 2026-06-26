import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty() // <-- Must be required
  name!: string; // <-- NO question mark here!

  @ApiProperty({ example: 'Devices and gadgets', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-of-parent-category' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

