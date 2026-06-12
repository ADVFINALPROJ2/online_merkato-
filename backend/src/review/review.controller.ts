import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('products/:productId/reviews')
  reviewProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.reviewProduct(user.id, productId, dto);
  }

  @Post('sellers/:sellerId/reviews')
  reviewSeller(
    @CurrentUser() user: any,
    @Param('sellerId') sellerId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.reviewSeller(user.id, sellerId, dto);
  }

  @Get('products/:productId/reviews')
  @Public()
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }

  @Patch('reviews/:id')
  editReview(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.editReview(user.id, id, dto);
  }
}