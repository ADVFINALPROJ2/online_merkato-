import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID to add to cart' })
  @IsString()
  productId: string;

  @ApiProperty({ default: 1, description: 'Quantity to add' })
  @IsInt()
  @Min(1)
  quantity: number = 1;
}