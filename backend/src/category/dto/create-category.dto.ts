<<<<<<< HEAD
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
=======
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
>>>>>>> fyorina

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty() // <-- Must be required
  name!: string; // <-- NO question mark here!

  @ApiProperty({ example: 'Devices and gadgets', required: false })
  @IsString()
  @IsOptional()
  description?: string;
<<<<<<< HEAD

  @ApiPropertyOptional({ example: 'uuid-of-parent-category' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
=======
}
>>>>>>> fyorina
